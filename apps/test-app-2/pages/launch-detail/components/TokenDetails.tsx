import React from "react";
import Image from "next/image";
import { amountFormatted } from "@/lib/format";
import { Skeleton } from "@nextui-org/react";
import BigNumber from "bignumber.js";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { Token } from "@/services/contract/token";

interface TokenDetailsProps {
  price?: BigNumber;
  depositedRaisedToken?: BigNumber;
  startTimeDisplay?: string;
  endTimeDisplay?: string;
  raisedToken: Token;
}

const TokenDetails: React.FC<TokenDetailsProps> = ({
  price,
  raisedToken,
  depositedRaisedToken,
  startTimeDisplay,
  endTimeDisplay,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 py-5 border border-[#F2C34A] rounded-2xl">
      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] text-white/[0.78] text-[12.165px] font-bold leading-[normal]">
          Funds Raised
        </div>
        <div className="text-white text-xs font-medium leading-[normal] mt-[4px]">
          {depositedRaisedToken !== undefined ? (
            DynamicFormatAmount({
              amount: depositedRaisedToken.toString(),
              decimals: 3,
              endWith: raisedToken?.symbol,
            })
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-[4px] text-white/[0.78] text-xs font-bold leading-[normal]">
          <Image
            width={12}
            height={12}
            alt="Start Date"
            src="/images/calendar.png"
          />
          <span>Start Date</span>
        </div>
        <div className="text-white text-xs font-medium leading-[normal] mt-[4px]">
          {startTimeDisplay ? (
            startTimeDisplay !== "-" ? (
              <>
                {new Date(startTimeDisplay).toLocaleDateString()}
                <br />
                {new Date(startTimeDisplay).toLocaleTimeString()}
              </>
            ) : (
              "--"
            )
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-1 text-white/[0.78] text-xs font-bold leading-[normal]">
          <Image
            width={12}
            height={12}
            alt="End Date"
            src="/images/calendar.png"
          />
          <span>End Date</span>
        </div>
        <div className="text-white text-xs font-medium leading-[normal] mt-[4px]">
          {endTimeDisplay ? (
            endTimeDisplay !== "-" ? (
              <>
                {new Date(endTimeDisplay).toLocaleDateString()}
                <br />
                {new Date(endTimeDisplay).toLocaleTimeString()}
              </>
            ) : (
              "--"
            )
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
