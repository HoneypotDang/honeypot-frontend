import { Button } from "@/components/algebra/ui/button";
import { formatPlural } from "@/lib/algebra/utils/common/formatPlural";
import { formatUSD } from "@/lib/algebra/utils/common/formatUSD";
import { Address } from "viem";
import { FormattedPosition } from "@/types/algebra/types/formatted-position";
import Link from "next/link";
import { cn } from "@/lib/tailwindcss";

interface MyPositionsToolbar {
  positionsData: FormattedPosition[];
  poolId: Address;
}

const MyPositionsToolbar = ({ positionsData, poolId }: MyPositionsToolbar) => {
  const [myLiquidityUSD, myFeesUSD] = positionsData
    ? positionsData.reduce(
        (acc, { liquidityUSD, feesUSD }) => [
          acc[0] + liquidityUSD,
          acc[1] + feesUSD,
        ],
        [0, 0]
      )
    : [];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full mb-6 bg-white rounded-3xl p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <h3 className="font-semibold text-xl text-left">My Positions</h3>
        <div className="text-gray-600 font-semibold">{`${
          positionsData?.length
        } ${formatPlural(positionsData.length, "position", "positions")}`}</div>
        <div className="text-cyan-600 font-semibold">{`${formatUSD.format(
          myLiquidityUSD || 0
        )} TVL`}</div>
        <div className="text-green-600 font-semibold">{`${formatUSD.format(
          myFeesUSD || 0
        )} Fees`}</div>
      </div>
      <div className="flex w-full md:w-fit mt-4 md:mt-0 gap-4">
        {/* <FilterPopover>
          <SlidersHorizontal size={20} />
        </FilterPopover> */}
        <Link
          className={cn(
            "flex items-center gap-x-1 p-2.5 cursor-pointer border border-[#E18A20]/40 bg-[#E18A20] rounded-[10px]"
          )}
          href={`/new-position/${poolId}`}
        >
          <span>Create Position</span>
        </Link>
      </div>
    </div>
  );
};

export default MyPositionsToolbar;
