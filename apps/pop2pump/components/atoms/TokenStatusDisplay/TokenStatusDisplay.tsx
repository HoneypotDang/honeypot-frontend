import { cn } from "@/lib/tailwindcss";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { motion, useMotionValue, useTime } from "framer-motion";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

interface ProjectStatusDisplayProps {
  pair: FtoPairContract | MemePairContract | null | undefined;
}

export const ProjectStatusDisplay = observer(
  ({ pair }: ProjectStatusDisplayProps) => {
    return (
      <div className="flex absolute top-[9px] right-2.5 flex-col gap-[5px] ">
        <motion.div
          animate={{
            boxShadow: [
              `inset 0px 0px 5px 0px rgba(255,255,255,0.3)`,
              `inset 0px 0px 10px 2px rgba(255,255,255,0.3)`,
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "flex px-[8px] h-[29px] justify-center items-center gap-[5px]  rounded-[20px] select-none",
            pair?.ftoStatusDisplay?.color
          )}
        >
          <div className="rounded-full bg-current w-2 h-2"></div>
          <span className="text-ss  text-current">
            {pair?.ftoStatusDisplay?.status}
          </span>
        </motion.div>{" "}
        {pair?.isValidated && (
          <motion.div
            animate={{
              boxShadow: [
                `inset 0px 0px 5px 0px rgba(255,255,255,0.3)`,
                `inset 0px 0px 10px 2px rgba(255,255,255,0.3)`,
              ],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className={cn(
              "flex px-[8px] h-[29px] justify-center items-center gap-[5px] rounded-[20px]  bg-[#4bbdea58] text-white select-none"
            )}
          >
            <div className="rounded-full bg-current w-2 h-2"></div>
            <span className="text-ss  text-current">Validated</span>
          </motion.div>
        )}
      </div>
    );
  }
);

export default ProjectStatusDisplay;
