import React from "react";
import { Copy } from "@/components/Copy";
import { VscCopy } from "react-icons/vsc";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  copyTip?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  label,
  className,
  copyTip = "Copy",
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="text-white text-sm font-medium leading-[normal]">
          {label}
        </div>
      )}
      <Copy
        className="w-full"
        content={copyTip}
        value={value}
        displayContent={
          <div className="size-6 cursor-pointer flex items-center justify-center bg-white text-[#202020] border border-[#202020] rounded-md drop-shadow-[1px_1px_0px_#000] [stroke-width:0.75px] stroke-[#202020] hover:bg-[#FFCD4D]">
            <VscCopy className="size-4" />
          </div>
        }
      />
    </div>
  );
};

export default CopyButton;
