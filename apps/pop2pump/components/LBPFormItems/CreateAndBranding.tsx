import React, { useEffect } from "react";
import { SelectItem } from "@nextui-org/react";
import { InputField, SelectField } from "./Components";
import { Controller, useFormContext } from "react-hook-form";
import { useAccount, useReadContract } from "wagmi";
import { ERC20ABI } from "@/lib/abis/erc20";
import { FormContainer } from "./Components";

const ECOSYSTEM_OPTIONS = [
  {
    key: "evm",
    value: 1,
    label: "EVM",
    icon: "/images/launch-project/eth-icon.png",
  },
];

const TARGET_NETWORK_OPTIONS = [
  {
    key: "berachain",
    value: 1,
    label: "Berachain",
    icon: "/images/launch-project/eth-icon.png",
  },
];

const WALLET_NETWORK_OPTIONS = [
  {
    key: "eth",
    value: 1,
    label: "ETH",
    icon: "/images/launch-project/eth-icon.png",
  },
];

const RenderValueSelectField = ({ icon, label }: { icon?: string, label?: string }) => {
  return <div className="flex items-center gap-3">
    {
      icon && label ? <>
        <img src={icon} alt="icon" className="w-6 aspect-square md:w-8" />
        <span className="pt-0.5 text-lg md:text-xl">{label}</span>
      </> : <span className="pt-0.5 text-lg md:text-xl">{label}</span>
    }
  </div>
}

const CreateAndBranding = () => {
  const {
    control,
    formState: { errors },
    setError,
    watch,
  } = useFormContext();

  const account = useAccount();

  const projectToken = watch("projectToken");

  const { data, refetch, isLoading } = useReadContract({
    abi: ERC20ABI,
    address: projectToken,
    functionName: "balanceOf",
    args: [account.address!],
  });

  useEffect(() => {
    if (projectToken && !errors?.projectToken) {
      console.log("refetching project");
      refetch();
    }
  }, [projectToken]);

  if (
    data == undefined &&
    projectToken &&
    !errors?.projectToken &&
    !isLoading
  ) {
    setError("projectToken", { message: "Invalid ERC20 address" });
  }

  return (
    <>
      <div className="font-normal text-center text-black max-w-[319.16px] md:max-w-[706.31px] mx-auto">
        <h3 className="text-2xl md:text-[32px] md:leading-[36.64px]">
          Select Network & Add Token Information
        </h3>
        <p className="text-xs md:text-base md:leading-[18.32px] mt-3 md:max-w-[630px] mx-auto ">
          Select the blockchain you would like to create a Token Sale on and
          enter your project token details.
        </p>
      </div>
      <FormContainer className="mt-[32px] flex flex-col gap-4 text-black">
        <Controller
          name="ecosystem"
          control={control}
          render={({ field }) => (
            <SelectField
              aria-label="Ecosystem"
              label="Ecosystem"
              items={ECOSYSTEM_OPTIONS}
              renderValue={(items) => {
                return items?.map((item) => (
                  <RenderValueSelectField key={item.key} icon={item?.data?.icon} label={item.data?.label} />
                ));
              }}
              selectedKeys={[field.value]}
              onChange={(e) => field.onChange(e.target.value)}
              isInvalid={!!errors?.ecosystem}
              errorMessage={errors.ecosystem?.message?.toString()}
              isDisabled={true}
            >
              {(ecosystem) => (
                <SelectItem key={ecosystem.key} value={ecosystem.value} classNames={{
                  base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-0 rounded-none",
                  title: 'text-base leading-[16px]',
                  selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                }}>
                  <div className="flex items-center gap-3">
                    <img src={ecosystem.icon} alt="icon" />
                    <span className="pt-1">{ecosystem.label}</span>
                  </div>
                </SelectItem>
              )}
            </SelectField>
          )}
        />
        <div className="flex item-center gap-6 flex-col md:flex-row">
          <Controller
            name="targetNetwork"
            control={control}
            render={({ field }) => (
              <SelectField
                aria-label="Select Target Network"
                label="Select Target Network"
                items={TARGET_NETWORK_OPTIONS}
                renderValue={(items) => {
                  return items?.map((item) => (
                    <RenderValueSelectField key={item.key} icon={item?.data?.icon} label={item.data?.label} />
                  ));
                }}
                selectedKeys={[field.value]}
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors?.targetNetwork}
                errorMessage={errors?.targetNetwork?.message?.toString()}
                isDisabled={true}
              >
                {(targetNetwork) => (
                  <SelectItem
                    key={targetNetwork.key}
                    value={targetNetwork.value}
                    classNames={{
                      base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-0 rounded-none",
                      title: 'text-base leading-[16px]',
                      selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={targetNetwork.icon} alt="icon" />
                      <span className="pt-1">{targetNetwork.label}</span>
                    </div>
                  </SelectItem>
                )}
              </SelectField>
            )}
          />

          <Controller
            name="connectedWalletNetwork"
            control={control}
            render={({ field }) => (
              <SelectField
                aria-label="Connected Wallet Network"
                label="Connected Wallet Network"
                items={WALLET_NETWORK_OPTIONS}
                renderValue={(items) => {
                  return items?.map((item) => (
                    <RenderValueSelectField key={item.key} icon={item?.data?.icon} label={item.data?.label} />
                  ));
                }}
                selectedKeys={[field.value]}
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors?.connectedWalletNetwork}
                errorMessage={errors?.connectedWalletNetwork?.message?.toString()}
                isDisabled={true}
              >
                {(walletNetwork) => (
                  <SelectItem
                    key={walletNetwork.key}
                    value={walletNetwork.value}
                    classNames={{
                      base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-0 rounded-none",
                      title: 'text-base leading-[16px]',
                      selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={walletNetwork.icon} alt="icon" />
                      <span className="pt-1">{walletNetwork.label}</span>
                    </div>
                  </SelectItem>
                )}
              </SelectField>
            )}
          />
        </div>
        <Controller
          name="projectName"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="Project Name"
              placeholder="Enter Project Name"
              isInvalid={!!errors?.projectName}
              errorMessage={errors?.projectName?.message?.toString()}
            />
          )}
        />
        <Controller
          name="projectToken"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="Project Token"
              placeholder="Enter token"
              isInvalid={!!errors?.projectToken}
              errorMessage={errors?.projectToken?.message?.toString()}
            />
          )}
        />
        <Controller
          name="projectTokenLogo"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="Project Token Logo"
              placeholder="Paste URL here"
              isInvalid={!!errors?.projectTokenLogo}
              errorMessage={errors?.projectTokenLogo?.message?.toString()}
            />
          )}
        />
        <Controller
          name="saleBanner"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              label="Sale Banner"
              placeholder="Paste URL here"
              isInvalid={!!errors?.saleBanner}
              errorMessage={errors?.saleBanner?.message?.toString()}
            />
          )}
        />
      </FormContainer>
    </>
  );
};

export default CreateAndBranding;
