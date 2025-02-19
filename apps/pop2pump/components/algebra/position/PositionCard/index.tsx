import { usePool } from "@/lib/algebra/hooks/pools/usePool";
import {
  usePosition,
  usePositionInFarming,
} from "@/lib/algebra/hooks/positions/usePositions";
import { Position } from "@cryptoalgebra/sdk";
import PositionNFT from "../PositionNFT";
import { Skeleton } from "@/components/algebra/ui/skeleton";
import PositionRangeChart from "../PositionRangeChart";
import TokenRatio from "@/components/algebra/create-position/TokenRatio";
import CollectFees from "../CollectFees";
import RemoveLiquidityModal from "@/components/algebra/modals/RemoveLiquidityModal";
import ActiveFarmingCard from "../ActiveFarmingCard";
import ClosedFarmingCard from "../ClosedFarmingCard";
import { IncreaseLiquidityModal } from "@/components/algebra/modals/IncreaseLiquidityModal";
import { useCurrency } from "@/lib/algebra/hooks/common/useCurrency";
import { EternalFarming } from "@/lib/algebra/graphql/generated/graphql";
import { useDerivedMintInfo } from "@/lib/algebra/state/mintStore";
import { formatUSD } from "@/lib/algebra/utils/common/formatUSD";
import { Farming } from "@/types/algebra/types/farming-info";
import { FormattedPosition } from "@/types/algebra/types/formatted-position";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";

interface PositionCardProps {
  selectedPosition: FormattedPosition | undefined;
  farming?: Farming | null;
  closedFarmings?: EternalFarming[] | null;
}

const PositionCard = ({
  selectedPosition,
  farming,
  closedFarmings,
}: PositionCardProps) => {
  const { loading, position } = usePosition(selectedPosition?.id);

  const positionInFarming = usePositionInFarming(selectedPosition?.id);

  const positionInEndedFarming = closedFarmings?.filter(
    (closedFarming) => closedFarming.id === positionInFarming?.eternalFarming
  )[0];

  const token0 = position?.token0;
  const token1 = position?.token1;

  const currencyA = useCurrency(token0, true);
  const currencyB = useCurrency(token1, true);

  const [, pool] = usePool(position?.pool);
  const positionEntity =
    pool &&
    position &&
    new Position({
      pool,
      liquidity: position.liquidity.toString(),
      tickLower: Number(position.tickLower),
      tickUpper: Number(position.tickUpper),
    });

  const mintInfo = useDerivedMintInfo(
    currencyA,
    currencyB,
    position?.pool,
    100,
    currencyA,
    positionEntity || undefined
  );

  const [positionLiquidityUSD, positionFeesUSD, positionAPR] = selectedPosition
    ? [
        DynamicFormatAmount({
          amount: selectedPosition.liquidityUSD.toString(),
          decimals: 3,
          endWith: "$",
        }),
        DynamicFormatAmount({
          amount: selectedPosition.feesUSD.toString(),
          decimals: 5,
          endWith: "$",
        }),
        `${selectedPosition.apr.toFixed(2)}%`,
      ]
    : [];

  if (!selectedPosition || loading) return;

  return (
    <div className="flex flex-col gap-6 rounded-3xl p-4 animate-fade-in bg-white text-black">
      <div className="relative flex w-full justify-end text-right">
        <div className="">
          <PositionNFT positionId={selectedPosition.id} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h2 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-2xl">{`Position #${selectedPosition?.id}`}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-xs">LIQUIDITY</div>
              <div className="font-semibold text-2xl">
                {positionLiquidityUSD ? (
                  <span className="text-[#479FFF] drop-shadow-cyan">
                    {positionLiquidityUSD}
                  </span>
                ) : (
                  <Skeleton className="w-[100px] h-[30px]" />
                )}
              </div>
            </div>
            <div>
              <div className="font-bold text-xs">APR</div>
              <div className="font-semibold text-2xl">
                {positionAPR ? (
                  <span className="text-[#F4AB36]">{positionAPR}</span>
                ) : (
                  <Skeleton className="w-[100px] h-[30px]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CollectFees
        positionFeesUSD={positionFeesUSD}
        mintInfo={mintInfo}
        positionId={selectedPosition.id}
      />
      <TokenRatio mintInfo={mintInfo} />
      {positionEntity && (
        <div className="flex justify-between font-semibold">
          <div>
            {`${positionEntity.amount0.toFixed(2)} ${currencyA?.symbol}`}
          </div>
          <div>
            {`${positionEntity.amount1.toFixed(2)} ${currencyB?.symbol}`}
          </div>
        </div>
      )}
      <div className="w-full px-4">
        {pool && positionEntity && (
          <PositionRangeChart pool={pool} position={positionEntity} />
        )}
      </div>
      {positionEntity && (
        <div className="flex gap-4 w-full whitespace-nowrap">
          <IncreaseLiquidityModal
            tokenId={Number(selectedPosition.id)}
            currencyA={currencyA}
            currencyB={currencyB}
            mintInfo={mintInfo}
          />
        </div>
      )}
      {positionEntity && Number(positionEntity.liquidity) > 0 && (
        <div className="flex gap-4 w-full whitespace-nowrap">
          <RemoveLiquidityModal positionId={selectedPosition.id} />
        </div>
      )}
      {positionInFarming && farming && !positionInEndedFarming && (
        <ActiveFarmingCard
          farming={farming}
          selectedPosition={positionInFarming}
        />
      )}
      {positionInEndedFarming && (
        <ClosedFarmingCard
          positionInEndedFarming={positionInEndedFarming}
          selectedPosition={selectedPosition}
        />
      )}
    </div>
  );
};

export default PositionCard;
