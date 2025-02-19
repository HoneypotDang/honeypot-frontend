import { useQuery } from "@apollo/client";
import { LEADERBOARD_QUERY } from "../algebra/graphql/clients/leaderboard";
import BigNumber from "bignumber.js";
import type { FactoryData } from "../algebra/graphql/clients/leaderboard";
import { wallet } from "@/services/wallet";

export function useLeaderboard() {
  const { data, loading, error, refetch } =
    useQuery<FactoryData>(LEADERBOARD_QUERY);

  const formatValue = (value: string) => {
    const bn = new BigNumber(value || "0");
    return {
      usd: `$${bn.toFormat(2)}`,
      matic: `${bn.toFormat(2)} ${wallet.currentChain?.nativeToken?.symbol}`,
    };
  };

  const stats = data?.factories[0]
    ? {
        totalTrades: {
          title: "Total Trades",
          value: data.factories[0].txCount,
        },
        totalVolume: {
          title: "Total Volume",
          value: formatValue(data.factories[0].untrackedVolumeUSD).usd,
        },
        tvl: {
          title: "TVL",
          value: formatValue(data.factories[0].totalValueLockedUSD).usd,
        },
      }
    : null;

  return {
    stats,
    loading,
    error,
  };
}
