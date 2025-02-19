import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { Button } from "@/components/button/button-next";
import { observer } from "mobx-react-lite";
import { popmodal } from "@/services/popmodal";
import { PottingModal } from "./PottingModal";
import { PressEvent } from "@react-types/shared";
import { cn } from "@/lib/algebra/lib/utils";
export const PottingModalButton = observer(
  ({
    pair,
    boarderLess,
    className,
  }: {
    pair: MemePairContract | FtoPairContract;
    boarderLess?: boolean;
    className?: string;
  }) => {
    const handleClick = (e: PressEvent) => {
      popmodal.openModal({
        content: <PottingModal pair={pair} boarderLess={boarderLess} />,
        boarderLess: true,
      });
    };

    return (
      <Button
        onPress={(e) => handleClick(e)}
        className={cn(className, "border-yellow-500")}
      >
        POTTING
      </Button>
    );
  }
);

export default PottingModalButton;
