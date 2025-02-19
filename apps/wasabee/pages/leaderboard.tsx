import { useState } from "react";
import { debounce } from "lodash";
import { Link, Tooltip } from "@nextui-org/react";
import { useTotalUsers } from "@/lib/hooks/useTotalUsers";
import CardContainer from "@/components/CardContianer/v3";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { shortenAddressString, formatVolume } from "@/lib/utils";
import { wallet } from "@/services/wallet";
import {
  useAccounts,
  useTopSwapAccounts,
  useTopPot2PumpDeployer,
  useTopParticipateAccounts,
} from "@/lib/hooks/useAccounts";
import { formatExtremelyLargeNumber } from "@/lib/format";

interface LeaderboardItem {
  rank: number;
  walletAddress: string;
  username?: string;
  xp: number;
  totalVolume?: number;
  transactions?: number;
  lastActive?: string;
}

interface StatsCard {
  title: string;
  value: string | number;
  subValue?: string;
  decimals?: number;
}

const LeaderboardPage = () => {
  const [searchAddress, setSearchAddress] = useState("");
  const searchDebounceHandler = debounce(setSearchAddress, 500);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { stats, loading: statsLoading } = useLeaderboard();
  const { totalUsers, loading: usersLoading } = useTotalUsers();
  const {
    accounts,
    loading: accountsLoading,
    hasMore,
    loadMore,
  } = useAccounts(page, pageSize, searchAddress);
  const { accounts: topSwapAccounts, loading: topSwapAccountsLoading } =
    useTopSwapAccounts();
  const {
    accounts: topPot2PumpDeployerAccounts,
    loading: topPot2PumpDeployerAccountsLoading,
  } = useTopPot2PumpDeployer();
  const {
    accounts: topParticipateAccounts,
    loading: topParticipateAccountsLoading,
  } = useTopParticipateAccounts();

  const statsCards: StatsCard[] = [
    { title: "Users", value: usersLoading ? "Loading..." : totalUsers, decimals: 0 },
    stats
      ? {
          title: stats.totalTrades.title,
          value: stats.totalTrades.value,
          decimals: 0,
        }
      : { title: "Total Trades", value: "-" },
    stats
      ? {
          title: stats.totalVolume.title,
          value: stats.totalVolume.value,
          decimals: 2,
          subValue: "USD",
        }
      : { title: "Total Volume", value: "-" },
    stats
      ? {
          title: stats.tvl.title,
          value: stats.tvl.value,
          decimals: 2,
          subValue: "USD",
        }
      : { title: "TVL", value: "-" },
  ];

  // 将这个变量重命名为 topStats
  const topStats = [
    {
      title: "Top Trader",
      address: topSwapAccounts[0]?.walletAddress ?? "-",
      value: `${topSwapAccounts[0]?.swapCount ?? "-"} Swaps`,
    },
    {
      title: "Top Deployer",
      address: topPot2PumpDeployerAccounts[0]?.walletAddress ?? "-",
      value: `${topPot2PumpDeployerAccounts[0]?.pot2PumpDeployCount ?? "-"} Deploys`,
    },
    {
      title: "Top Participant",
      address: topParticipateAccounts[0]?.walletAddress ?? "-",
      value: `${topParticipateAccounts[0]?.participateCount ?? "-"} Participations`,
    },
  ];

  return (
    <CardContainer className="xl:max-w-[1200px] mx-auto w-[calc(100%-32px)]">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="max-w-full xl:max-w-[1200px] mx-auto">
          {/* 顶部统计卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((stat, index) => (
              <div key={index} className="bg-[#202020] rounded-2xl p-5">
                <div className="text-gray-400 text-sm mb-2">{stat.title}</div>
                <div className="text-white text-xl font-medium">
                  {statsLoading
                    ? "Loading..."
                    : typeof stat.value === "string" &&
                        stat.value.startsWith("$")
                      ? formatExtremelyLargeNumber(
                          stat.value.slice(1).replace(/,/g, ''),
                          stat.decimals,
                          { addPrefix: true }
                        )
                      : stat.subValue === "USD"
                        ? formatExtremelyLargeNumber(stat.value, 0, {
                            addPrefix: true,
                          })
                        : formatExtremelyLargeNumber(stat.value, 0, {
                            addPrefix: false,
                          })}
                </div>
              </div>
            ))}
          </div>

          {/* Top Traders/Deployers/Participants */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {topStats.map((stat, index) => (
              <div key={index} className="bg-[#202020] rounded-2xl p-5">
                <div>
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm ${
                      index === 0
                        ? "bg-[#FFCD4D]"
                        : index === 1
                          ? "bg-purple-500"
                          : "bg-blue-500"
                    }`}
                  >
                    {stat.title}
                  </span>
                </div>
                <div className="mt-6 text-xl text-white font-medium mb-2">
                  <Tooltip content={stat.address} placement="top">
                    {shortenAddressString(stat.address)}
                  </Tooltip>
                </div>
                <div className="text-[#FFCD4D] text-base">{stat.value}</div>
              </div>
            ))}
          </div> */}

          {/* 搜索栏 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 flex-1 max-w-md">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => searchDebounceHandler(e.target.value)}
                placeholder="Search by address"
                className="w-full bg-[#1a1b1f] border border-gray-700 rounded-lg px-4 py-2 text-white"
              />
              {searchAddress && (
                <button
                  onClick={() => {
                    searchDebounceHandler("");
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-[#2a2a2a] rounded-lg text-white hover:bg-[#3a3a3a] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            {searchAddress && (
              <div className="text-gray-400 text-sm ml-4">
                {accountsLoading
                  ? "Searching..."
                  : accounts.length > 0
                    ? `Found ${accounts.length} results`
                    : "No results found"}
              </div>
            )}
          </div>

          {/* 交易数据表格 */}
          <div className="bg-[#202020] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#5C5C5C]">
              <h2 className="text-xl text-white font-bold">Leaderboard</h2>
            </div>
            <div className="p-6">
              <div className="border border-[#5C5C5C] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#323232] text-white border-b border-[#5C5C5C]">
                    <tr>
                      <th className="py-4 px-6 text-left text-base font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-[#FFCD4D] rounded"></div>
                          Address
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-base font-medium whitespace-nowrap">
                        Volume
                      </th>
                      <th className="py-4 px-6 text-center text-base font-medium whitespace-nowrap">
                        Swaps
                      </th>
                      {/* <th className="py-4 px-6 text-center text-base font-medium whitespace-nowrap">
                          Holding Pools
                        </th> */}
                      {/* <th className="py-4 px-6 text-center text-base font-medium whitespace-nowrap">
                        Meme Tokens
                      </th>
                      <th className="py-4 px-6 text-center text-base font-medium whitespace-nowrap">
                        P2P Participations
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="text-white divide-y divide-[#5C5C5C]">
                    {accountsLoading ? (
                      <tr>
                        <td colSpan={9} className="py-4 px-6 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : (
                      accounts.map((item, index) => (
                        <tr
                          key={item.walletAddress}
                          className="hover:bg-[#2a2a2a] transition-colors"
                        >
                          <td className="py-4 px-6 text-base font-mono text-blue-400">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-[#FFCD4D] rounded"></div>
                              <Tooltip
                                content={item.walletAddress}
                                placement="top"
                              >
                                <Link
                                  href={`https://berascan.com/address/${item.walletAddress}`}
                                  target="_blank"
                                  className="text-blue-400"
                                >
                                  {shortenAddressString(item.walletAddress)}
                                </Link>
                              </Tooltip>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-base">
                            {formatVolume(item.totalSpend)}
                          </td>
                          <td className="py-4 px-6 text-center text-base">
                            {item.swapCount}
                          </td>
                          {/* <td className="py-4 px-6 text-center text-base">
                              {item.poolHoldingCount}
                            </td> */}
                          {/* <td className="py-4 px-6 text-center text-base">
                            {item.memeTokenCount}
                          </td>
                          <td className="py-4 px-6 text-center text-base">
                            {item.participateCount}
                          </td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end border-t border-gray-700">
              <div className="flex items-center gap-6 max-w-[400px]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Page</span>
                    <span className="px-3 py-1 bg-[#1a1a1a] rounded text-white min-w-[40px] text-center">
                      {page}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (hasMore) {
                        loadMore().then(() => setPage((p) => p + 1));
                      }
                    }}
                    disabled={!hasMore || accountsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {accountsLoading && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default LeaderboardPage;
