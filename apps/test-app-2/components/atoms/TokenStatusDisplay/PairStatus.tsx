import { cn } from "@/lib/tailwindcss";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

interface PairStatusProps {
  isValidated?: boolean;
  statusColor?: string;
  status?: string;
}

const PairStatus = observer(
  ({
    statusColor,
    status,
    isValidated,
  }: PairStatusProps) => {
    return (
      <div className="flex flex-col gap-[5px]">
        {status ? (
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
              "flex px-[8px] h-[29px] justify-center items-center gap-[5px] rounded-[20px] select-none",
              statusColor
            )}
          >
            <div className="rounded-full bg-current w-2 h-2"></div>
            <span className="text-ss text-current xs:text-xs">
              {status}
            </span>
          </motion.div>
        ) : (
          <Skeleton className="rounded-full h-[30px] w-[100px] bg-slate-200" />
        )}
        {isValidated && (
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

export default PairStatus;
