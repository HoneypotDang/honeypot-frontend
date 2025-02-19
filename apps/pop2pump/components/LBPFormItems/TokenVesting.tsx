import React from "react";
import { DateValue, RadioGroup } from "@nextui-org/react";
import { DatePickerField, RadioField } from "./Components";
import { Controller, useFormContext } from "react-hook-form";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
  today,
} from "@internationalized/date";
import dayjs from "dayjs";

const ContentInfo = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <div className=" flex flex-col gap-[10px] font-medium">
      <div className="text-base leading-5">{title}</div>
      <div className="text-[12px] leading-4 text-white/50">{subTitle}</div>
    </div>
  );
};

const TokenVesting = () => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext();

  const endTime = getValues("endTime");
  const delayHours = getValues("tokenClaimDelayHours");
  const delayMinutes = getValues("tokenClaimDelayMinutes");
  const vestingCliffTime = watch("vestingCliffTime");

  const vestingStartTime = dayjs(endTime)
    .add(delayHours, "hours")
    .add(delayMinutes, "minutes");
  const isTokenVestingEnabled = watch("isTokenVestingEnabled");
  const isVestingCliffTimeEnabled = watch("isVestingCliffTimeEnabled");

  return (
    <div className="flex flex-col gap-9">
      <div className="font-medium">
        <div className="text-xl leading-[26px]">Token Vesting</div>
        <div className="text-xs leading-4 text-white/50">
          Token Vesting enables creators to choose a specific date in the future
          when Sale participants receive their tokens, rather than an immediate
          unlock.
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-base leading-5 font-medium">
          Do you want token vesting for your LBP ?
        </div>
        <Controller
          name="isTokenVestingEnabled"
          control={control}
          render={({ field }) => (
            <RadioGroup
              orientation="horizontal"
              classNames={{
                wrapper: "gap-5",
              }}
              value={field.value ? "yes" : "no"}
              onChange={(e) => {
                const value = e.target.value === "yes";
                field.onChange(value);
              }}
            >
              <RadioField value="yes">Yes</RadioField>
              <RadioField value="no">No</RadioField>
            </RadioGroup>
          )}
        />
      </div>

      {isTokenVestingEnabled && (
        <>
          <div className="flex flex-col gap-[18px]">
            <ContentInfo
              title={"1. Vesting Start Time"}
              subTitle={
                "Token Vesting enables creators to choose a specific date in the future when Sale participants receive their tokens, rather than an immediate unlock."
              }
            />
            <div className="flex flex-col gap-2 font-medium">
              <div className="text-[12px] leading-4  text-white/50">
                Vesting Start Time
              </div>
              <div className="text-base leading-5">
                {vestingStartTime.format("MMM DD, YYYY - hh:mmA")}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ContentInfo
              title="2. Vesting Cliff Time"
              subTitle="The cliff start represents when the tokens are first unlocked. The % of tokens unlocked here depends on the time of the LBP and how long you set your vesting for. if you select no for cliff times, tokens will be automatically streamed from the start time."
            />
            <Controller
              name="isVestingCliffTimeEnabled"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  orientation="horizontal"
                  classNames={{
                    wrapper: "gap-5",
                  }}
                  value={field.value ? "yes" : "no"}
                  onChange={(e) => {
                    const value = e.target.value === "yes";
                    field.onChange(value);
                  }}
                >
                  <RadioField value="yes">Yes</RadioField>
                  <RadioField value="no">No</RadioField>
                </RadioGroup>
              )}
            />
            {isVestingCliffTimeEnabled && (
              <Controller
                name="vestingCliffTime"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Vesting Cliff Time"
                    minValue={parseAbsoluteToLocal(endTime.toISOString())}
                    value={parseAbsoluteToLocal(field.value.toISOString())}
                    onChange={(value: DateValue | null) => {
                      if (value) {
                        field.onChange(value.toDate(getLocalTimeZone()));
                      }
                    }}
                    isInvalid={!!errors?.vestingCliffTime}
                    errorMessage={errors?.vestingCliffTime?.message?.toString()}
                  />
                )}
              />
            )}
          </div>
          {isVestingCliffTimeEnabled && (
            <div className="flex flex-col gap-2">
              <ContentInfo
                title="3. Vesting End Time"
                subTitle="Token are automatically streamed and linearly vested to the buyers wallet from the moment the vesting start time begins, to the vesting end time selected here."
              />

              <Controller
                name="vestingEndTime"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Ending Date & Time"
                    minValue={parseAbsoluteToLocal(
                      vestingCliffTime.toISOString()
                    )}
                    value={parseAbsoluteToLocal(field.value.toISOString())}
                    onChange={(value: DateValue | null) => {
                      if (value) {
                        field.onChange(value.toDate(getLocalTimeZone()));
                      }
                    }}
                    isInvalid={!!errors?.vestingEndTime}
                    errorMessage={errors?.vestingEndTime?.message?.toString()}
                  />
                )}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TokenVesting;
