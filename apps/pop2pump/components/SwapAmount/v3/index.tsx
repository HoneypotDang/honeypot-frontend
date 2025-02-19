import { swap } from "@/services/swap";
import { Input } from "@/components/input";
import { InputProps } from "@nextui-org/react";
import { Token } from "@/services/contract/token";
import { TokenSelector } from "@/components/TokenSelector/v3";
import { cn } from "@/lib/tailwindcss";

type SwapAmountProps = {
  label: string;
  token?: Token;
  direction: "from" | "to";
  inputProps?: InputProps;
};

export const SwapAmount = ({
  label,
  token,
  direction,
  inputProps,
}: SwapAmountProps) => {
  return (
    <div className="flex-1 w-full flex flex-col gap-y-3">
      <div className="text-black flex items-center justify-between">
        <span>{label}</span>
        <div className="flex items-center gap-x-2">
          <div>Balance: {token?.balanceFormatted}</div>
          {direction === "from" && (
            <div
              className="cursor-pointer underline"
              onClick={() => {
                swap.setFromAmount((swap.fromToken as Token).balance.toFixed());
              }}
            >
              Max
            </div>
          )}
        </div>
      </div>
      <div className="w-full rounded-2xl border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] flex items-center justify-between px-4 py-2.5 gap-x-2">
        <TokenSelector
          value={token}
          onSelect={(token) => {
            direction === "from"
              ? swap.setFromToken(token)
              : swap.setToToken(token);
          }}
        />
        <Input
          type="number"
          placeholder="0.00"
          isClearable
          classNames={{
            base: cn(
              "text-right",
              "!bg-transparent",
              "[&_*]:!bg-transparent",
              "data-[invalid=true]:!bg-transparent"
            ),

            inputWrapper: cn(
              "!bg-transparent",
              "border-none",
              "shadow-none",
              "!transition-none",
              "data-[invalid=true]:!bg-transparent",
              "group-data-[invalid=true]:!bg-transparent"
            ),

            input: cn(
              "!bg-transparent",
              "!text-[#202020]",
              "text-right",
              "text-xl",
              "!pr-0",
              "[appearance:textfield]",
              "[&::-webkit-outer-spin-button]:appearance-none",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "data-[invalid=true]:!bg-transparent"
            ),

            clearButton: cn(
              "opacity-70",
              "hover:opacity-100",
              "!text-black",
              "!p-0"
            ),
          }}
          {...inputProps}
        />
      </div>
    </div>
  );
};
