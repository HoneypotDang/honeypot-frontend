import { useRouter } from "next/router";
import TokenLogo from "@/components/TokenLogo/TokenLogo";
import { getAccountVaultsList } from "@/lib/algebra/graphql/clients/vaults";
import { AccountVaultSharesQuery } from "@/lib/algebra/graphql/generated/graphql";
import { ICHIVaultContract } from "@/services/contract/aquabera/ICHIVault-contract";
import { Token } from "@/services/contract/token";
import { wallet } from "@/services/wallet";
import { useEffect, useState } from "react";
import { Currency } from "@cryptoalgebra/sdk";
import { DepositToVaultModal } from "../modals/DepositToVaultModal";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { observer } from "mobx-react-lite";

type SortField = "pair" | "tvl" | "volume" | "fees" | "shares";
type SortDirection = "asc" | "desc";

interface MyAquaberaVaultsProps {
  searchString?: string;
}

export const MyAquaberaVaults = observer(({ searchString = "" }: MyAquaberaVaultsProps) => {
  const router = useRouter();
  const [myVaults, setMyVaults] = useState<AccountVaultSharesQuery>();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<ICHIVaultContract | null>(
    null
  );
  const [selectedTokenA, setSelectedTokenA] = useState<Currency | null>(null);
  const [selectedTokenB, setSelectedTokenB] = useState<Currency | null>(null);
  const [sortField, setSortField] = useState<SortField>("tvl");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    if (!wallet.isInit) return;
    loadMyVaults(wallet.account);
  }, [wallet.isInit]);

  const loadMyVaults = async (accountAddress: string) => {
    const myVaultsQuery = await getAccountVaultsList(accountAddress);
    setMyVaults(myVaultsQuery);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortedVaults = () => {
    if (!myVaults?.vaultShares) return [];

    const filteredVaults = myVaults.vaultShares.filter((vaultShare) => {
      if (!searchString) return true;
      
      const tokenA = Token.getToken({ address: vaultShare.vault.tokenA });
      const tokenB = Token.getToken({ address: vaultShare.vault.tokenB });
      
      const searchLower = searchString.toLowerCase();
      return (
        vaultShare.vault.id.toLowerCase().includes(searchLower) ||
        tokenA.symbol.toLowerCase().includes(searchLower) ||
        tokenB.symbol.toLowerCase().includes(searchLower)
      );
    });

    return [...filteredVaults].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "pair":
          return (
            multiplier *
            (a.vault.tokenA + a.vault.tokenB).localeCompare(
              b.vault.tokenA + b.vault.tokenB
            )
          );
        case "tvl":
          return (
            multiplier *
            (Number(a.vault.pool?.totalValueLockedUSD || 0) -
              Number(b.vault.pool?.totalValueLockedUSD || 0))
          );
        case "volume":
          return (
            multiplier *
            (Number(a.vault.pool?.poolDayData?.[0]?.volumeUSD || 0) -
              Number(b.vault.pool?.poolDayData?.[0]?.volumeUSD || 0))
          );
        case "fees":
          return (
            multiplier *
            (Number(a.vault.pool?.poolDayData?.[0]?.feesUSD || 0) -
              Number(b.vault.pool?.poolDayData?.[0]?.feesUSD || 0))
          );
        case "shares":
          return (
            multiplier *
            (Number(a.vaultShareBalance) - Number(b.vaultShareBalance))
          );
        default:
          return 0;
      }
    });
  };

  const SortHeader = ({
    field,
    label,
    align = "right",
  }: {
    field: SortField;
    label: string;
    align?: "left" | "right" | "center";
  }) => (
    <th
      className={`py-4 px-6 cursor-pointer transition-colors text-[#4D4D4D]`}
      onClick={() => handleSort(field)}
    >
      <div
        className={`flex items-center gap-2 ${align === "right" ? "justify-end" : align === "center" ? "justify-center" : ""}`}
      >
        <span className={label.length > 4 ? "text-[13px]" : "text-base"}>
          {label}
        </span>
        <div className="flex flex-col">
          <ChevronUpIcon
            className={`h-3 w-3 ${
              sortField === field && sortDirection === "asc"
                ? "text-black"
                : "text-[#4D4D4D]"
            }`}
          />
          <ChevronDownIcon
            className={`h-3 w-3 ${
              sortField === field && sortDirection === "desc"
                ? "text-black"
                : "text-[#4D4D4D]"
            }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <SortHeader field="pair" label="Token Pair" align="left" />
            <th className="py-2 px-4 text-[#4D4D4D] max-w-[300px] truncate">
              Vault Address
            </th>
            {/* <SortHeader field="tvl" label="TVL" />
            <SortHeader field="volume" label="24h Volume" />
            <SortHeader field="fees" label="24h Fees" /> */}
            <SortHeader field="shares" label="My Vault Shares" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#4D4D4D]">
          {!getSortedVaults().length ? (
            <tr className="hover:bg-white border-white h-full">
              <td colSpan={6} className="h-24 text-center text-black">
                No results.
              </td>
            </tr>
          ) : (
            getSortedVaults().map((vaultShare) => {
              const tokenA = Token.getToken({
                address: vaultShare.vault.tokenA,
              });

              const tokenB = Token.getToken({
                address: vaultShare.vault.tokenB,
              });

              tokenA.init();
              tokenB.init();

              const tvl = Number(
                vaultShare.vault.pool?.totalValueLockedUSD || 0
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });

              const volume = Number(
                vaultShare.vault.pool?.poolDayData?.[0]?.volumeUSD || 0
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });

              const fees = Number(
                vaultShare.vault.pool?.poolDayData?.[0]?.feesUSD || 0
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });

              return (
                <tr
                  key={vaultShare.vault.id}
                  className="transition-colors bg-white text-black hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/vault/${vaultShare.vault.id}`)}
                >
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {vaultShare.vault.tokenA && (
                          <TokenLogo token={tokenA} />
                        )}
                        <div className="-ml-2">
                          {vaultShare.vault.tokenB && (
                            <TokenLogo token={tokenB} />
                          )}
                        </div>
                      </div>
                      <span className="text-black font-medium">
                        {tokenA.symbol}/{tokenB.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-black max-w-[300px] truncate">
                    {vaultShare.vault.id}
                  </td>
                  {/* <td className="py-2 px-4 text-right text-black">{tvl}</td>
                  <td className="py-2 px-4 text-right text-black">{volume}</td>
                  <td className="py-2 px-4 text-right text-black">{fees}</td> */}
                  <td className="py-2 px-4 text-right text-black">
                    {vaultShare.vaultShareBalance}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

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
});

export default MyAquaberaVaults;
