import { cn } from "@/lib/tailwindcss";
import { ReactNode } from "react";

interface HoneyContainerProps {
  children: ReactNode;
  bordered?: boolean;
  variant?: "default" | "wide";
  className?: string;
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
}

function CardContainer({
  children,
  className,
  bordered = true,
  variant = "default",
  showTopBorder = true,
  showBottomBorder = true,
}: HoneyContainerProps) {
  return (
    <div
      style={
        {
          backgroundImage: `${[
            showTopBorder
              ? "url('/images/card-container/honey/honey-border.png')"
              : "",
            showBottomBorder
              ? `url('${
                  variant === "wide"
                    ? "/images/card-container/honey/bottom-border.svg"
                    : "/images/card-container/dark/bottom-border.svg"
                }')`
              : "",
          ]
            .filter(Boolean)
            .join(", ")}`,
        } as React.CSSProperties
      }
      // TODO: Add style adaptation of different sizes
      className={cn(
        "flex flex-col h-full w-full gap-y-4 justify-center items-center bg-[#FFCD4D] rounded-2xl text-[#202020] repeat",
        bordered &&
          [
            "px-4",
            "bg-repeat-x",
            showTopBorder && "pt-[80px]",
            showBottomBorder && "pb-[80px]",
            "bg-[position:-65px_top,_left_bottom]",
            "bg-[size:auto_70px,_auto_70px]",
            `bg-[position:top,_left_bottom]`,
          ]
            .filter(Boolean)
            .join(" "),
        className
      )}
    >
      {children}
    </div>
  );
}

export default CardContainer;
