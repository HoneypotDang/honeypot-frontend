import { useQuery } from "@tanstack/react-query";
import { infoClient } from ".";
import {
  PoolsByTokenPairQuery,
  PoolsByTokenPairDocument,
  PoolsByTokenPairQueryVariables,
  UserActivePositionsDocument,
  UserActivePositionsQuery,
  UserActivePositionsQueryVariables,
  useUserActivePositionsQuery,
  Pool,
  UserActivePositionsQueryResult,
  useNativePriceQuery,
} from "../generated/graphql";
import { Address, getContract } from "viem";
import { algebraPositionManagerAddress } from "@/wagmi-generated";
import { algebraPositionManagerAbi } from "@/wagmi-generated";
import { useEffect, useState } from "react";
import { MAX_UINT128 } from "@/config/algebra/max-uint128";
import { wallet } from "@/services/wallet";
import { CurrencyAmount, Token as AlgebranToken } from "@cryptoalgebra/sdk";
import { unwrappedToken } from "@cryptoalgebra/sdk";
import BigNumber from "bignumber.js";
import { object } from "zod";
import { PairContract } from "@/services/contract/dex/liquidity/pair-contract";
import { Token } from "@/services/contract/token";

export const poolQueryToContract = (pool: Pool): PairContract => {
  const pairContract = new PairContract({
    address: pool.id as Address,
    TVL_USD: pool.totalValueLockedUSD,
    volume_24h_USD: pool.poolDayData[0].volumeUSD,
    fees_24h_USD: pool.poolDayData[0].feesUSD,
  });

  pairContract.token0 = Token.getToken({
    address: pool.token0.id,
    decimals: pool.token0.decimals,
    name: pool.token0.name,
    symbol: pool.token0.symbol,
  });

  pairContract.token1 = Token.getToken({
    address: pool.token1.id,
    decimals: pool.token1.decimals,
    name: pool.token1.name,
    symbol: pool.token1.symbol,
  });

  return pairContract;
};

export const poolsByTokenPair = async (token0: string, token1: string) => {
  const { data } = await infoClient.query<
    PoolsByTokenPairQuery,
    PoolsByTokenPairQueryVariables
  >({
    query: PoolsByTokenPairDocument,
    variables: { token0, token1 },
  });

  return data?.pools;
};

export const userPools = async (userAddress: string) => {
  const { data } = await infoClient.query<
    UserActivePositionsQuery,
    UserActivePositionsQueryVariables
  >({
    query: UserActivePositionsDocument,
    variables: { account: userAddress.toLowerCase() },
  });

  const pools = data?.positions.map((position) => position.pool);

  return pools;
};

export const useUserPools = (userAddress: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fetchedPositions, setFetchedPositions] = useState<string[]>([]);
  const { data, loading, refetch } = useUserActivePositionsQuery({
    variables: { account: userAddress.toLowerCase() },
    //fetchPolicy: "cache-and-network",
    //notifyOnNetworkStatusChange: true,
    // pollInterval: 10000,
    onError: (error) => {
      setTimeout(() => {
        refetch();
      }, 1000);
    },
  });

  const [pools, setPools] = useState<
    Record<string, Pool & { fees: BigNumber }>
  >({});

  const algebraPositionManager = getContract({
    address: algebraPositionManagerAddress,
    abi: algebraPositionManagerAbi,
    client: { public: wallet.publicClient, wallet: wallet.walletClient },
  });

  useEffect(() => {
    if (!data || !wallet.isInit || !algebraPositionManager.simulate) return;
    data.positions.forEach(async (position) => {
      if (fetchedPositions.includes(position.pool.id.concat("-", position.id)))
        return;
      try {
        const pool = position.pool;
        const {
          result: [fees0, fees1],
        } = await algebraPositionManager.simulate.collect([
          {
            tokenId: BigInt(position.id),
            recipient: wallet.account as `0x${string}`,
            amount0Max: MAX_UINT128,
            amount1Max: MAX_UINT128,
          },
        ]);

        const fees0USD = CurrencyAmount.fromRawAmount(
          unwrappedToken(
            new AlgebranToken(
              wallet.currentChainId,
              pool.token0.id,
              Number(pool.token0.decimals),
              pool.token0.symbol,
              pool.token0.name
            )
          ),
          fees0.toString()
        );

        const fees1USD = CurrencyAmount.fromRawAmount(
          unwrappedToken(
            new AlgebranToken(
              wallet.currentChainId,
              pool.token1.id,
              Number(pool.token1.decimals),
              pool.token1.symbol,
              pool.token1.name
            )
          ),
          fees1.toString()
        );

        const fees0USDformatted = fees0USD
          ? Number(fees0USD.toSignificant()) * Number(pool.token0.derivedUSD)
          : 0;
        const fees1USDformatted = fees1USD
          ? Number(fees1USD.toSignificant()) * Number(pool.token1.derivedUSD)
          : 0;

        if (
          fetchedPositions.includes(position.pool.id.concat("-", position.id))
        )
          return;

        setPools((prev) => {
          if (prev[pool.id]) {
            return {
              ...prev,
              [pool.id]: {
                ...prev[pool.id],
                fees: prev[pool.id].fees.plus(
                  BigNumber(fees0USDformatted + fees1USDformatted)
                ),
              },
            };
          } else {
            return {
              ...prev,
              [pool.id]: {
                ...(pool as Pool),
                fees: BigNumber(fees0USDformatted + fees1USDformatted),
              },
            };
          }
        });

        fetchedPositions.push(pool.id.concat("-", position.id));
      } catch (error) {
        console.error(error);
      }
    });

    setIsLoading(false);
  }, [algebraPositionManager.simulate, data, wallet.isInit]);

  return {
    data: { pools: Object.values(pools) ?? [] },
    loading: isLoading,
    refetch: refetch,
  };
};
