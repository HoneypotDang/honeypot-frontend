import CheckedIcon from "@/components/svg/CheckedIcon";
import ErrorIcon from "@/components/svg/ErrorIcon";
import { cn } from "@/lib/tailwindcss";
import { Input, InputProps } from "@nextui-org/react";

const InputField = ({ className, classNames, ...props }: InputProps) => {
  return (
    <Input
      size="lg"
      labelPlacement="outside"
      classNames={{
        base: classNames?.base,
        label: cn('!font-normal !text-xs md:!text-base top-[20px] md:!leading-[19.2px] !text-[#202020]/80 group-data-[invalid=true]:!text-[#D53F3F] !left-0', classNames?.label),
        inputWrapper: cn('bg-white border h-[48px] md:h-[64px] border-black text-black px-4 data-[hover=true]:bg-white/80 group-data-[focus=true]:bg-white group-data-[invalid=true]:border-[#D53F3F] shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)]', classNames?.inputWrapper),
        input: cn('text-base md:text-xl text-[#202020] group-data-[has-value=true]:text-[#202020]/80', classNames?.input),
        mainWrapper: cn('relative', classNames?.mainWrapper),
        helperWrapper: cn('absolute right-0 bottom-[calc(100%+5px)] md:bottom-full text-xs md:text-sm text-[#D53F3F] md:leading-[16.8px]', classNames?.helperWrapper),
        clearButton: classNames?.clearButton,
      }}
      className={cn("w-full", className)}
      endContent={
        props.isInvalid ? <ErrorIcon /> : props.value ? <CheckedIcon /> : null
      }
      {...props}
    />
  );
};

export default InputField;
