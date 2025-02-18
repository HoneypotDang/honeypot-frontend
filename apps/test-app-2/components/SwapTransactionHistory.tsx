import { useEffect, useState } from "react";
import { fetchSwapTransactions } from "@/lib/algebra/graphql/clients/swapTransactions";
import { truncate } from "@/lib/format";
import { Copy } from "@/components/Copy";
import { VscCopy } from "react-icons/vsc";
import { ExternalLink } from "lucide-react";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { SwapField } from "@/types/algebra/types/swap-field";
import { useDerivedSwapInfo } from "@/lib/algebra/state/swapStore";
import { zeroAddress } from "viem";
import { HoneyContainer } from "@/components/CardContianer";

const SwapTransactionHistory = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageSize = 10;

  const { currencies } = useDerivedSwapInfo();

  const baseCurrency = currencies[SwapField.INPUT];
  const quoteCurrency = currencies[SwapField.OUTPUT];

  useEffect(() => {
    const loadTransactions = async (currentPage: number) => {
      setLoading(true);
      try {
        const response = await fetchSwapTransactions(
          currentPage,
          pageSize,
          baseCurrency?.wrapped.address ?? zeroAddress,
          quoteCurrency?.wrapped.address ?? zeroAddress
        );
        setTransactions(response.data);
        setHasNextPage(response.pageInfo.hasNextPage);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions(page);
  }, [baseCurrency, page, pageSize, quoteCurrency]);

  const formatAmount = (amount: string) => {
    return new BigNumber(amount).toFixed(6);
  };

  return (
    <HoneyContainer variant="dense">
      <div className="p-2 sm:p-6 w-full">
        <div className="bg-[#202020] rounded-2xl overflow-hidden w-full">
          <div className="p-2 sm:p-6 w-full">
            <div className="border border-[#5C5C5C] rounded-2xl overflow-hidden overflow-x-auto w-full [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#323232] [&::-webkit-scrollbar-thumb]:bg-[#FFCD4D] [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:#FFCD4D_#323232] [scrollbar-width:thin]">
              <table className="w-full">
                <thead className="bg-[#323232] text-white">
                  <tr>
                    <th className="py-2 px-2 sm:px-4 text-left text-sm sm:text-base font-medium w-[160px] sm:w-[200px]">
                      Tx Hash
                    </th>
                    <th className="py-2 px-2 sm:px-4 text-left text-sm sm:text-base font-medium w-[160px] hidden md:table-cell">
                      User
                    </th>
                    <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium">
                      Amount In
                    </th>
                    <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium">
                      Amount Out
                    </th>
                    <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium hidden sm:table-cell">
                      Value
                    </th>
                    <th className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base font-medium">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="text-white divide-y divide-[#5C5C5C]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-2 px-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-2 px-4 text-center">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-[#2a2a2a] transition-colors"
                      >
                        <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://berascan.com/tx/${tx.transaction.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#FFCD4D] flex items-center gap-1"
                            >
                              {truncate(tx.transaction.id, 12)}
                              <ExternalLink className="size-3" />
                            </a>
                            <Copy
                              className="p-1 hover:bg-[#3a3a3a] rounded flex items-center justify-center min-w-[24px]"
                              value={tx.transaction.id}
                              content="Copy transaction hash"
                            >
                              <VscCopy className="size-3.5" />
                            </Copy>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-sm sm:text-base font-mono whitespace-nowrap hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://berascan.com/address/${tx.recipient}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#FFCD4D] flex items-center gap-1"
                            >
                              {truncate(tx.recipient, 12)}
                              <ExternalLink className="size-3" />
                            </a>
                            <Copy
                              className="p-1 hover:bg-[#3a3a3a] rounded flex items-center justify-center min-w-[24px]"
                              value={tx.recipient}
                              content="Copy address"
                            >
                              <VscCopy className="size-3.5" />
                            </Copy>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
                            <span>{formatAmount(tx.amount0)}</span>
                            <span className="text-sm text-gray-400">
                              {tx.token0.symbol}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row justify-end items-end gap-1">
                            <span>{formatAmount(tx.amount1)}</span>
                            <span className="text-sm text-gray-400">
                              {tx.token1.symbol}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap hidden sm:table-cell">
                          ${new BigNumber(tx.amountUSD).toFixed(2)}
                        </td>
                        <td className="py-2 px-2 sm:px-4 text-right text-sm sm:text-base whitespace-nowrap">
                          {dayjs(parseInt(tx.timestamp) * 1000).format(
                            "MM-DD HH:mm"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-end w-full">
              <div className="flex items-center gap-1 sm:gap-6">
                <div className="flex items-center gap-1 sm:gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="flex items-center gap-1 px-2 py-1.5 sm:py-2 bg-[#2a2a2a] rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors text-xs sm:text-base"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
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
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-gray-400 text-xs sm:text-base">
                      Page
                    </span>
                    <span className="px-2 py-1 bg-[#1a1a1a] rounded text-white min-w-[24px] sm:min-w-[40px] text-center text-xs sm:text-base">
                      {page}
                    </span>
                  </div>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage || loading}
                    className="flex items-center gap-1 px-2 py-1.5 sm:py-2 bg-[#2a2a2a] rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors text-xs sm:text-base"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </HoneyContainer>
  );
};

export default SwapTransactionHistory;
