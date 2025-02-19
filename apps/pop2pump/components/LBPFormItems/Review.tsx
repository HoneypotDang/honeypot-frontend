import { Checkbox, CheckboxGroup, Listbox, ListboxItem } from "@nextui-org/react";
import clsx from "clsx";
import React, { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { REVIEW_RIGHT } from "@/types/launch-project";
import { useReadContract } from "wagmi";
import { ERC20ABI } from "@/lib/abis/erc20";
import dayjs from "dayjs";
import { FormContainer, InputField } from "./Components";
import ArrowDownSvg from "../svg/ArrowDown";


interface EditBtnProps {
  onClick: () => void,
  className?: string
}

const EditBtn = ({ onClick, className }: EditBtnProps) => {
  return (
    <div className={`flex items-center justify-end ${className}`}>
      <div
        className="relative bg-white flex h-8 items-center hover:cursor-pointer hover:bg-white/20 gap-2 border border-[#202020] w-fit rounded-lg shadow-button px-3 py-2"
        onClick={onClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="#131313"
        >
          <path
            opacity="0.5"
            d="M11.6597 2.16094L9.84048 0.340328C9.62051 0.12036 9.32861 0 9.01871 0C8.70744 0 8.41553 0.12036 8.19695 0.340328L0.576934 7.95896C0.504994 8.0309 0.457957 8.12497 0.444123 8.22596L0.00418737 11.4701C-0.0151809 11.6154 0.0332397 11.7607 0.136998 11.863C0.225538 11.9516 0.344515 12 0.467641 12C0.488393 12 0.509145 11.9986 0.529896 11.9958L3.77407 11.5559C3.87507 11.5421 3.96914 11.495 4.04108 11.4231L11.6583 3.80586C11.8783 3.58589 11.9987 3.29398 11.9987 2.98409C12 2.67282 11.8797 2.38091 11.6597 2.16094ZM3.49185 10.6498L1.01272 10.9859L1.3489 8.5068L6.7471 3.1086L8.89005 5.25156L3.49185 10.6498ZM10.9984 3.14457L9.55134 4.59165L7.40977 2.4487L8.85547 1.00161C8.91357 0.94351 8.98136 0.935209 9.01733 0.935209C9.0533 0.935209 9.12109 0.94351 9.17919 1.00161L10.9984 2.82084C11.0565 2.87895 11.0648 2.94674 11.0648 2.98271C11.0648 3.01868 11.0565 3.08647 10.9984 3.14457Z"
            fill="#131313"
          />
        </svg>
        <span className='text-sm'>Edit</span>
      </div>
    </div>
  );
};

const Content = ({
  title,
  value,
  valueClassName,
  isLoading,
}: {
  title: string;
  value?: ReactNode;
  valueClassName?: string;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-1 md:gap-3 text-[#202020] flex-1">
      {
        title && <h5 className="text-sm md:text-base md:leading-5 text-[#202020]/80">{title}</h5>
      }
      <div
        className={clsx(
          "text-base md:text-xl leading-4 p-3 h-12 md:p-4 md:h-16 border border-black rounded-2xl flex items-center shadow-field w-full",
          valueClassName
        )}
      >
        {isLoading ? (
          <div className="animate-pulse bg-neutral-400 h-2.5 w-10 rounded-full"></div>
        ) : value}
      </div>
    </div>
  );
};

const Token = ({ name, logo }: { name: string, logo: string }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        className="size-6 md:size-[32px] aspect-square rounded-full "
        src={
          logo
        }
        alt={name}
      />
      <span className="text-base md:text-xl">{name}</span>
      <ArrowDownSvg />
    </div>
  )
}

const Review = ({ changeStep }: { changeStep: (step: number) => void }) => {
  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext();

  const { projectTokenQuantity, assetTokenName, assetTokenLogo, endWeight, startWeight, endTime, startTime, lbpDescription, projectTokenLogo, assetTokenQuantity } = getValues()

  const projectToken = watch("projectToken");

  const duration = (dayjs(endTime).unix() - dayjs(startTime).unix()) / 86400;

  const { data: projectTokenName, isLoading } = useReadContract({
    abi: ERC20ABI,
    address: projectToken,
    functionName: "name",
  });

  const { data: projectTokenSym, isLoading: isLoadingSymbol } = useReadContract({
    abi: ERC20ABI,
    address: projectToken,
    functionName: "symbol",
  });

  return (
    <FormContainer className="">
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] max-md:text-center text-xl leading-[26px]">Token Sale Summary</h2>
        <p className="text-sm max-md:text-center">
          Please review all aspects before finishing
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-5 md:mt-8 pb-5 border-b border-black">
        <div className="flex items-center justify-between">
          <h5 className='text-sm md:text-xl'>Project Token Contract Addree</h5>
          <EditBtn onClick={() => changeStep(0)} />
        </div>
        <Controller
          name="projectToken"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              placeholder="Enter token"
              isInvalid={!!errors?.projectToken}
              errorMessage={errors?.projectToken?.message?.toString()}
              disabled
            />
          )}
        />
        <div className="flex gap-3 flex-col md:gap-6 md:flex-row">
          <div className="flex-1">
            <Content
              title={"Token Name"}
              value={projectTokenName}
              isLoading={isLoading}
            />
          </div>
          <div className="flex-1">
            <Content title={"Token Ticker"} value={projectTokenSym} isLoading={isLoadingSymbol} />
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-3 mt-5 pb-5 border-b border-black">
        <EditBtn onClick={() => changeStep(2)} className="!justify-start" />
        <Content title={"Token Claim Time"} value={"2024/10/31 00:00:00"} />

        <div className="flex gap-3 flex-col md:gap-8 md:flex-row">
          <Content title={"Project Token Quantity"} value={
            <div className="w-full flex justify-between items-center">
              <Token name={projectTokenSym!} logo={projectTokenLogo} />
              <span className="text-xl">{projectTokenQuantity}</span>
            </div>
          } />
          <Content title={"Collateral Token Quantity"} value={
            <div className="w-full flex justify-between items-center">
              <Token name={assetTokenName!} logo={assetTokenLogo} />
              <span className="text-xl">{assetTokenQuantity}</span>
            </div>
          } />
        </div>
        <div className="flex gap-3 flex-col md:gap-8 md:flex-row">
          <Content
            title={"Price Range"}
            value={"$989,670,141.9 - $6,126,990.125806"}
          />
          <Content title={"Liquidity"} value={"$1"} />
        </div>
        <div className="flex gap-3 flex-col md:gap-8 md:flex-row">
          <Content title={"Starting Weigh"} value={`${startWeight}% ${projectTokenSym} ${100 - startWeight}% ${assetTokenName}`} />
          <Content title={"End Weight"} value={`${endWeight}% ${projectTokenSym} ${100 - endWeight}% ${assetTokenName}`} />
        </div>

        <div className="flex gap-3 flex-col md:gap-8 md:flex-row">
          <Content title={"Start Time"} value={dayjs(startTime).format("MM/DD/YYYY HH:mm")} />
          <Content title={"End Time Weight"} value={dayjs(endTime).format("MM/DD/YYYY HH:mm")} />
          <Content title={"Duration"} value={`in${duration.toFixed(2)}days`} />
        </div>
        <div className="flex gap-3 flex-col md:gap-8 md:flex-row">
          <Content title={"Platform Fee"} value={"0.3%"} />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        <div className="flex items-center justify-between">
          <h5 className='text-xl'>Description</h5>
          <EditBtn onClick={() => changeStep(3)} />
        </div>

        <Content
          title={""}
          value={lbpDescription}
        />
        <div className="mt-[10px]">
          <h4 className="text-base leading-5 text-[#202020]/80 mb-3">Rights</h4>
          <Controller
            name="rights"
            control={control}
            render={({ field }) => {
              console.log('field: ', field);
              return (
                <Listbox
                  variant="flat"
                  selectionMode="multiple"
                  selectedKeys={field.value}
                  onSelectionChange={(keys) => {
                    field.onChange([(keys as any).anchorKey])
                  }
                  }
                  className="bg-transparent rounded-md px-0"
                  classNames={
                    {
                      list: 'gap-3 md:flex-row md:gap-6'
                    }
                  }
                >
                  <ListboxItem
                    key={REVIEW_RIGHT.PAUSE_LBP}
                    className="hover:bg-white/60"
                    classNames={{
                      base: "select-item shadow-field bg-white py-3 h-[48px] md:h-[64px] item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-3 rounded-2xl border border-black shadow-[1px_2px_0px_0px_#9B7D2F]",
                      title: 'text-xl',
                      selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                    }}
                    textValue={REVIEW_RIGHT.PAUSE_LBP}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xl mt-1">Pause LBP</p>
                    </div>
                  </ListboxItem>

                  <ListboxItem
                    key={REVIEW_RIGHT.UNPAUSE_LBP}
                    className="hover:bg-white/60"
                    classNames={{
                      base: "select-item shadow-field bg-white py-3 h-[48px] md:h-[64px] item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-3 rounded-2xl border border-black shadow-[1px_2px_0px_0px_#9B7D2F]",
                      title: 'text-xl',
                      selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                    }}
                    textValue={REVIEW_RIGHT.PAUSE_LBP}
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-xl mt-1">Unpause LBP</p>
                    </div>
                  </ListboxItem>
                </Listbox>
                // <CheckboxGroup
                //   value={field.value}
                //   onValueChange={(values) => field.onChange(values)}
                //   orientation="horizontal"
                // >
                //   <div className="flex-1 flex justify-between">
                //     <Checkbox
                //       value={REVIEW_RIGHT.PAUSE_LBP}
                //       classNames={{
                //         wrapper: "group-data-[selected=true]:after:bg-[#865215]",
                //         icon: "text-black",
                //         base: 'flex-row-reverse flex-1 max-w-full justify-between border border-black rounded-2xl px-4 py-5 ',
                //         label: 'text-[#202020] aaaaaaaaaaa'
                //       }}
                //     >
                //       Pause LBP
                //     </Checkbox>

                //     <Checkbox
                //       value={REVIEW_RIGHT.UNPAUSE_LBP}
                //       classNames={{
                //         wrapper: "group-data-[selected=true]:after:bg-[#865215]",
                //         icon: "text-black",
                //         base: 'flex-row-reverse flex-1 max-w-full justify-between border border-black rounded-2xl px-4 py-5 ',
                //         label: 'text-[#202020] aaaaaaaaaaa'
                //       }}
                //     >
                //       Unpause LBP
                //     </Checkbox>
                //   </div>

                // </CheckboxGroup>
              )
            }}
          />
        </div>
      </div>
    </FormContainer>
  );
};

export default Review;
