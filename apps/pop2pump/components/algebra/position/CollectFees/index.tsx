import Loader from "@/components/algebra/common/Loader";
import { Button } from "@/components/algebra/ui/button";
import { Skeleton } from "@/components/algebra/ui/skeleton";
import { useTransactionAwait } from "@/lib/algebra/hooks/common/useTransactionAwait";
import { usePositionFees } from "@/lib/algebra/hooks/positions/usePositionFees";
import { NonfungiblePositionManager } from "@cryptoalgebra/sdk";
import { ReactNode, useMemo } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { Address } from "viem";
import { IDerivedMintInfo } from "@/lib/algebra/state/mintStore";
import { TransactionType } from "@/lib/algebra/state/pendingTransactionsStore";
import { useSimulateAlgebraPositionManagerMulticall } from "@/wagmi-generated";

interface CollectFeesProps {
  mintInfo: IDerivedMintInfo;
  positionFeesUSD: string | ReactNode | undefined;
  positionId: number;
}

const CollectFees = ({
  mintInfo,
  positionFeesUSD,
  positionId,
}: CollectFeesProps) => {
  const { address: account } = useAccount();

  const pool = mintInfo.pool;

  const { amount0, amount1 } = usePositionFees(
    pool ?? undefined,
    positionId,
    false
  );

  const zeroRewards = amount0?.equalTo("0") && amount1?.equalTo("0");

  const { calldata, value } = useMemo(() => {
    if (!account || !amount0 || !amount1)
      return { calldata: undefined, value: undefined };

    return NonfungiblePositionManager.collectCallParameters({
      tokenId: positionId.toString(),
      expectedCurrencyOwed0: amount0,
      expectedCurrencyOwed1: amount1,
      recipient: account,
    });
  }, [positionId, amount0, amount1, account]);

  const { data: collectConfig } = useSimulateAlgebraPositionManagerMulticall({
    args: calldata && [calldata as `0x${string}`[]],
    value: BigInt(value || 0),
  });

  const { data: collectData, writeContract: collect } = useContractWrite();

  const { isLoading } = useTransactionAwait(collectData, {
    title: "Collect fees",
    tokenA: mintInfo.currencies.CURRENCY_A?.wrapped.address as Address,
    tokenB: mintInfo.currencies.CURRENCY_B?.wrapped.address as Address,
    type: TransactionType.POOL,
  });

  const collectedFees =
    positionFeesUSD === "$0" && !zeroRewards ? "< $0.001" : positionFeesUSD;

  return (
    <div className="flex w-full justify-between rounded-xl">
      <div className="text-left">
        {/* <div className="font-bold text-xs">EARNED FEES</div> */}
        <div className="font-semibold text-2xl">
          {collectedFees ? (
            <div className="text-[#479FFF]">{collectedFees}</div>
          ) : (
            <Skeleton className="w-[100px] h-[30px]" />
          )}
        </div>
      </div>
      <Button
        size={"md"}
        disabled={!collect || zeroRewards || isLoading || !collectConfig}
        onClick={() => collectConfig && collect(collectConfig.request)}
      >
        {isLoading ? (
          <Loader />
        ) : (
          // FIXME: color white
          <div className="text-white rounded-lg border-2 border-[rgba(225,138,32,0.40)] bg-[rgba(225,138,32,0.40)] backdrop-blur-sm p-2.5">
            Collect fees
          </div>
        )}
      </Button>
    </div>
  );
};

export default CollectFees;
