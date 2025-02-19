/* eslint-disable @next/next/no-img-element */
import { Slider, SliderProps } from "@nextui-org/react";
import NumberField from "./NumberField";

type SliderFieldProps = {
  label: string;
  firstTokenIcon?: string;
  firstTokenName?: string;
  secondTokenIcon?: string;
  secondTokenName?: string;
} & SliderProps;

const SliderField = (props: SliderFieldProps) => {
  const {
    label,
    firstTokenIcon,
    firstTokenName,
    secondTokenIcon,
    secondTokenName,
    ...rest
  } = props;
  return (
    <div>
      <label className="font-normal text-xs md:text-base md:leading-[19.2px] text-[#202020]/80">{label}</label>
      <div className="w-full flex items-center justify-between md:mt-2">
        {firstTokenName && (
          <div className="flex items-center gap-[10px] md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="rounded-full overflow-hidden">
                <img
                  src={firstTokenIcon}
                  alt={firstTokenName}
                  className="size-6 md:size-[32px] aspect-square rounded-full"
                />
              </div>
              <span className="text-base md:text-xl text-[#202020]">{firstTokenName}</span>
            </div>
            <NumberField
              className='w-fit h-[25px]'
              classNames={{
                inputWrapper: "h-[25px] rounded !min-h-[25px] !max-h-[25px] w-[49px] px-1 md:px-2 shadow-[1.5px_1.5px_0px_0px_#000]",
                input: 'text-sm leading-[16.8px] text-center'
              }}
              suffix="%"
              isAllowed={(values) => {
                const { floatValue } = values;
                const value = floatValue || 0;
                return 0 <= value && value <= 100;
              }}
              value={Number(rest.value)}
              onValueChange={(values) => {
                rest.onChange?.(values.floatValue || 0);
              }}
            />
          </div>
        )}

        {secondTokenName && (
          <div className="flex items-center gap-[10px] md:gap-4">
            <NumberField
              className='w-fit h-[25px]'
              classNames={{
                inputWrapper: "h-[25px] rounded !min-h-[25px] !max-h-[25px] w-[49px] px-1 md:px-2 shadow-[1.5px_1.5px_0px_0px_#000]",
                input: 'text-sm leading-[16.8px] text-center'
              }}
              suffix="%"
              isAllowed={(values) => {
                const { floatValue } = values;
                const value = floatValue || 0;
                return 0 <= value && value <= 100;
              }}
              value={100 - Number(rest.value)}
              onValueChange={(values) => {
                rest.onChange?.(100 - (values.floatValue || 0));
              }}
            />
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-base md:text-xltext-[#202020]">{secondTokenName}</span>
              <div className="rounded-full overflow-hidden">
                <img
                  src={secondTokenIcon}
                  alt={secondTokenName}
                  className="size-[24px] md:size-[32px] aspect-square rounded-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Slider
        size="md"
        step={1}
        minValue={0}
        maxValue={100}
        aria-label={label}
        classNames={{
          track: "h-3 bg-[#A48D51] ",
          filler: "bg-[#FFCD4D] rounded-2xl",
          thumb: "bg-[#FFCD4D] after:bg-white after:w-3 after:h-3",
        }}
        className="mt-2"
        {...rest}
      />
    </div>
  );
};

export default SliderField;
