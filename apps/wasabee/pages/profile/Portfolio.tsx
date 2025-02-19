import { observer } from "mobx-react-lite";
import { wallet } from "@/services/wallet";
import { useEffect, useState } from "react";
import { Link, Skeleton } from "@nextui-org/react";
import { portfolio } from "@/services/portfolio";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { TokenBalanceCard } from "@/components/TokenBalanceCard/TokenBalanceCard";
import { Button } from "@/components/button/button-next";
import Image from "next/image";
import rhinoLogo from "@/public/images/partners/rhino-finance-logo.svg";

type SortField = "name" | "price" | "balance" | "value";
type SortDirection = "asc" | "desc";

export const PortfolioTab = observer(() => {
  const [sortField, setSortField] = useState<SortField>("value");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    if (wallet.isInit) {
      portfolio.initPortfolio();
    }
  }, [wallet.isInit]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortedTokens = () => {
    return [...portfolio.tokens].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "name":
          return multiplier * a.displayName.localeCompare(b.displayName);
        case "price":
          return (
            multiplier * (Number(a.derivedUSD || 0) - Number(b.derivedUSD || 0))
          );
        case "balance":
          return multiplier * (a.balance.toNumber() - b.balance.toNumber());
        case "value":
          const aValue = Number(a.derivedUSD || 0) * a.balance.toNumber();
          const bValue = Number(b.derivedUSD || 0) * b.balance.toNumber();
          return multiplier * (aValue - bValue);
        default:
          return 0;
      }
    });
  };

  const SortHeader = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <th
      className="py-4 px-6 cursor-pointer transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2 justify-end">
        <span>{label}</span>
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
    <div className="custom-dashed-3xl w-full p-6 bg-white">
      <Link
        href="https://app.rhino.fi/bridge/?refId=DeFi_HPOT&token=USDC&chainOut=BERACHAIN&chainIn=ETHEREUM"
        target="_blank"
        className="mb-4 w-full justify-end"
      >
        <Button className="bg-white">
          <div className="flex items-center gap-2">
            <Image src={rhinoLogo} alt="rhino" width={24} height={24} />
            <span>Bridge your assets with Rhino finance</span>
          </div>
        </Button>
      </Link>
      <table className="w-full">
        <thead className="text-[#4D4D4D]">
          <tr>
            <th
              className="py-4 px-6 text-left cursor-pointer transition-colors"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center gap-2">
                <span>Asset</span>
                <div className="flex flex-col">
                  <ChevronUpIcon
                    className={`h-3 w-3 ${
                      sortField === "name" && sortDirection === "asc"
                        ? "text-black"
                        : "text-[#4D4D4D]"
                    }`}
                  />
                  <ChevronDownIcon
                    className={`h-3 w-3 ${
                      sortField === "name" && sortDirection === "desc"
                        ? "text-black"
                        : "text-[#4D4D4D]"
                    }`}
                  />
                </div>
              </div>
            </th>
            <SortHeader field="price" label="Price" />
            <SortHeader field="balance" label="Balance" />
            <SortHeader field="value" label="Value" />
            <th className="py-4 px-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#4D4D4D]">
          {portfolio.isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6">
                      <Skeleton className="h-12 w-32 rounded-lg" />
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-12 w-24 rounded-lg ml-auto" />
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-12 w-24 rounded-lg ml-auto" />
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-12 w-24 rounded-lg ml-auto" />
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-12 w-24 rounded-lg mx-auto" />
                    </td>
                  </tr>
                ))
            : getSortedTokens().map((token) => (
                <TokenBalanceCard key={token.address} token={token} />
              ))}
        </tbody>
      </table>

      {/* FIXME: Add pagination */}
      <div className="p-4 border-t border-[#2D2D2D]">
        <div className="flex justify-between items-center">
          <span className="text-black">Total Portfolio Value:</span>
          {portfolio.isLoading ? (
            <Skeleton className="h-8 w-32 rounded-lg" />
          ) : (
            <span className="text-black font-bold">
              ${portfolio.totalBalanceFormatted}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default PortfolioTab;
