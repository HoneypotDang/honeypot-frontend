import React from "react";
import BigNumber from "bignumber.js";
import { Skeleton } from "@nextui-org/react";
import { amountFormatted } from "@/lib/format";
import ProgressBar from "@/components/atoms/ProgressBar/ProgressBar";

interface SaleProgressProps {
  raiseTokenDecimals?: number;
  raiseTokenBalance?: BigNumber;
  ftoStatusDisplayStatus?: string;
  depositedRaisedToken?: BigNumber;
  raiseTokenSymbol: string;
}

const SaleProgress: React.FC<SaleProgressProps> = ({
  ftoStatusDisplayStatus,
  raiseTokenBalance,
  raiseTokenDecimals,
  depositedRaisedToken,
  raiseTokenSymbol,
}) => {
  const depositedRaisedTokenDisplay = depositedRaisedToken
    ? amountFormatted(depositedRaisedToken, {
        decimals: 0,
        fixed: 3,
        prefix: "",
      })
    : null;

  const raisedTokenMinCapDisplay = raiseTokenBalance
    ? amountFormatted(raiseTokenBalance, {
        decimals: raiseTokenDecimals,
        fixed: 3,
        prefix: "",
      })
    : null;

  const depositedAmount =
    ftoStatusDisplayStatus === "success"
      ? raisedTokenMinCapDisplay
      : depositedRaisedTokenDisplay;

  const progressLabel =
    ftoStatusDisplayStatus === "success"
      ? "100%"
      : (depositedRaisedToken || BigNumber(0))
          .div(
            (raiseTokenBalance || BigNumber(1)).div(
              10 ** (raiseTokenDecimals || 0)
            )
          )
          .multipliedBy(100)
          .toFixed(2) + "%";

  const progressValue =
    ftoStatusDisplayStatus === "success"
      ? 100
      : (depositedRaisedToken || BigNumber(0))
          .div(
            (raiseTokenBalance || BigNumber(1)).div(
              10 ** (raiseTokenDecimals || 0)
            )
          )
          .multipliedBy(100)
          .toNumber();

  return (
    <div className="space-y-1.5">
      <div className="text-white text-sm font-bold leading-[normal]">
        Sale progress
      </div>
      <ProgressBar
        label={progressLabel}
        value={progressValue}
        trackColor="bg-[#9D7C28]"
      />
      <div className="flex items-center text-[#FFCD4D] gap-x-1">
        {depositedAmount ? (
          <span className="font-bold">{depositedAmount}</span>
        ) : (
          <Skeleton className="rounded-lg h-6 w-24" />
        )}
        <span className="text-sm">/</span>
        {raisedTokenMinCapDisplay ? (
          <span className="text-sm text-white">
            {raisedTokenMinCapDisplay} {raiseTokenSymbol ?? "Raise Token"}
          </span>
        ) : (
          <Skeleton className="rounded-lg h-5 w-20" />
        )}
      </div>
    </div>
  );
};

export default SaleProgress;
