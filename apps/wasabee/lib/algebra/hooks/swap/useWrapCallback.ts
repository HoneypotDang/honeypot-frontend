import { Currency, WNATIVE, tryParseAmount } from "@cryptoalgebra/sdk";
import { useMemo } from "react";
import { useAccount, useBalance, useChainId, useContractWrite } from "wagmi";
import { useTransactionAwait } from "../common/useTransactionAwait";

import { Address } from "viem";
import { DEFAULT_NATIVE_SYMBOL } from "@/config/algebra/default-chain-id";
import { WNATIVE_EXTENDED } from "@/config/algebra/routing";
import {
  useSimulateWrappedNativeDeposit,
  useSimulateWrappedNativeWithdraw,
} from "@/wagmi-generated";
import { TransactionType } from "../../state/pendingTransactionsStore";
import { useToastify } from "@/lib/hooks/useContractToastify";

export const WrapType = {
  NOT_APPLICABLE: "NOT_APPLICABLE",
  WRAP: "WRAP",
  UNWRAP: "UNWRAP",
};

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };

export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: (typeof WrapType)[keyof typeof WrapType];
  execute?: undefined | (() => void);
  loading?: boolean;
  inputError?: string;
  isSuccess?: boolean;
} {
  const chainId = useChainId();
  const { address: account } = useAccount();

  const inputAmount = useMemo(
    () => tryParseAmount(typedValue, inputCurrency),
    [inputCurrency, typedValue]
  );

  const { data: wrapConfig } = useSimulateWrappedNativeDeposit({
    address: WNATIVE[chainId].address as Address,
    value: inputAmount ? BigInt(inputAmount.quotient.toString()) : undefined,
  });

  const { data: wrapData, writeContract: wrap } = useContractWrite();

  const {
    isLoading: isWrapLoading,
    isError: isWrapError,
    isSuccess: isWrapSuccess,
  } = useTransactionAwait(wrapData, {
    title: `Wrap ${inputAmount?.toSignificant(3)} ${DEFAULT_NATIVE_SYMBOL}`,
    tokenA: WNATIVE[chainId].address as Address,
    type: TransactionType.SWAP,
  });

  const { data: unwrapConfig } = useSimulateWrappedNativeWithdraw({
    address: WNATIVE[chainId].address as Address,
    args: inputAmount ? [BigInt(inputAmount.quotient.toString())] : undefined,
  });

  const {
    data: unwrapData,
    writeContract: unwrap,
    isError: isUnwrapError,
    isSuccess: isUnwrapSuccess,
  } = useContractWrite();

  const { isLoading: isUnwrapLoading } = useTransactionAwait(unwrapData, {
    title: `Unwrap ${inputAmount?.toSignificant(3)} W${DEFAULT_NATIVE_SYMBOL}`,
    tokenA: WNATIVE[chainId].address as Address,
    type: TransactionType.SWAP,
  });

  const { data: balance } = useBalance({
    query: {
      enabled: Boolean(inputCurrency),
    },
    address: account,
    token: inputCurrency?.isNative
      ? undefined
      : (inputCurrency?.address as Address),
  });

  return useMemo(() => {
    if (!chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE;
    const weth = WNATIVE_EXTENDED[chainId];
    if (!weth) return NOT_APPLICABLE;

    const hasInputAmount = Boolean(inputAmount?.greaterThan("0"));
    const sufficientBalance =
      inputAmount &&
      balance &&
      Number(balance.formatted) >= Number(inputAmount.toSignificant(18));

    if (inputCurrency.isNative && weth.equals(outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? () => wrapConfig && wrap(wrapConfig.request)
            : undefined,
        loading: isWrapLoading,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
            ? `Insufficient ${DEFAULT_NATIVE_SYMBOL} balance`
            : `Enter ${DEFAULT_NATIVE_SYMBOL} amount`,
        isSuccess: isWrapSuccess,
      };
    } else if (weth.equals(inputCurrency) && outputCurrency.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? () => unwrapConfig && unwrap(unwrapConfig.request)
            : undefined,
        loading: isUnwrapLoading,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
            ? `Insufficient W${DEFAULT_NATIVE_SYMBOL} balance`
            : `Enter W${DEFAULT_NATIVE_SYMBOL} amount`,
        isSuccess: isUnwrapSuccess,
      };
    } else {
      return NOT_APPLICABLE;
    }
  }, [
    chainId,
    inputCurrency,
    outputCurrency,
    inputAmount,
    balance,
    isWrapLoading,
    isUnwrapLoading,
    wrap,
    unwrap,
    isWrapSuccess,
    isUnwrapSuccess,
    wrapConfig,
    unwrapConfig,
  ]);
}
