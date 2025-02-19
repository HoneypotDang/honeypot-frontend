import Loader from "@/components/algebra/common/Loader";
import { Button } from "@/components/button/button-next";
import { ALGEBRA_POSITION_MANAGER } from "@/config/algebra/addresses";
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_CHAIN_NAME,
} from "@/config/algebra/default-chain-id";
import { useApprove } from "@/lib/algebra/hooks/common/useApprove";
import { useTransactionAwait } from "@/lib/algebra/hooks/common/useTransactionAwait";
import {
  usePosition,
  usePositions,
} from "@/lib/algebra/hooks/positions/usePositions";
import { IDerivedMintInfo } from "@/lib/algebra/state/mintStore";
import { TransactionType } from "@/lib/algebra/state/pendingTransactionsStore";
import { useUserState } from "@/lib/algebra/state/userStore";
import { ApprovalState } from "@/types/algebra/types/approve-state";
import {
  ADDRESS_ZERO,
  Currency,
  Field,
  NonfungiblePositionManager,
  Percent,
  ZERO,
} from "@cryptoalgebra/sdk";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { Address } from "viem";
import JSBI from "jsbi";
import { useEffect, useMemo } from "react";
import { useAccount, useContractWrite } from "wagmi";
import { useSimulateAlgebraPositionManagerMulticall } from "@/wagmi-generated";

interface IncreaseLiquidityButtonProps {
  baseCurrency: Currency | undefined | null;
  quoteCurrency: Currency | undefined | null;
  mintInfo: IDerivedMintInfo;
  tokenId?: number;
  handleCloseModal?: () => void;
}

const ZERO_PERCENT = new Percent("0");
const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000);

export const IncreaseLiquidityButton = ({
  mintInfo,
  tokenId,
  baseCurrency,
  quoteCurrency,
  handleCloseModal,
}: IncreaseLiquidityButtonProps) => {
  const { address: account } = useAccount();
  const { txDeadline } = useUserState();

  const { refetch: refetchAllPositions } = usePositions();

  const { refetch: refetchPosition } = usePosition(tokenId);

  const useNative = baseCurrency?.isNative
    ? baseCurrency
    : quoteCurrency?.isNative
      ? quoteCurrency
      : undefined;

  const { calldata, value } = useMemo(() => {
    if (
      !account ||
      !mintInfo.position ||
      JSBI.EQ(mintInfo.position.liquidity, ZERO)
    )
      return { calldata: undefined, value: undefined };

    return NonfungiblePositionManager.addCallParameters(mintInfo.position, {
      tokenId: tokenId || 0,
      slippageTolerance: mintInfo.outOfRange
        ? ZERO_PERCENT
        : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
      deadline: Date.now() + txDeadline,
      deployer: ADDRESS_ZERO,
      useNative,
    });
  }, [mintInfo, account, tokenId, txDeadline, useNative]);

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

  const { data: increaseLiquidityConfig } =
    useSimulateAlgebraPositionManagerMulticall({
      args: calldata && [calldata as `0x${string}`[]],
      query: {
        enabled: Boolean(calldata && isReady && tokenId),
      },
      value: BigInt(value || 0),
    });

  const { data: increaseLiquidityData, writeContract: increaseLiquidity } =
    useContractWrite();

  const { isLoading: isIncreaseLiquidityLoading, isSuccess } =
    useTransactionAwait(increaseLiquidityData, {
      title: `Add Liquidity to #${tokenId}`,
      tokenA: baseCurrency?.wrapped.address as Address,
      tokenB: quoteCurrency?.wrapped.address as Address,
      type: TransactionType.POOL,
    });

  useEffect(() => {
    if (!isSuccess) return;
    Promise.all([refetchPosition(), refetchAllPositions()]).then(() =>
      handleCloseModal?.()
    );
  }, [isSuccess]);

  if (mintInfo.errorMessage)
    return <Button disabled>{mintInfo.errorMessage}</Button>;

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
      disabled={!isReady || isIncreaseLiquidityLoading}
      onClick={() =>
        increaseLiquidityConfig &&
        increaseLiquidity(increaseLiquidityConfig.request)
      }
      className="whitespace-nowrap w-full text-black rounded-md border-6 border-[rgba(225,138,32,0.40)] bg-gradient-to-b from-[rgba(232,211,124,0.13)] to-[#FCD729] bg-[#F7931A]"
    >
      {isIncreaseLiquidityLoading ? <Loader /> : "Add Liquidity"}
    </Button>
  );
};

export default IncreaseLiquidityButton;
