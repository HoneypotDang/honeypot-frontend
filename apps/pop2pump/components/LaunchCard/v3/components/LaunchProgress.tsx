import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { cn } from "@/lib/tailwindcss";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react-lite";
import ProgressBar from "../../../atoms/ProgressBar/ProgressBar";
import TimeLineComponent from "./TimeLineComponent";
import {
  getLaunchContractType,
  LaunchContract,
} from "@/services/contract/launches/base-launch-contract";

interface LaunchProgressProps {
  pair: LaunchContract;
  className?: string;
  barOnly?: boolean;
}

export const LaunchProgress = observer(
  ({ pair, className, barOnly }: LaunchProgressProps) => {
    if (!pair) return <></>;
    else if (getLaunchContractType(pair) === "lbp") return <></>;
    else if (getLaunchContractType(pair) === "fto") return <></>;
    else if (getLaunchContractType(pair) === "meme") {
      // 计算进度百分比
      const progressPercentage = new BigNumber(
        (pair as MemePairContract).depositedRaisedToken?.toNumber() ?? 0
      )
        .div(
          new BigNumber(
            (pair as MemePairContract).raisedTokenMinCap?.toNumber() ?? 0
          ).div(Math.pow(10, 18))
        )
        .times(100)
        .toFixed(2);

      // 如果进度超过100%，不显示组件
      if (Number(progressPercentage) >= 100) {
        return <div className={cn("mt-4", className)}></div>;
      }

      if (barOnly) {
        return (
          <div className="relative">
            <ProgressBar
              className="rounded-[24px] border border-black bg-white shadow-[2px_2px_0px_0px_#D29A0D]"
              value={Number(progressPercentage)}
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
              {progressPercentage}%
            </span>
          </div>
        );
      }

      return (
        <div className={cn("space-y-1.5 text-[#202020]", className)}>
          {" "}
          <div className="flex items-center justify-between text-sm *:flex-grow-[1]">
            <span className="space-x-0.5">
              <span>
                {(pair as MemePairContract)?.depositedRaisedToken?.toFormat(2)}{" "}
              </span>
              <span>
                {" "}
                {(pair as MemePairContract)?.raiseToken?.displayName}
              </span>
              <span>
                {(pair as MemePairContract)?.depositedRaisedToken &&
                (pair as MemePairContract).raiseToken
                  ? "$" +
                    (pair as MemePairContract).depositedRaisedToken
                      ?.multipliedBy(
                        (pair as MemePairContract).raiseToken?.derivedUSD || 0
                      )
                      .toFormat(3)
                  : "-"}
              </span>
            </span>
          </div>
          <div className="relative">
            <ProgressBar
              className="rounded-[24px] border border-black bg-white shadow-[2px_2px_0px_0px_#D29A0D]"
              value={Number(progressPercentage)}
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
              {progressPercentage}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm *:flex-grow-[1]">
            <span>
              <TimeLineComponent
                pair={pair as MemePairContract}
                launchCardVariants="simple"
              />
            </span>
          </div>
        </div>
      );
    }
  }
);

export default LaunchProgress;
