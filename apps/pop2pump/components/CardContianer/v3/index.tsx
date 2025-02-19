import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/tailwindcss";
import { LoadingDisplay } from "@/components/LoadingDisplay/LoadingDisplay";

interface HoneyContainerProps {
  children: ReactNode;
  bordered?: boolean;
  variant?: "default" | "wide";
  className?: string;
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
  empty?: boolean;
  loading?: boolean;
  type?: "primary" | "default";
  loadingText?: string;
  topBorderOffset?: number;
}

function CardContainer({
  children,
  className,
  bordered = true,
  variant = "default",
  showTopBorder = true,
  showBottomBorder = true,
  empty = false,
  loading = false,
  type = "primary",
  loadingText,
  topBorderOffset = -65,
}: HoneyContainerProps) {
  return (
    <div
      style={
        {
          backgroundImage: bordered
            ? `${[
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
                .join(", ")}`
            : "none",
        } as React.CSSProperties
      }

      // TODO: Add style adaptation of different sizes
      className={cn(
        "flex flex-col h-full w-full gap-y-4 justify-center items-center rounded-2xl text-[#202020]",
        type === "primary"
          ? "bg-[#FFCD4D]"
          : bordered
            ? "border-3 border-[#F2C34A] bg-transparent"
            : "bg-transparent",
        bordered &&
          [
            "px-4",
            "bg-repeat-x",
            showTopBorder && "pt-[80px]",
            showBottomBorder && "pb-[80px]",
            "bg-[size:auto_70px,_auto_70px]",
            `bg-[position:top,_left_bottom]`,
          ]
            .filter(Boolean)
            .join(" "),
        className
      )}
    >
      {loading ? (
        <LoadingDisplay size={100} text={loadingText} />
      ) : empty ? (
        <div className="flex flex-col justify-center items-center min-h-[200px] space-y-5">
          <Image
            width={100}
            height={100}
            alt="No Data"
            src={"/images/honey-stick.svg"}
          />
          <p className="text-[#FFCD4D] text-5xl">No Data</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default CardContainer;
