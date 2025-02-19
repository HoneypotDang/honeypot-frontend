import { Input, InputProps } from "@nextui-org/react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { cn } from "@/lib/tailwindcss";

type NumberFieldProps = NumericFormatProps<InputProps>;

const NumberField = ({ className, classNames, ...props }: NumberFieldProps) => {
  return (
    <NumericFormat
      customInput={Input}
      placeholder="0"
      labelPlacement="outside"
      classNames={{
        label: "!font-normal !text-xs md:!text-base top-[20px] md:!leading-[19.2px] !text-[#202020]/80 group-data-[invalid=true]:!text-[#D53F3F] !left-0",
        input: cn('text-base md:text-xl text-[#202020] group-data-[has-value=true]:text-[#202020]', classNames?.input),
        inputWrapper: cn("bg-white border h-[48px] md:h-[64px] border-black text-black px-3 md:px-4 data-[hover=true]:bg-white group-data-[focus=true]:bg-white group-data-[invalid=true]:border-[#D53F3F] shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)]", classNames?.inputWrapper),
        base: cn(classNames?.base),
        clearButton: cn(classNames?.clearButton),
        description: cn(classNames?.description),
        errorMessage: cn(classNames?.errorMessage),
        helperWrapper: cn('absolute right-0 bottom-full text-sm text-[#D53F3F] leading-[16.8px]', classNames?.helperWrapper),
        innerWrapper: cn(classNames?.innerWrapper),
        mainWrapper: cn(classNames?.mainWrapper),
      }}
      className={className}
      allowNegative={false}
      thousandSeparator=","
      {...props}
    />
  );
};

export default NumberField;
