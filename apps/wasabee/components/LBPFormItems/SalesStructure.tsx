import React from "react";
import { DateValue, SelectItem } from "@nextui-org/react";
import { Controller, useFormContext } from "react-hook-form";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
} from "@internationalized/date";
import { DatePickerField, NumberField, SelectField } from "./Components";
import { LBP_TYPE, PRICE_TYPE } from "@/types/launch-project";
import { FormContainer } from "./Components";

const PRICE_TYPE_OPTIONS = [
  { key: "lbp", value: PRICE_TYPE.LBP, label: "LBP" },
  // { key: "fixed", value: PRICE_TYPE.FIXED, label: "Fixed Price" },
];

const LBP_TYPE_OPTIONS = [
  { key: "buy-sell", value: LBP_TYPE.BUY_SELL, label: "Buy & Sell" },
  { key: "buy-only", value: LBP_TYPE.SELL_ONLY, label: "Buy Only" },
];

const SalesStructure = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const isPriceLbp = watch("priceType") === PRICE_TYPE.LBP;

  return (
    <FormContainer className="text-[#202020]/80">
      <h3 className="text-[22px] md:text-2xl leading-[26px] text-center mb-4">
        Sales Structure
      </h3>

      <div className="flex flex-col gap-4 pb-4 border-b border-black md:pb-0 mb:border-0">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs md:text-base md:leading-5 font-normal text-[#202020]/80 flex-1">
              Sale price type
            </p>
            <p className="mt-2 font-medium text-[10px] md:text-[13px] md:leading-4 text-[#202020]/80 flex-1">
              Choose between an LBP or a Fixed Price Sale
            </p>
          </div>
          <Controller
            name="priceType"
            control={control}
            render={({ field }) => (
              <SelectField
                items={PRICE_TYPE_OPTIONS}
                className="w-full"
                selectedKeys={[field.value]}
                disallowEmptySelection
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors.priceType}
                errorMessage={errors.priceType?.message?.toString()}
              >
                {PRICE_TYPE_OPTIONS.map((price) => (
                  <SelectItem
                    key={price.key}
                    value={price.value}
                    classNames={{
                      base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-0 rounded-none",
                      title: 'text-base leading-[16px]',
                      selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                    }}
                  >
                    {price.label}
                  </SelectItem>
                ))}
              </SelectField>
            )}
          />
        </div>
        {isPriceLbp && (
          <Controller
            name="lbpType"
            control={control}
            defaultValue={LBP_TYPE.BUY_SELL}
            render={({ field }) => (
              <SelectField
                aria-label="LBP Type"
                label="LBP Type"
                items={LBP_TYPE_OPTIONS}
                className="w-full"
                selectedKeys={field.value ? [field.value] : undefined}
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors.lbpType}
                errorMessage={errors.lbpType?.message?.toString()}
                disallowEmptySelection
              >
                {LBP_TYPE_OPTIONS.map((price) => (
                  <SelectItem key={price.key} value={price.value}
                    classNames={{
                      base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-0 rounded-none",
                      title: 'text-base leading-[16px]',
                      selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                    }}
                  >
                    {price.label}
                  </SelectItem>
                ))}
              </SelectField>
            )}
          />
        )}
      </div>

      <div className="flex flex-col mt-4 md:mt-6 gap-4 pb-4 border-b border-black md:pb-0 md:border-0">
        <h5 className="text-[22px] md:text-2xl text-center">Configure Duration</h5>
        <div className="flex gap-4 md:gap-6 flex-col lg:flex-row item-center">
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <DatePickerField
                label="Starting Date & Time"
                minValue={today(getLocalTimeZone())}
                value={parseAbsoluteToLocal(field.value.toISOString())}
                onChange={(value: DateValue | null) => {
                  if (value) {
                    field.onChange(value.toDate(getLocalTimeZone()));
                  }
                }}
                isInvalid={!!errors?.startTime}
                errorMessage={errors?.startTime?.message?.toString()}
              />
            )}
          />

          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <DatePickerField
                label="Ending Date & Time"
                minValue={today(getLocalTimeZone())}
                value={parseAbsoluteToLocal(field.value.toISOString())}
                onChange={(value: DateValue | null) => {
                  if (value) {
                    field.onChange(value.toDate(getLocalTimeZone()));
                  }
                }}
                isInvalid={!!errors?.endTime}
                errorMessage={errors?.endTime?.message?.toString()}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-4 md:mt-6">
        <h5 className="text-[22px] md:text-2xl text-center">Token Claim Delay</h5>
        <p className="text-sm md:text-base text-center max-w-[273.75px] md:max-w-[968.6px] mx-auto mb-4">
          {isPriceLbp
            ? "How much maximum you want to raise. The Sale will conclude once this number is reached."
            : "You can select to delay users claiming tokens at the conclusion of the sale to avoid front running of setting up liquidity pools. Select a time on the calendar that users can begin claiming tokens after the sale has concluded. "}
        </p>

        {isPriceLbp && (
          <div className="flex gap-4 md:gap-6 flex-col md:flex-row items-center">
            <Controller
              name="tokenClaimDelayHours"
              control={control}
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onValueChange={(values) =>
                    field.onChange(Number(values.floatValue))
                  }
                  label="Hours"
                  placeholder="0"
                  isInvalid={!!errors?.tokenClaimDelayHours}
                  errorMessage={errors?.tokenClaimDelayHours?.message?.toString()}
                />
              )}
            />
            <Controller
              name="tokenClaimDelayMinutes"
              control={control}
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onValueChange={(values) =>
                    field.onChange(Number(values.floatValue))
                  }
                  label="Minutes"
                  placeholder="0"
                  isInvalid={!!errors?.tokenClaimDelayMinutes}
                  errorMessage={errors?.tokenClaimDelayMinutes?.message?.toString()}
                />
              )}
            />
          </div>
        )}

        {!isPriceLbp && (
          <Controller
            name="tokenClaimDelay"
            control={control}
            render={({ field }) => (
              <DatePickerField
                value={parseAbsoluteToLocal(field.value.toISOString())}
                onChange={(value: DateValue | null) => {
                  field.onChange(value?.toDate(getLocalTimeZone()));
                }}
                isInvalid={!!errors?.tokenClaimDelay}
                errorMessage={errors?.tokenClaimDelay?.message?.toString()}
              />
            )}
          />
        )}
      </div>
    </FormContainer>
  );
};

export default SalesStructure;
