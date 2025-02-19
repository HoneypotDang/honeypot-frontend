import { myPositionsColumns } from "@/components/algebra/common/Table/myPositionsColumns";
import { Address } from "viem";
import MyPositionsTable from "@/components/algebra/common/Table/myPositionsTable";
import { FormattedPosition } from "@/types/algebra/types/formatted-position";

interface MyPositionsProps {
  positions: FormattedPosition[];
  poolId: Address | undefined;
  selectedPosition: number | undefined;
  selectPosition: (positionId: number | null) => void;
}

const MyPositions = ({
  positions,
  selectedPosition,
  selectPosition,
}: MyPositionsProps) => {
  return (
    <div className="flex flex-col min-h-[377px] pb-8 bg-white text-black rounded-3xl border-3 border-solid border-[#F7931A10] hover:border-[#F7931A] transition-all">
      <MyPositionsTable
        defaultSortingID="liquidityUSD"
        columns={myPositionsColumns}
        data={positions}
        action={selectPosition}
        selectedRow={selectedPosition}
        showPagination={false}
      />
    </div>
  );
};

export default MyPositions;
