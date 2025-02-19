import PageContainer from "@/components/algebra/common/PageContainer";
import ActiveFarming from "@/components/algebra/farming/ActiveFarming";
import MyPositions from "@/components/algebra/pool/MyPositions";
import MyPositionsToolbar from "@/components/algebra/pool/MyPositionsToolbar";
import PoolHeader from "@/components/algebra/pool/PoolHeader";
import PositionCard from "@/components/algebra/position/PositionCard";
import { Button } from "@/components/algebra/ui/button";
import { Skeleton } from "@/components/algebra/ui/skeleton";
import { useActiveFarming } from "@/lib/algebra/hooks/farming/useActiveFarming";
import { useClosedFarmings } from "@/lib/algebra/hooks/farming/useClosedFarmings";
import { usePool } from "@/lib/algebra/hooks/pools/usePool";
import { usePositions } from "@/lib/algebra/hooks/positions/usePositions";
import { getPositionAPR } from "@/lib/algebra/utils/positions/getPositionAPR";
import { getPositionFees } from "@/lib/algebra/utils/positions/getPositionFees";
import { formatAmountWithAlphabetSymbol } from "@/lib/algebra/utils/common/formatAmount";
import { ADDRESS_ZERO, Position, ZERO } from "@cryptoalgebra/sdk";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import JSBI from "jsbi";
import {
  useSinglePoolQuery,
  usePoolFeeDataQuery,
  useNativePriceQuery,
} from "@/lib/algebra/graphql/generated/graphql";
import { FormattedPosition } from "@/types/algebra/types/formatted-position";
import { Address, zeroAddress } from "viem";
import { cn } from "@/lib/tailwindcss";
import { Token } from "@/services/contract/token";
import CardContainer from "@/components/CardContianer/v3";
import { useRouter } from "next/router";
import { wallet } from "@/services/wallet";
import { observer } from "mobx-react-lite";
import { LoadingContainer } from "@/components/LoadingDisplay/LoadingDisplay";

const PoolPage = observer(() => {
  const { address: account } = useAccount();
  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);

  const router = useRouter();
  const { pool: poolId } = router.query as { pool: Address | undefined };

  const [selectedPositionId, selectPosition] = useState<number | null>();

  const [, poolEntity] = usePool(poolId ?? zeroAddress);

  const { data: poolInfo } = useSinglePoolQuery({
    variables: {
      poolId: poolId?.toLowerCase() ?? "",
    },
  });

  const { data: poolFeeData } = usePoolFeeDataQuery({
    variables: {
      poolId: poolId?.toLowerCase() ?? "",
    },
  });

  const { data: bundles } = useNativePriceQuery();
  const nativePrice = bundles?.bundles[0].maticPriceUSD;

  useEffect(() => {
    if (!wallet.isInit) return;
    if (poolInfo?.pool?.token0.id) {
      setToken0(
        Token.getToken({ address: poolInfo.pool.token0.id, force: true })
      );
    }
  }, [poolInfo?.pool?.token0.id, wallet.isInit]);

  useEffect(() => {
    if (!wallet.isInit) return;
    if (poolInfo?.pool?.token1.id) {
      setToken1(
        Token.getToken({ address: poolInfo.pool.token1.id, force: true })
      );
    }
  }, [poolInfo?.pool?.token1.id, wallet.isInit]);

  const { farmingInfo, deposits, isFarmingLoading, areDepositsLoading } =
    useActiveFarming({
      poolId: poolId ? (poolId.toLowerCase() as Address) : zeroAddress,
      poolInfo: poolInfo,
    });

  const { closedFarmings } = useClosedFarmings({
    poolId: poolId ? (poolId.toLowerCase() as Address) : zeroAddress,
    poolInfo: poolInfo,
  });

  const [positionsFees, setPositionsFees] = useState<any>();
  const [positionsAPRs, setPositionsAPRs] = useState<any>();

  const { positions, loading: positionsLoading } = usePositions();

  const filteredPositions = useMemo(() => {
    if (!positions || !poolEntity || !poolId) return [];

    return positions
      .filter(({ pool }) => pool.toLowerCase() === poolId?.toLowerCase())
      .map((position) => ({
        positionId: position.tokenId,
        position: new Position({
          pool: poolEntity,
          liquidity: position.liquidity.toString(),
          tickLower: Number(position.tickLower),
          tickUpper: Number(position.tickUpper),
        }),
      }));
  }, [positions, poolEntity, poolId]);

  useEffect(() => {
    async function getPositionsFees() {
      const fees = await Promise.all(
        filteredPositions.map(({ positionId, position }) =>
          getPositionFees(position.pool, positionId)
        )
      );
      setPositionsFees(fees);
    }

    if (filteredPositions) getPositionsFees();
  }, [filteredPositions]);

  useEffect(() => {
    if (!poolId) return;
    async function getPositionsAPRs() {
      const aprs = await Promise.all(
        filteredPositions.map(({ position }) =>
          getPositionAPR(
            poolId?.toLowerCase() as Address,
            position,
            poolInfo?.pool,
            poolFeeData?.poolDayDatas,
            nativePrice
          )
        )
      );
      setPositionsAPRs(aprs);
    }

    if (
      filteredPositions &&
      poolInfo?.pool &&
      poolFeeData?.poolDayDatas &&
      bundles?.bundles &&
      poolId.toLowerCase()
    )
      getPositionsAPRs();
  }, [filteredPositions, poolInfo, poolId, poolFeeData, bundles]);

  const formatLiquidityUSD = (position: Position) => {
    if (!poolInfo?.pool) return 0;

    const amount0USD =
      Number(position.amount0.toSignificant()) *
      (Number(poolInfo.pool.token0.derivedMatic) * (Number(nativePrice) || 0));
    const amount1USD =
      Number(position.amount1.toSignificant()) *
      (Number(poolInfo.pool.token1.derivedMatic) * (Number(nativePrice) || 0));

    return amount0USD + amount1USD;
  };

  const formatFeesUSD = (idx: number) => {
    if (!positionsFees || !positionsFees[idx] || !poolInfo?.pool) return 0;

    const fees0USD = positionsFees[idx][0]
      ? Number(positionsFees[idx][0].toSignificant()) *
        (Number(poolInfo.pool.token0.derivedMatic) * Number(nativePrice))
      : 0;
    const fees1USD = positionsFees[idx][1]
      ? Number(positionsFees[idx][1].toSignificant()) *
        (Number(poolInfo.pool.token1.derivedMatic) * Number(nativePrice))
      : 0;

    return fees0USD + fees1USD;
  };

  const formatAPR = (idx: number) => {
    if (!positionsAPRs || !positionsAPRs[idx]) return 0;
    return positionsAPRs[idx];
  };

  const positionsData = useMemo(() => {
    if (!filteredPositions || !poolEntity || !deposits) return [];

    return filteredPositions.map(({ positionId, position }, idx) => {
      const currentPosition = deposits.deposits.find(
        (deposit) => Number(deposit.id) === Number(positionId)
      );
      return {
        id: positionId,
        isClosed: JSBI.EQ(position.liquidity, ZERO),
        outOfRange:
          poolEntity.tickCurrent < position.tickLower ||
          poolEntity.tickCurrent > position.tickUpper,
        range: `${formatAmountWithAlphabetSymbol(position.token0PriceLower.toFixed(6), 6)} — ${formatAmountWithAlphabetSymbol(position.token0PriceUpper.toFixed(6), 6)}`,
        liquidityUSD: formatLiquidityUSD(position),
        feesUSD: formatFeesUSD(idx),
        apr: formatAPR(idx),
        inFarming: Boolean(currentPosition?.eternalFarming),
      } as FormattedPosition;
    });
  }, [
    filteredPositions,
    poolEntity,
    poolInfo,
    positionsFees,
    positionsAPRs,
    deposits,
  ]);

  const selectedPosition = useMemo(() => {
    if (!positionsData || !selectedPositionId) return;

    return positionsData.find(
      ({ id }) => Number(id) === Number(selectedPositionId)
    );
  }, [selectedPositionId, positionsData]);

  const noPositions =
    (!positionsLoading || !isFarmingLoading || !areDepositsLoading) &&
    positionsData.length === 0 &&
    poolEntity;

  return (
    <PageContainer>
      <CardContainer className="gap-y-6">
        <LoadingContainer isLoading={!poolEntity}>
          <PoolHeader pool={poolEntity} token0={token0} token1={token1} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-0 gap-y-8 w-full lg:gap-8">
            <div className="col-span-2">
              {!account ? (
                <NoAccount />
              ) : positionsLoading || isFarmingLoading || areDepositsLoading ? (
                <LoadingState />
              ) : noPositions ? (
                <NoPositions poolId={poolId ? poolId : zeroAddress} />
              ) : (
                <>
                  <MyPositionsToolbar
                    positionsData={positionsData}
                    poolId={poolId ? poolId : zeroAddress}
                  />
                  <MyPositions
                    positions={positionsData}
                    poolId={poolId ? poolId : zeroAddress}
                    selectedPosition={selectedPosition?.id}
                    selectPosition={(positionId) =>
                      selectPosition((prev) =>
                        prev === positionId ? null : positionId
                      )
                    }
                  />
                  {farmingInfo &&
                    deposits &&
                    !isFarmingLoading &&
                    !areDepositsLoading && (
                      <div>
                        <h2 className="font-semibold text-xl text-left mt-12">
                          Farming
                        </h2>
                        <ActiveFarming
                          deposits={deposits && deposits.deposits}
                          farming={farmingInfo}
                          positionsData={positionsData}
                        />
                      </div>
                    )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-8 w-full h-full">
              <PositionCard
                farming={farmingInfo}
                closedFarmings={closedFarmings}
                selectedPosition={selectedPosition}
              />
            </div>
          </div>
        </LoadingContainer>
      </CardContainer>
    </PageContainer>
  );
});

const NoPositions = ({ poolId }: { poolId: Address }) => (
  <div className="flex flex-col items-start animate-fade-in font-bold p-8 rounded-[24px] border border-black bg-white shadow-[4px_4px_0px_0px_#D29A0D]">
    <h2 className="text-2xl font-bold">
      {`You don't have positions for this pool`}
    </h2>
    <p className="text-md font-semibold my-4">{`Let's create one!`}</p>
    <Button className="gap-2" asChild>
      <Link
        className={cn(
          "flex items-center gap-x-1 p-2.5 cursor-pointer border border-[#2D2D2D] bg-[#FFCD4D] rounded-2xl shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFD666]"
        )}
        href={`/new-position/${poolId.toLowerCase()}`}
      >
        <Plus className="text-black" />
        <span className="text-black">Create Position</span>
      </Link>
    </Button>
  </div>
);

const NoAccount = () => {
  const { open } = useWeb3Modal();

  return (
    <div className="flex flex-col items-start p-8 bg-card border border-card-border rounded-3xl animate-fade-in">
      <h2 className="text-2xl font-bold">Connect Wallet</h2>
      <p className="text-md font-semibold my-4">
        Connect your account to view or create positions
      </p>
      <Button onClick={() => open()}>Connect Wallet</Button>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col w-full gap-4 p-4">
    {[1, 2, 3, 4].map((v) => (
      <Skeleton
        key={`position-skeleton-${v}`}
        className="w-full h-[50px] bg-card-light rounded-xl"
      />
    ))}
  </div>
);

export default PoolPage;
