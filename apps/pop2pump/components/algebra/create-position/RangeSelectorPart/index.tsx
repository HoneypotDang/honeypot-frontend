import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Price, Token } from "@cryptoalgebra/sdk";
import { useMintState } from "@/lib/algebra/state/mintStore";
import { Button } from "@/components/algebra/ui/button";
import { Input } from "@/components/algebra/ui/input";
import { cn } from "@/lib/utils";

export interface RangeSelectorPartProps {
  value: string;
  onUserInput: (value: string) => void;
  decrement: () => string;
  increment: () => string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  label?: string;
  width?: string;
  locked?: boolean;
  initialPrice: Price<Token, Token> | undefined;
  disabled: boolean;
  title: string;
}

const RangeSelectorPart = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  locked,
  onUserInput,
  disabled,
  title,
}: RangeSelectorPartProps) => {
  const [localUSDValue, setLocalUSDValue] = useState("");
  const [localTokenValue, setLocalTokenValue] = useState("");

  const {
    initialTokenPrice,
    actions: { updateSelectedPreset },
  } = useMintState();

  const handleOnBlur = useCallback(() => {
    onUserInput(localTokenValue);
  }, [localTokenValue, localUSDValue, onUserInput]);

  const handleDecrement = useCallback(() => {
    onUserInput(decrement());
  }, [decrement, onUserInput]);

  const handleIncrement = useCallback(() => {
    onUserInput(increment());
  }, [increment, onUserInput]);

  useEffect(() => {
    if (value) {
      setLocalTokenValue(value);
      if (value === "∞") {
        setLocalUSDValue(value);
        return;
      }
    } else if (value === "") {
      setLocalTokenValue("");
      setLocalUSDValue("");
    }
  }, [initialTokenPrice, value]);

  useEffect(() => {
    return () => updateSelectedPreset(null);
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-y-3">
      <div className="text-black flex items-center justify-between px-2">
        <span className="font-medium text-sm">{title.toUpperCase()}</span>
      </div>

      <div className="w-full rounded-2xl border bg-card-dark shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] flex items-center justify-between px-4 py-2.5 gap-x-2">
        <Button
          variant={"ghost"}
          onClick={handleDecrement}
          disabled={decrementDisabled || disabled}
          className="min-w-[40px] h-[40px] rounded-xl bg-[#FFCD4D] hover:bg-[#ffd666] text-black border-none font-bold text-xl disabled:opacity-50"
        >
          -
        </Button>

        <Input
          type={"text"}
          value={localTokenValue}
          id={title}
          onBlur={handleOnBlur}
          disabled={disabled || locked}
          onUserInput={(v: SetStateAction<string>) => {
            setLocalTokenValue(v);
            updateSelectedPreset(null);
          }}
          placeholder={"0.00"}
          className={cn(
            "text-right",
            "!bg-transparent",
            "[&_*]:!bg-transparent",
            "data-[invalid=true]:!bg-transparent",
            "border-none",
            "text-black",
            "text-xl",
            "font-medium"
          )}
          classNames={{
            inputWrapper: cn(
              "!bg-transparent",
              "border-none",
              "shadow-none",
              "!transition-none",
              "data-[invalid=true]:!bg-transparent",
              "group-data-[invalid=true]:!bg-transparent",
              "pr-5"
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
          }}
        />

        <Button
          variant={"ghost"}
          onClick={handleIncrement}
          disabled={incrementDisabled || disabled}
          className="min-w-[40px] h-[40px] rounded-xl bg-[#FFCD4D] hover:bg-[#ffd666] text-black border-none font-bold text-xl disabled:opacity-50"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default RangeSelectorPart;
