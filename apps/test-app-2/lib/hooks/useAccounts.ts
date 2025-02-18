import { useQuery } from "@apollo/client";
import {
  ACCOUNTS_WITH_ADDRESS_QUERY,
  ACCOUNTS_WITHOUT_ADDRESS_QUERY,
  AccountsQueryData,
  PaginationParams,
  TOP_PARTICIPATE_ACCOUNTS_QUERY,
  TOP_POT2PUMP_DEPLOYER_QUERY,
  TOP_SWAP_ACCOUNTS_QUERY,
  TopParticipateAccountsQueryData,
  TopPot2PumpDeployerQueryData,
  TopSwapAccountsQueryData,
} from "../algebra/graphql/clients/leaderboard";
import dayjs from "dayjs";
import { ALGEBRA_ROUTER } from "@/config/algebra/addresses";

export function useAccounts(
  page: number = 1,
  pageSize: number = 10,
  searchAddress: string = ""
) {
  const { data, loading, error, fetchMore } = useQuery<AccountsQueryData>(
    searchAddress
      ? ACCOUNTS_WITH_ADDRESS_QUERY
      : ACCOUNTS_WITHOUT_ADDRESS_QUERY,
    {
      variables: {
        skip: (page - 1) * pageSize,
        first: pageSize,
        address: !!searchAddress ? searchAddress.toLowerCase() : undefined,
        exclude: [ALGEBRA_ROUTER.toLowerCase()],
      },
    }
  );

  const accounts =
    data?.accounts.map((account) => ({
      walletAddress: account.id,
      totalSpend: parseFloat(account.totalSpendUSD),
      swapCount: parseInt(account.swapCount),
      poolHoldingCount: parseInt(account.holdingPoolCount),
      memeTokenCount: parseInt(account.memeTokenHoldingCount),
      transactions: parseInt(account.platformTxCount),
      participateCount: parseInt(account.participateCount),
      lastActive: account.transaction[0]
        ? dayjs(parseInt(account.transaction[0].timestamp) * 1000).format(
            "MM/DD/YYYY, h:mm:ss A"
          )
        : "-",
    })) ?? [];

  const loadMore = () => {
    return fetchMore({
      variables: {
        skip: data?.accounts.length ?? 0,
        first: pageSize,
        exclude: [ALGEBRA_ROUTER.toLowerCase()],
      },
    });
  };

  return {
    accounts,
    loading,
    error,
    loadMore,
    hasMore: accounts.length === pageSize,
  };
}

export function useTopSwapAccounts() {
  const { data, loading, error } = useQuery<TopSwapAccountsQueryData>(
    TOP_SWAP_ACCOUNTS_QUERY,
    {
      variables: {
        exclude: [ALGEBRA_ROUTER.toLowerCase()],
      },
    }
  );
  return {
    accounts:
      data?.accounts.map((account) => ({
        walletAddress: account.id,
        swapCount: parseInt(account.swapCount),
      })) ?? [],
    loading,
    error,
  };
}

export function useTopPot2PumpDeployer() {
  const { data, loading, error } = useQuery<TopPot2PumpDeployerQueryData>(
    TOP_POT2PUMP_DEPLOYER_QUERY
  );
  return {
    accounts:
      data?.accounts.map((account) => ({
        walletAddress: account.id,
        pot2PumpDeployCount: parseInt(account.pot2PumpLaunchCount),
      })) ?? [],
    loading,
    error,
  };
}

export function useTopParticipateAccounts() {
  const { data, loading, error } = useQuery<TopParticipateAccountsQueryData>(
    TOP_PARTICIPATE_ACCOUNTS_QUERY
  );
  return {
    accounts:
      data?.accounts.map((account) => ({
        walletAddress: account.id,
        participateCount: parseInt(account.participateCount),
      })) ?? [],
    loading,
    error,
  };
}
