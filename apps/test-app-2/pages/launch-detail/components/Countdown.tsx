import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface CountdownTimerProps {
  endTime?: string;
  endTimeDisplay?: string;
  type?: 'primary' | 'default';
}

interface NumberBlockProps {
  digit: string;
  type?: 'primary' | 'default';
}

const NumberBlock: React.FC<NumberBlockProps> = ({ digit, type = 'primary' }) => {
  const [animation, setAnimation] = useState(false);
  const [displayDigit, setDisplayDigit] = useState(digit);

  useEffect(() => {
    if (displayDigit !== digit) {
      setAnimation(true);
      const timer = setTimeout(() => {
        setDisplayDigit(digit);
        setAnimation(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [digit, displayDigit]);

  return (
    <div className={`relative overflow-hidden text-sm md:text-base border border-[#000] rounded-lg w-6 h-6 md:size-8 shadow-[1px_1px_0px_0px_rgba(0,0,0,0.75)] ${
      type === 'primary' ? 'bg-[#FFCD4D]' : 'bg-white'
    }`}>
      <div
        className={`absolute inset-0 flex items-center justify-center
          ${animation ? "animate-flip-out" : "animate-flip-in"}`}
      >
        {displayDigit}
      </div>
    </div>
  );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  endTimeDisplay,
  type = 'primary',
}) => {
  const formatEndTimeDisplay = (timestamp: string) => {
    try {
      const date = new Date(parseInt(timestamp) * 1000);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch {
      return endTimeDisplay;
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-2.5 font-gliker">
      {endTime ? (
        <Countdown
          date={parseInt(endTime) * 1000}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return formatEndTimeDisplay(endTime);
            } else {
              return (
                <div className="flex items-end gap-x-1 md:gap-x-2">
                  <div className="flex flex-col-reverse items-center gap-y-2">
                    <div className="flex gap-x-0.5">
                      <NumberBlock
                        digit={String(days).padStart(2, "0")[0]}
                        type={type}
                      />
                      <NumberBlock
                        digit={String(days).padStart(2, "0")[1]}
                        type={type}
                      />
                    </div>
                    <span className="text-[10px] md:text-xs text-[#333]/80">
                      Days
                    </span>
                  </div>

                  <div className="font-bold">:</div>

                  <div className="flex flex-col-reverse items-center gap-y-2">
                    <div className="flex gap-x-0.5">
                      <NumberBlock
                        digit={String(hours).padStart(2, "0")[0]}
                        type={type}
                      />
                      <NumberBlock
                        digit={String(hours).padStart(2, "0")[1]}
                        type={type}
                      />
                    </div>
                    <span className="text-[10px] md:text-xs text-[#333]/80">
                      Hours
                    </span>
                  </div>

                  <div className="font-bold">:</div>

                  <div className="flex flex-col-reverse items-center gap-y-2">
                    <div className="flex gap-x-0.5">
                      <NumberBlock
                        digit={String(minutes).padStart(2, "0")[0]}
                        type={type}
                      />
                      <NumberBlock
                        digit={String(minutes).padStart(2, "0")[1]}
                        type={type}
                      />
                    </div>
                    <span className="text-[10px] md:text-xs text-[#333]/80">
                      Minutes
                    </span>
                  </div>

                  <div className="font-bold">:</div>

                  <div className="flex flex-col-reverse items-center gap-y-2">
                    <div className="flex gap-x-0.5">
                      <NumberBlock
                        digit={String(seconds).padStart(2, "0")[0]}
                        type={type}
                      />
                      <NumberBlock
                        digit={String(seconds).padStart(2, "0")[1]}
                        type={type}
                      />
                    </div>
                    <span className="text-[10px] md:text-xs text-[#333]/80">
                      Seconds
                    </span>
                  </div>
                </div>
              );
            }
          }}
        />
      ) : (
        <Skeleton className="rounded-lg h-8 md:h-11 w-[160px] md:w-[210px]" />
      )}
    </div>
  );
};

export default CountdownTimer;
