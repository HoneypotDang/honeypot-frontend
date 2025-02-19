import { Address } from "viem";
import { Currency, ExtendedNative, WNATIVE } from "@cryptoalgebra/sdk";
import { ADDRESS_ZERO } from "@cryptoalgebra/sdk";
import { useAlgebraToken } from "./useAlgebraToken";
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_NATIVE_SYMBOL,
  DEFAULT_NATIVE_NAME,
} from "@/config/algebra/default-chain-id";

export function useCurrency(
  address: Address | undefined,
  withNative?: boolean
): Currency | ExtendedNative | undefined {
  const isWNative =
    address?.toLowerCase() === WNATIVE[DEFAULT_CHAIN_ID].address.toLowerCase();

  const isNative = address === ADDRESS_ZERO;

  const token = useAlgebraToken(isNative || isWNative ? ADDRESS_ZERO : address);

  const extendedEther = ExtendedNative.onChain(
    DEFAULT_CHAIN_ID,
    DEFAULT_NATIVE_SYMBOL,
    DEFAULT_NATIVE_NAME
  );

  if (withNative) return isNative || isWNative ? extendedEther : token;
  if (isWNative) return extendedEther.wrapped;
  return isNative ? extendedEther : token;
}
