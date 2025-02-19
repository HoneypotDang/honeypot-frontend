import { Select, SelectProps } from "@nextui-org/react";
import { cn } from "@/lib/tailwindcss";

const SelectField = <T extends object>(props: SelectProps<T>) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {
        props.label && <label className="font-normal text-xs md:text-base md:leading-[19.2px] text-[#202020]/80">{props.label}</label>
      }
      <Select
        aria-label="Select"
        classNames={{
          trigger:
            "bg-white h-[48px] md:h-[64px] data-[hover=true]:bg-white group-data-[invalid=true]:border-[#D53F3F] border border-black text-black px-3 md:px-4 shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)]",
          selectorIcon: 'right-4',
          value: '!text-[#202020] text-base md:text-[20px] group-data-[invalid=true]:!text-[#D53F3F] leading-[24px] text-opacity-100',
        }}
        popoverProps={{
          classNames: {
            content: "bg-white border border-black",
          }
        }}
        className={cn("min-w-40", props.className)}
        {...props}
        label={undefined}
      />
    </div>
  );
};

export default SelectField;
