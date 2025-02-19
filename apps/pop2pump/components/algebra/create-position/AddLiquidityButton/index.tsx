import Loader from "@/components/algebra/common/Loader";
import { Button } from "@/components/button/button-next";
import { ALGEBRA_POSITION_MANAGER } from "@/config/algebra/addresses";
import { useApprove } from "@/lib/algebra/hooks/common/useApprove";
import { useTransactionAwait } from "@/lib/algebra/hooks/common/useTransactionAwait";
import { IDerivedMintInfo } from "@/lib/algebra/state/mintStore";
import { TransactionType } from "@/lib/algebra/state/pendingTransactionsStore";
import { useUserState } from "@/lib/algebra/state/userStore";
import { ApprovalState } from "@/types/algebra/types/approve-state";
import {
  Percent,
  Currency,
  NonfungiblePositionManager,
  Field,
  ZERO,
  ADDRESS_ZERO,
} from "@cryptoalgebra/sdk";
import { Address } from "viem";
import JSBI from "jsbi";
import { useMemo } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { useSimulateAlgebraPositionManagerMulticall } from "@/wagmi-generated";

interface AddLiquidityButtonProps {
  baseCurrency: Currency | undefined | null;
  quoteCurrency: Currency | undefined | null;
  mintInfo: IDerivedMintInfo;
  poolAddress: Address | undefined;
}

const ZERO_PERCENT = new Percent("0");
const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

export const AddLiquidityButton = ({
  baseCurrency,
  quoteCurrency,
  mintInfo,
  poolAddress,
}: AddLiquidityButtonProps) => {
  const { address: account } = useAccount();

  const { txDeadline } = useUserState();

  const useNative = baseCurrency?.isNative
    ? baseCurrency
    : quoteCurrency?.isNative
      ? quoteCurrency
      : undefined;

  const { calldata, value } = useMemo(() => {
    console.log("mintInfo", mintInfo);
    if (
      !account ||
      !mintInfo.position ||
      JSBI.EQ(mintInfo.position.liquidity, ZERO)
    )
      return { calldata: undefined, value: undefined };

    return NonfungiblePositionManager.addCallParameters(mintInfo.position, {
      slippageTolerance: mintInfo.outOfRange
        ? ZERO_PERCENT
        : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
      recipient: account,
      deadline: Date.now() + txDeadline,
      deployer: ADDRESS_ZERO,
      useNative,
      createPool: mintInfo.noLiquidity,
    });
  }, [mintInfo, account, txDeadline, useNative]);

  const { approvalState: approvalStateA, approvalCallback: approvalCallbackA } =
    useApprove(
      mintInfo.parsedAmounts[Field.CURRENCY_A],
      ALGEBRA_POSITION_MANAGER
    );
  const { approvalState: approvalStateB, approvalCallback: approvalCallbackB } =
    useApprove(
      mintInfo.parsedAmounts[Field.CURRENCY_B],
      ALGEBRA_POSITION_MANAGER
    );

  const showApproveA =
    approvalStateA === ApprovalState.NOT_APPROVED ||
    approvalStateA === ApprovalState.PENDING;

  const showApproveB =
    approvalStateB === ApprovalState.NOT_APPROVED ||
    approvalStateB === ApprovalState.PENDING;

  const isReady = useMemo(() => {
    return Boolean(
      (mintInfo.depositADisabled
        ? true
        : approvalStateA === ApprovalState.APPROVED) &&
        (mintInfo.depositBDisabled
          ? true
          : approvalStateB === ApprovalState.APPROVED) &&
        !mintInfo.errorMessage &&
        !mintInfo.invalidRange
    );
  }, [mintInfo, approvalStateA, approvalStateB]);

  const { data: addLiquidityConfig, error } =
    useSimulateAlgebraPositionManagerMulticall({
      args: calldata && [calldata as `0x${string}`[]],
      query: {
        enabled: Boolean(calldata && isReady),
      },
      value: BigInt(value || 0),
    });

  console.log("addLiquidityConfig", addLiquidityConfig);
  console.log("error", error);

  const { data: addLiquidityData, writeContract: addLiquidity } =
    useContractWrite();

  const { isLoading: isAddingLiquidityLoading, data } = useTransactionAwait(
    addLiquidityData,
    {
      title: "Add liquidity",
      tokenA: baseCurrency?.wrapped.address as Address,
      tokenB: quoteCurrency?.wrapped.address as Address,
      type: TransactionType.POOL,
    },
    `/pool-detail/${poolAddress}`
  );

  console.log("data", data);

  if (mintInfo.errorMessage)
    return (
      <Button disabled className="w-full">
        {mintInfo.errorMessage}
      </Button>
    );

  if (showApproveA || showApproveB)
    return (
      <div className="flex w-full gap-2">
        {showApproveA && (
          <Button
            disabled={approvalStateA === ApprovalState.PENDING}
            className="w-full"
            onClick={() => approvalCallbackA && approvalCallbackA()}
          >
            {approvalStateA === ApprovalState.PENDING ? (
              <Loader />
            ) : (
              `Approve ${mintInfo.currencies.CURRENCY_A?.symbol}`
            )}
          </Button>
        )}
        {showApproveB && (
          <Button
            disabled={approvalStateB === ApprovalState.PENDING}
            className="w-full"
            onClick={() => approvalCallbackB && approvalCallbackB()}
          >
            {approvalStateB === ApprovalState.PENDING ? (
              <Loader />
            ) : (
              `Approve ${mintInfo.currencies.CURRENCY_B?.symbol}`
            )}
          </Button>
        )}
      </div>
    );

  return (
    <Button
      disabled={!isReady}
      onClick={() => {
        console.log("addLiquidityConfig", addLiquidityConfig);
        addLiquidityConfig && addLiquidity(addLiquidityConfig.request);
      }}
      className="whitespace-nowrap w-full text-black rounded-md border-6 border-[rgba(225,138,32,0.40)] bg-gradient-to-b from-[rgba(232,211,124,0.13)] to-[#FCD729] bg-[#F7931A]"
    >
      {isAddingLiquidityLoading ? <Loader /> : "Create Position"}
    </Button>
  );
};

export default AddLiquidityButton;
