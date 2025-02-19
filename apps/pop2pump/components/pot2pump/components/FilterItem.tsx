import React from "react";

type Props = {
  min?: string;
  max?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

const FilterItem = ({ min, max, onChange, label }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-black text-base font-medium">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            placeholder="Min"
            value={min}
            name="min"
            onChange={(e) => onChange(e)}
            className="w-full bg-white rounded-[16px] px-2 py-2 text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-base font-medium leading-6 placeholder:leading-6"
          />
        </div>
        <div className="relative flex-1">
          <input
            placeholder="Max"
            value={max}
            name={"max"}
            onChange={(e) => onChange(e)}
            className="w-full bg-white rounded-[16px] px-2 py-2 text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-base font-medium leading-6 placeholder:leading-6"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterItem;
