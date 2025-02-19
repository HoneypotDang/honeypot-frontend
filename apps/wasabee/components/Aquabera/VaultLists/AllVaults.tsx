import { Link } from "@nextui-org/react";
import { wallet } from "@/services/wallet";
import { Currency } from "@cryptoalgebra/sdk";
import { Token } from "@/services/contract/token";
import { useEffect, useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/algebra/ui/button";
import TokenLogo from "@/components/TokenLogo/TokenLogo";
import { DepositToVaultModal } from "../modals/DepositToVaultModal";
import { getVaultPageData } from "@/lib/algebra/graphql/clients/vaults";
import { VaultsSortedByHoldersQuery } from "@/lib/algebra/graphql/generated/graphql";
import { ICHIVaultContract } from "@/services/contract/aquabera/ICHIVault-contract";


type SortField = "pair" | "address" | "tvl" | "volume" | "fees";
type SortDirection = "asc" | "desc";

interface AllAquaberaVaultsProps {
  searchString?: string;
}

export function AllAquaberaVaults({
  searchString = "",
}: AllAquaberaVaultsProps) {
  const [vaults, setVaults] = useState<VaultsSortedByHoldersQuery>();
  const [sortField, setSortField] = useState<SortField>("tvl");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<ICHIVaultContract | null>(
    null
  );
  const [selectedTokenA, setSelectedTokenA] = useState<Currency | null>(null);
  const [selectedTokenB, setSelectedTokenB] = useState<Currency | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }

    loadMyVaults(searchString);
  }, [wallet.isInit, searchString]);

  const loadMyVaults = async (search?: string) => {
    const vaultsQuery = getVaultPageData(search).then((res) => {
      setVaults(res);
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const pages = useMemo(() => {
    if (!vaults?.ichiVaults) return 0;
    return Math.ceil(vaults.ichiVaults.length / rowsPerPage);
  }, [vaults?.ichiVaults]);

  const getSortedVaults = () => {
    if (!vaults?.ichiVaults) return [];

    const sortedVaults = [...vaults.ichiVaults].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "pair":
          const aSymbol = Token.getToken({ address: a.tokenA }).symbol;
          const bSymbol = Token.getToken({ address: b.tokenA }).symbol;
          return multiplier * aSymbol.localeCompare(bSymbol);
        case "address":
          return multiplier * a.id.localeCompare(b.id);
        case "tvl":
          return (
            multiplier *
            (Number(a.pool?.totalValueLockedUSD || 0) -
              Number(b.pool?.totalValueLockedUSD || 0))
          );
        case "volume":
          return (
            multiplier *
            (Number(a.pool?.poolDayData?.[0]?.volumeUSD || 0) -
              Number(b.pool?.poolDayData?.[0]?.volumeUSD || 0))
          );
        case "fees":
          return (
            multiplier *
            (Number(a.pool?.poolDayData?.[0]?.feesUSD || 0) -
              Number(b.pool?.poolDayData?.[0]?.feesUSD || 0))
          );
        default:
          return 0;
      }
    });

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedVaults.slice(start, end);
  };

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th className="py-4 px-6 cursor-pointer text-[#4D4D4D]">
              <div
                className="flex items-center gap-2"
                onClick={() => handleSort("pair")}
              >
                <span>Token Pair</span>
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${sortField === "pair" && sortDirection === "asc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${sortField === "pair" && sortDirection === "desc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                </div>
              </div>
            </th>
            <th className="py-4 px-6 cursor-pointer text-[#4D4D4D]">
              <div
                className="flex items-center gap-2"
                onClick={() => handleSort("address")}
              >
                <span>Vault Address</span>
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${sortField === "address" && sortDirection === "asc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${sortField === "address" && sortDirection === "desc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                </div>
              </div>
            </th>
            <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
              <div
                className="flex items-center gap-2 justify-end"
                onClick={() => handleSort("tvl")}
              >
                <span>TVL</span>
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${sortField === "tvl" && sortDirection === "asc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${sortField === "tvl" && sortDirection === "desc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                </div>
              </div>
            </th>
            <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
              <div
                className="flex items-center gap-2 justify-end"
                onClick={() => handleSort("volume")}
              >
                <span>24h Volume</span>
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${sortField === "volume" && sortDirection === "asc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${sortField === "volume" && sortDirection === "desc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                </div>
              </div>
            </th>
            <th className="py-4 px-6 cursor-pointer text-right text-[#4D4D4D]">
              <div
                className="flex items-center gap-2 justify-end"
                onClick={() => handleSort("fees")}
              >
                <span>24h Fees</span>
                <div className="flex flex-col">
                  <ChevronUp
                    className={`h-3 w-3 ${sortField === "fees" && sortDirection === "asc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                  <ChevronDown
                    className={`h-3 w-3 ${sortField === "fees" && sortDirection === "desc" ? "text-black" : "text-[#4D4D4D]"}`}
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#4D4D4D]">
          {!getSortedVaults().length ? (
            <tr className="hover:bg-white border-white h-full">
              <td colSpan={5} className="h-24 text-center text-black">
                No results.
              </td>
            </tr>
          ) : (
            getSortedVaults().map((vault) => {
              const tokenA = Token.getToken({ address: vault.tokenA });
              const tokenB = Token.getToken({ address: vault.tokenB });

              tokenA.init();
              tokenB.init();

              const tvl = Number(
                vault.pool?.totalValueLockedUSD || 0
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              });

              const volume = Number(
                vault.pool?.poolDayData?.[0]?.volumeUSD || 0
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              });

              const fees = Number(
                vault.pool?.poolDayData?.[0]?.feesUSD || 0
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              });

              return (
                <tr
                  key={vault.id}
                  className="transition-colors bg-white text-black hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/vault/${vault.id}`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <TokenLogo
                          token={tokenA}
                          addtionalClasses="translate-x-[25%]"
                          size={24}
                        />
                        <TokenLogo
                          token={tokenB}
                          addtionalClasses="translate-x-[-25%]"
                          size={24}
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-black font-medium">
                          {tokenA.symbol}/{tokenB.symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-black">
                    {vault.id}
                  </td>
                  <td className="py-4 px-6 text-right text-black">
                    {tvl}
                  </td>
                  <td className="py-4 px-6 text-right text-black">
                    {volume}
                  </td>
                  <td className="py-4 px-6 text-right text-black">
                    {fees}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="p-4 border-t border-[#2D2D2D]">
        <div className="flex justify-between items-center">
          <span className="text-black">
            Page {page} of {pages}
          </span>
          <div className="flex gap-x-2">
            <Button
              className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-4 py-2"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              className="border border-[#2D2D2D] bg-white hover:bg-gray-50 text-black rounded-2xl shadow-[2px_2px_0px_0px_#000] px-4 py-2"
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {selectedVault && selectedTokenA && selectedTokenB && (
        <DepositToVaultModal
          isOpen={isDepositModalOpen}
          onClose={() => {
            setIsDepositModalOpen(false);
            setSelectedVault(null);
            setSelectedTokenA(null);
            setSelectedTokenB(null);
          }}
          vault={selectedVault}
          tokenA={selectedTokenA}
          tokenB={selectedTokenB}
        />
      )}
    </div>
  );
}

export default AllAquaberaVaults;
