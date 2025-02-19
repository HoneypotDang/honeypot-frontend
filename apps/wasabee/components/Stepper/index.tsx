import type { ComponentProps } from "react";
import React from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { useControlledState } from "@/hooks";
import { cn } from "@/lib/tailwindcss";

export type VerticalStepProps = {
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  isValid?: boolean;
};

const STEP_SPACE = 46;

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

function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
      />
    </svg>
  );
}

const VerticalSteps = React.forwardRef<HTMLButtonElement, VerticalStepsProps>(
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
        <ol
          className={cn("flex flex-col gap-y-3", className)}
          style={{
            gap: `${STEP_SPACE}px`,
          }}
        >
          {steps?.map((step, stepIdx) => {
            const status =
              currentStep === stepIdx
                ? "active"
                : currentStep < stepIdx
                ? "inactive"
                : "complete";

            return (
              <li key={stepIdx} className="relative">
                <div className="flex w-full max-w-full items-center gap-6">
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
                    <div className="flex h-full items-center">
                      <LazyMotion features={domAnimation}>
                        <div className="relative">
                          <m.div
                            animate={status}
                            className={cn(
                              "border-medium text-large text-default-foreground relative flex h-[42px] w-[42px] items-center justify-center rounded-full font-semibold",
                              {
                                "shadow-lg": status === "complete",
                              }
                            )}
                            data-status={status}
                            initial={false}
                            transition={{ duration: 0.25 }}
                            variants={{
                              inactive: {
                                backgroundColor: "rgb(var(--bg-inactive))",
                                borderColor: "rgb(var(--bg-inactive))",
                                color: "rgb(var(--text-inactive))",
                              },
                              active: {
                                backgroundColor: "rgb(var(--bg-active))",
                                borderColor: "rgb(var(--bg-active))",
                                color: "rgb(var(--text-active))",
                              },
                              complete: {
                                backgroundColor: "rgb(var(--bg-active))",
                                borderColor: "rgb(var(--bg-active))",
                              },
                            }}
                          >
                            <div className="flex items-center justify-center">
                              {status === "complete" || step.isValid ? (
                                <CheckIcon className="h-7 w-7 text-black" />
                              ) : (
                                <span className="text-black text-[25px]">
                                  {stepIdx + 1}
                                </span>
                              )}
                            </div>
                          </m.div>
                        </div>
                      </LazyMotion>
                      {stepIdx < steps.length - 1 && !hideProgressBars && (
                        <div
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute left-1/2 -bottom-3 flex -translate-x-1/2 translate-y-full items-center px-4"
                          )}
                          style={{
                            height: `${STEP_SPACE - 12 * 2}px`,
                          }}
                        >
                          <div
                            className={cn(
                              "relative h-full w-0.5 bg-default-200 transition-colors duration-300",
                              "after:absolute after:block after:h-full after:w-full after:origin-top after:scale-y-0 after:bg-primary-400 after:transition-all after:duration-300 after:content-['']",
                              "before:absolute before:block before:h-full before:w-full before:bg-white before:opacity-50 before:duration-300 before:content-['']",
                              {
                                "after:scale-y-100": stepIdx < currentStep,
                              }
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="flex-1 text-center">
                    <div
                      className={cn(
                        "flex text-[25px] font-semibold text-left text-white transition-[color,opacity] duration-300 w-fit",
                        {
                          "text-white opacity-50": status === "inactive",
                        }
                      )}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

VerticalSteps.displayName = "VerticalSteps";

export default VerticalSteps;
