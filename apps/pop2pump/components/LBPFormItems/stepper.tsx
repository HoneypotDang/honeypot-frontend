import React from "react";
import { useControlledState } from "@/hooks";
import { cn } from "@/lib/tailwindcss";

export type VerticalStepProps = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  isValid?: boolean;
};

export interface VerticalStepsProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * An array of steps.
   *
   * @default []
   */
  steps?: VerticalStepProps[];
  /**
   * The color of the steps.
   *
   * @default "primary"
   */
  color?: string;
  /**
   * The current step index.
   */
  currentStep?: number;
  /**
   * The default step index.
   *
   * @default 0
   */
  defaultStep?: number;
  /**
   * Whether to hide the progress bars.
   *
   * @default false
   */
  hideProgressBars?: boolean;
  /**
   * The custom class for the steps wrapper.
   */
  className?: string;
  /**
   * The custom class for the step.
   */
  stepClassName?: string;
  /**
   * Callback function when the step index changes.
   */
  onStepChange?: (stepIndex: number) => void;
}

const HorizontalSteps = React.forwardRef<HTMLButtonElement, VerticalStepsProps>(
  (
    {
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
      hideProgressBars = false,
      stepClassName,
      className,
      ...props
    },
    ref
  ) => {
    const [currentStep, setCurrentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange
    );

    return (
      <nav aria-label="Progress" className="w-full">
        <ol className={cn("flex gap-[74px] overflow-x-auto no-scrollbar", className)}>
          {steps?.map((step, stepIdx) => {
            const status =
              currentStep === stepIdx
                ? "active"
                : currentStep < stepIdx
                  ? "inactive"
                  : "complete";

            return (
              <li key={stepIdx} className="relative" id={`step-${stepIdx}`}>
                <div className="flex w-full flex-col max-w-full items-center gap-3">
                  <div className="w-[90px] h-[34px] text-center flex justify-center">
                    <span
                      className={cn(
                        "flex text-sm font-normal text-black transition-[color,opacity] duration-300 w-fit leading-[16.8px]"
                      )}
                    >
                      {step.title}
                    </span>
                  </div>

                  <button
                    key={stepIdx}
                    ref={ref}
                    aria-current={status === "active" ? "step" : undefined}
                    className={cn(
                      "relative group flex w-fit cursor-pointer items-center justify-center gap-4 rounded-large",
                      stepClassName
                    )}
                    onClick={() =>
                      (step.isValid || steps?.[stepIdx - 1]?.isValid) &&
                      setCurrentStep(stepIdx)
                    }
                    {...props}
                  >
                    <div className="relative flex items-center w-[40px] h-[40px] rounded-full bg-[#F4E5BF] justify-center border border-[#FCCB4C]">
                      <div className="bg-[#FCCB4C] w-[17.52px] h-[17.52px] rounded-full flex items-center justify-center">
                        <span className="text-black text-[10px] leading-[10px] text-center">
                          {stepIdx + 1}
                        </span>
                      </div>
                      {stepIdx < steps.length - 1 && !hideProgressBars && (
                        <div
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none flex items-center w-[128px] bg-[#E1E1E1] h-4 absolute  left-full",
                            {
                              "bg-[#FCCB4C]": status === "complete",
                            }
                          )}
                        ></div>
                      )}
                    </div>
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

HorizontalSteps.displayName = "VerticalSteps";

export default HorizontalSteps;
