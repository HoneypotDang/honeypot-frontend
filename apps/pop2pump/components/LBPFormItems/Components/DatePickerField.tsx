import { DatePickerProps, DatePicker } from "@nextui-org/react";

const DatePickerField = ({ label, ...props }: DatePickerProps) => {
  return (
    <div className="date-picker-wrapper w-full flex flex-col gap-3">
      {
        label && <label className="font-normal text-xs md:text-base md:leading-[19.2px] text-[#202020] opacity-80">{label}</label>
      }
      <DatePicker
        classNames={{
          calendar: "date-picker-calendar",
          ...props.classNames,
        }}
        timeInputProps={{
          classNames: {
            ...props.timeInputProps?.classNames,
          },
        }}
        variant="bordered"
        hideTimeZone
        className="w-full"
        labelPlacement="outside"
        {...props}
      ></DatePicker>
    </div>
  );
};

export default DatePickerField;
