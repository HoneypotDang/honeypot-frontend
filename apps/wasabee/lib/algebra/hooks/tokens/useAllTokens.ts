import { useMemo } from "react";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { ADDRESS_ZERO } from "@cryptoalgebra/sdk";
import {
  DEFAULT_NATIVE_SYMBOL,
  DEFAULT_NATIVE_NAME,
} from "@/config/algebra/default-chain-id";
import {
  useAllTokensQuery,
  TokenFieldsFragment,
} from "../../graphql/generated/graphql";
import { useTokensState } from "../../state/tokensStore";

interface ImportedToken {
  id: string;
  decimals: string | number;
  symbol: string;
  name: string;
}

export function useAllTokens(showNativeToken: boolean = true) {
  const chainId = useChainId();

  const { data: allTokens, loading } = useAllTokensQuery();

  const { importedTokens } = useTokensState();

  const tokensBlackList: Address[] = useMemo(() => [], []);

  const mergedTokens = useMemo(() => {
    const tokens = new Map<Address, Partial<TokenFieldsFragment>>();

    if (!allTokens) {
      const _importedTokens = Object.values(importedTokens[chainId] || []) as ImportedToken[];
      for (const token of _importedTokens) {
        tokens.set(token.id.toLowerCase() as Address, {
          ...token,
          decimals: token.decimals.toString(),
        });
      }
      // return [...tokens].map(([, token]) => ({ ...token }));
      return Object.values(tokens).map((token) => ({ ...token }));
    }

    if (showNativeToken)
      tokens.set(ADDRESS_ZERO, {
        id: ADDRESS_ZERO,
        symbol: DEFAULT_NATIVE_SYMBOL,
        name: DEFAULT_NATIVE_NAME,
        decimals: "18",
        derivedMatic: "1",
      });

    for (const token of allTokens.tokens.filter(
      (token) => !tokensBlackList.includes(token.id as Address)
    )) {
      tokens.set(token.id.toLowerCase() as Address, { ...token });
    }

    const _importedTokens = Object.values(importedTokens[chainId] || []) as ImportedToken[];

    for (const token of _importedTokens) {
      tokens.set(token.id.toLowerCase() as Address, {
        ...token,
        derivedMatic: 0,
        decimals: token.decimals.toString(),
      });
    }

    //return [...tokens].map(([, token]) => ({ ...token }));
    return Object.values(tokens).map((token) => ({ ...token }));
  }, [allTokens, importedTokens, tokensBlackList, chainId, showNativeToken]);

  return useMemo(
    () => ({
      tokens: mergedTokens,
      isLoading: loading || Boolean(allTokens && !mergedTokens.length),
    }),
    [mergedTokens, allTokens, loading]
  );
}
