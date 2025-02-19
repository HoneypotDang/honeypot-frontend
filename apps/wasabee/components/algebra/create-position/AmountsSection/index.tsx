import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/algebra/ui/hover-card";
import TokenRatio from "../TokenRatio";
import { Currency } from "@cryptoalgebra/sdk";
import { usePositionAPR } from "@/lib/algebra/hooks/positions/usePositionAPR";
import { getPoolAPR } from "@/lib/algebra/utils/pool/getPoolAPR";
import AddLiquidityButton from "../AddLiquidityButton";
import { Address } from "viem";
import { useEffect, useState } from "react";
import EnterAmounts from "../EnterAmounts";
import IncreaseLiquidityButton from "@/components/algebra/position/IncreaseLiquidityButton";
import { IDerivedMintInfo } from "@/lib/algebra/state/mintStore";
import { ManageLiquidity } from "@/types/algebra/types/manage-liquidity";
import { useRouter } from "next/router";

interface AmountsSectionProps {
  tokenId?: number;
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  mintInfo: IDerivedMintInfo;
  manageLiquidity: ManageLiquidity;
  handleCloseModal?: () => void;
}

type NewPositionPageParams = Record<"pool", Address>;

const AmountsSection = ({
  tokenId,
  currencyA,
  currencyB,
  mintInfo,
  manageLiquidity,
  handleCloseModal,
}: AmountsSectionProps) => {
  const router = useRouter();
  const { pool: poolAddress } = router.query as { pool: Address };

  const [poolAPR, setPoolAPR] = useState<number>();
  const apr = usePositionAPR(poolAddress, mintInfo.position);

  useEffect(() => {
    if (!poolAddress) return;
    getPoolAPR(poolAddress).then(setPoolAPR);
  }, [poolAddress]);

  return (
    <div className="flex flex-col gap-4">
      <EnterAmounts
        currencyA={currencyA}
        currencyB={currencyB}
        mintInfo={mintInfo}
      />

      <div className="w-full rounded-2xl border bg-card-dark shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] p-4">
        <HoverCard>
          <HoverCardTrigger>
            <TokenRatio mintInfo={mintInfo} />
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col gap-2 bg-white border border-black rounded-xl p-4">
            <div className="flex items-center">
              <span className="font-medium text-black">Token Ratio</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="w-full rounded-2xl border bg-white shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-[#202020]">
              POSITION APR
            </div>
            <div className="text-xl font-bold text-[#FFCD4D]">
              {apr ? `${apr.toFixed(2)}%` : "0%"}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-[#202020]">POOL APR</div>
            <div className="text-xl font-bold text-[#0ea5e9]">
              {poolAPR !== undefined ? `${poolAPR}%` : "0%"}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        {manageLiquidity === ManageLiquidity.INCREASE && (
          <IncreaseLiquidityButton
            tokenId={tokenId}
            baseCurrency={currencyA}
            quoteCurrency={currencyB}
            mintInfo={mintInfo}
            handleCloseModal={handleCloseModal}
          />
        )}
        {manageLiquidity === ManageLiquidity.ADD && (
          <AddLiquidityButton
            baseCurrency={currencyA}
            quoteCurrency={currencyB}
            mintInfo={mintInfo}
            poolAddress={poolAddress}
          />
        )}
      </div>
    </div>
  );
};

export default AmountsSection;
