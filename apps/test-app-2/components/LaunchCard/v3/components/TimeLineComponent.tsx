import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react-lite";
import Countdown from "react-countdown";
import { LaunchCardComponentContainer, launchCardVariants } from "..";
import { cn } from "@/lib/utils";

interface TimeLineComponentProps {
  pair: MemePairContract | FtoPairContract;
  launchCardVariants?: launchCardVariants;
}

export const TimeLineComponent = observer(
  ({ pair, launchCardVariants }: TimeLineComponentProps) => {
    const endedDisplay = <span>Ended!</span>;

    // 计算进度百分比
    const progressPercentage = new BigNumber(
      pair.depositedRaisedToken?.toNumber() ?? 0
    )
      .div(
        new BigNumber(
          (pair as MemePairContract).raisedTokenMinCap?.toNumber() ?? 0
        ).div(Math.pow(10, 18))
      )
      .times(100)
      .toFixed(2);

    if (
      Number(progressPercentage) >= 100 ||
      (pair?.endTime && Number(pair.endTime) * 1000 < Date.now())
    ) {
      return null;
    }

    return (
      <LaunchCardComponentContainer
        className={cn(
          "shrink-0 flex items-start",
          launchCardVariants === "simple" && "flex-row justify-end items-center"
        )}
      >
        <h6 className="text-xs opacity-60">End Time</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            {pair?.endTime && (
              <Countdown
                date={Number(pair?.endTime) * 1000}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed || pair.state !== 3) {
                    return endedDisplay;
                  } else {
                    return (
                      <span>
                        {days ? `${days}d ` : ""}
                        {hours ? `${hours}h ` : ""}
                        {minutes ? `${minutes}m ` : ""}
                        {seconds ? `${seconds}s ` : ""}
                      </span>
                    );
                  }
                }}
              />
            )}
          </span>
        </div>
      </LaunchCardComponentContainer>
    );
  }
);

export default TimeLineComponent;
