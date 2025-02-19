import React from "react";
import { cn } from "@/lib/tailwindcss";
import { Button } from "@/components/button";
import { popmodal } from "@/services/popmodal";
import store from "store2";
import { useRouter } from "next/router";

const InstructionMarker = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "w-9 h-9 bg-[#271A0C] rounded-[50%] flex justify-center items-center",
      className
    )}
  >
    <div className="w-6 h-6 bg-[#FFCD4D10]  rounded-[50%] flex justify-center items-center">
      <div className="w-3 h-3 bg-[#FFCD4D] rounded-[50%]"></div>
    </div>
  </div>
);

interface Step {
  content: string;
  steps?: Step[];
}

interface InstructionProps {
  title: string;
  desc: string;
  stepTitle: string;
  buttonText: string;
  steps?: Step[];
}

const renderSteps = (steps: Step[], level: number) => {
  return (
    <ul
      className={[
        "ml-4 flex flex-col gap-1",
        level === 1
          ? "text-xs md:text-sm list-decimal"
          : level == 0
          ? "list-disc text-sm md:text-base"
          : "",
      ].join(" ")}
    >
      {steps.map((step, index) => (
        <li key={index}>
          {step.content}
          {step?.steps && renderSteps(step.steps, level + 1)}
        </li>
      ))}
    </ul>
  );
};

const Instruction: React.FC<InstructionProps> = ({
  title,
  desc,
  stepTitle,
  buttonText,
  steps,
}) => {
  const router = useRouter();
  return (
    <div className="md:p-5 flex flex-col gap-5">
      <p className="text-xl sm:text-2xl">{title}</p>
      <p className="font-sans font-light text-base sm:text-lg">{desc}</p>
      <h2 className="text-2xl sm:text-3xl">{stepTitle}</h2>
      <div className="relative">
        <ul className="flex flex-col md:pl-5 text-lg sm:text-xl font-sans font-light list-none">
          {steps?.map((step, idx) => (
            <li key={idx} className="flex relative">
              <div className="flex flex-col items-center">
                {idx !== 0 && (
                  <div className="w-[1px] flex-1 bg-[#FFCD4D]"></div>
                )}
                <InstructionMarker />
                {idx !== steps.length - 1 && (
                  <div className="w-[1px] flex-1 bg-[#FFCD4D]"></div>
                )}
              </div>
              <div
                className={cn(
                  "bg-[#3e2a0f] px-5 py-2 ml-2 md:ml-8 rounded-[2rem] relative overflow-visible",
                  "sm:px-6 sm:py-3 sm:ml-10", // 添加响应式的 padding 和 margin
                  idx !== 0 && idx !== steps.length - 1
                    ? "my-2"
                    : idx === 0
                    ? "mb-2"
                    : "mt-2"
                )}
              >
                {step.content}
                {step?.steps && renderSteps(step.steps, 0)}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Button
        className="w-full mt-4"
        onClick={() => {
          popmodal.closeModal();
          store.set("pot2pump_notice_read" + "_" + router.pathname, true);
        }}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default Instruction;
