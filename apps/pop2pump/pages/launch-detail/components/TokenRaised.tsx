import React from "react";
import BigNumber from "bignumber.js";
import { Skeleton } from "@nextui-org/react";

interface TokenRaisedProps {
  depositedRaisedToken?: BigNumber;
  raiseTokenDerivedUSD?: string;
  raisedTokenMinCap?: BigNumber;
  raiseTokenDecimals?: number;
}

const TokenRaised: React.FC<TokenRaisedProps> = ({
  depositedRaisedToken,
  raiseTokenDerivedUSD,
  raisedTokenMinCap,
  raiseTokenDecimals,
}) => {
  const depositedAmount =
    depositedRaisedToken && raiseTokenDerivedUSD
      ? depositedRaisedToken
          .multipliedBy(new BigNumber(raiseTokenDerivedUSD))
          .toFixed(3)
      : null;

  const minCapAmount =
    raisedTokenMinCap &&
    raiseTokenDerivedUSD &&
    raiseTokenDecimals !== undefined
      ? raisedTokenMinCap
          .div(10 ** raiseTokenDecimals)
          .multipliedBy(new BigNumber(raiseTokenDerivedUSD))
          .toFixed(3)
      : null;

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="text-white md:text-base text-sm font-bold leading-[normal]">
        Token Raised
      </div>
      <div className="text-[#FFCD4D] flex items-center gap-x-1">
        {depositedAmount ? (
          <span className="font-bold text-lg">${depositedAmount}</span>
        ) : (
          <Skeleton className="rounded-lg h-6 w-24" />
        )}
        <span className="text-sm">/</span>
        {minCapAmount ? (
          <span className="text-sm">${minCapAmount}</span>
        ) : (
          <Skeleton className="rounded-lg h-5 w-20" />
        )}
      </div>
    </div>
  );
};

export default TokenRaised;
