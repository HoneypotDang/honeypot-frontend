import { MAX_UINT128 } from "@/config/algebra/max-uint128";
import {
  useReadAlgebraPositionManagerOwnerOf,
  useSimulateAlgebraPositionManagerCollect,
} from "@/wagmi-generated";
import {
  Currency,
  CurrencyAmount,
  Pool,
  unwrappedToken,
} from "@cryptoalgebra/sdk";
import { useMemo } from "react";
import { Address } from "viem";

interface PositionFeesResult {
  amount0: CurrencyAmount<Currency> | undefined;
  amount1: CurrencyAmount<Currency> | undefined;
}

export function usePositionFees(
  pool?: Pool,
  tokenId?: number,
  asWNative = false
): PositionFeesResult {
  const { data: owner } = useReadAlgebraPositionManagerOwnerOf({
    args: tokenId ? [BigInt(tokenId)] : undefined,
  });

  const isReady = tokenId && owner;

  const { data: amountsConfig } = useSimulateAlgebraPositionManagerCollect({
    args: Boolean(isReady)
      ? [
          {
            tokenId: BigInt(tokenId || 0),
            recipient: owner as Address,
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
        ]
      : undefined,
    query: {
      enabled: Boolean(isReady),
    },
  });

  const amounts = amountsConfig?.result;

  return useMemo(() => {
    if (pool && amounts) {
      return {
        amount0: CurrencyAmount.fromRawAmount(
          !asWNative ? unwrappedToken(pool.token0) : pool.token0,
          amounts[0].toString()
        ),
        amount1: CurrencyAmount.fromRawAmount(
          !asWNative ? unwrappedToken(pool.token1) : pool.token1,
          amounts[1].toString()
        ),
      };
    } else {
      return {
        amount0: undefined,
        amount1: undefined,
      };
    }
  }, [pool, amounts]);
}
