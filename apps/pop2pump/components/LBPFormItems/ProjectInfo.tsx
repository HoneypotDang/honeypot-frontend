/* eslint-disable @next/next/no-img-element */
import {
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  SelectItem,
  Textarea,
  useDisclosure,
  Button
} from "@nextui-org/react";
import React, { useState } from "react";
import SelectField from "./Components/SelectField";
import clsx from "clsx";
import InputField from "./Components/InputField";
import { PROJECT_CATEGORY_TYPE } from "@/types/launch-project";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import SearchIcon from "../svg/SearchIcon";
import COUNTRY_LIST from "./data.json";
import CloseIcon from "../svg/CloseIcon";
import { FormContainer, NumberField } from "./Components";
import Markdown from "markdown-to-jsx";
import classes from "./github-markdown.module.css";
import { CopyIcon } from "lucide-react";

const PROJECT_CATEGORY_OPTIONS = [
  { key: "gaming", value: PROJECT_CATEGORY_TYPE.GAMING, label: "Gaming" },
  { key: "crypto", value: PROJECT_CATEGORY_TYPE.CRYPTO, label: "Crypto" },
  { key: "finance", value: PROJECT_CATEGORY_TYPE.FINANCE, label: "Finance" },
];

type GeoBlockedCountriesModalProps = {};

const GeoBlockedCountriesModal = (props: GeoBlockedCountriesModalProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const selectedCountry = watch("blockedCountry");
  const [selectedCountries, setSelectedCountries] = useState(selectedCountry);

  const [searchValue, setSearchValue] = React.useState("");

  const filteredList = COUNTRY_LIST.filter((token) =>
    token.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleClose = () => {
    if (selectedCountries)
      setValue("blockedCountry", Array.from(selectedCountries));
  };
  return (
    <>
      <button
        type="button"
        className="text-sm relative bg-white border-[0.6px] border-black rounded-lg px-3 py-2 shadow-button"
        onClick={onOpen}
      >
        + Add
      </button>

      <Modal
        classNames={{
          base: "!overflow-y-visible absolute top-0 px-4 shadow-none !mt-[170px]",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleClose}
        hideCloseButton
        size='md'
      >
        <ModalContent className='!bg-transparent !border-none'>
          <div className='absolute top-0 left-0 right-0 -translate-y-3/4 flex justify-center'>
            <img src="/images/launch-project/Group.png" alt="handing-rope" />
          </div>

          <div className="hidden lg:flex absolute left-0 -translate-x-[60%] -translate-y-[10%]" >
            <img src="/images/launch-project/launch-project-sticky3.png" alt="sticky3" />
          </div>

          <div className="hidden lg:flex absolute bottom-6 right-0 translate-x-[70%]" >
            <img src="/images/launch-project/launch-project-sticky4.png" alt="sticky4" />
          </div>
          <ModalBody
            className="relative z-50 w-ful rounded-3xl px-0 pb-16 text-[#202020] block" style={{
              background: "url('/images/launch-project/subtract-sticky.png'), url('/images/launch-project/subtract-bg.png')",
              backgroundSize: "contain, cover",
              backgroundRepeat: 'no-repeat, no-repeat',
            }}>
            <div className='flex items-center justify-between pt-6 pb-4 border-b px-6 border-[#202020]'>
              <h3 className="text-lg ">
                Select a Country
              </h3>
              <Button isIconOnly className='!size-8 min-w-8 rounded-md bottom-1' variant="bordered" onClick={handleClose}>
                <CloseIcon className="text-black" />
              </Button>
            </div>
            <div className="px-6 pt-4 pb-6 border-b border-[#202020]">
              <p className="text-sm mb-2">
                Selected countries will be blocked from access your Sale.
              </p>
              <InputField
                placeholder="Search"
                startContent={<SearchIcon className="size-5 !text-[#202020]" />}
                classNames={{
                  input: "text-sm mt-1 leading-[16px]",
                  inputWrapper: 'h-[40px]',
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto h-[300px] mx-6 mt-6 no-scrollbar">
              <Controller
                name="blockedCountry"
                control={control}
                render={({ field }) => (
                  <Listbox
                    aria-label="Select a Country"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedCountries}
                    onSelectionChange={(keys) =>
                      setSelectedCountries(keys as Set<string>)
                    }
                    className="bg-transparent rounded-md px-0"
                    classNames={
                      {
                        list: 'gap-3'
                      }
                    }
                  >
                    {filteredList.map((token) => (
                      <ListboxItem
                        key={token.code}
                        className="hover:bg-white/60"
                        classNames={{
                          base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-3 rounded-lg border border-black shadow-[1px_2px_0px_0px_#9B7D2F]",
                          title: 'text-base leading-[16px]',
                          selectedIcon: 'block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden'
                        }}
                        textValue={token.name}
                      >
                        <div className="flex items-center gap-2">
                          <div className='w-[40px] h-6 rounded border border-black shadow-button overflow-hidden'>
                            <img
                              src={token.image}
                              alt={token.name}
                              className='h-full w-full object-cover scale-150'
                            />
                          </div>
                          <p className="text-sm mt-1">{token.name}</p>
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                )}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ProjectInfo = () => {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext();

  const {
    fields: investmentRoundFields,
    append: investmentRoundAppend,
    remove: investmentRoundRemove,
  } = useFieldArray({
    control,
    name: `investmentRound`,
  });

  const handleTabChange = (tab: "edit" | "preview") => {
    setActiveTab(tab);
  };

  const handleRemoveCountry = (countryCode: string) => {
    setValue(
      "blockedCountry",
      getValues("blockedCountry").filter((item: string) => item !== countryCode)
    );
  };

  return (
    <FormContainer className="text-[#202020]">
      <div>
        <h3 className="text-[22px] max-md:text-center md:text-2xl md:leading-[28.79px]">Project Infomation</h3>
        <p className="text-sm max-md:text-center leading-4 mt-3">Please Fill out Sale details.</p>
      </div>
      <div className="flex flex-col gap-5 mt-4 md:mt-8">
        <div className="pb-5 border-b border-black">
          <h3 className="text-lg md:text-xl mb-2">Category</h3>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <SelectField
                items={PROJECT_CATEGORY_OPTIONS}
                selectedKeys={[field.value]}
                onChange={(e) => field.onChange(e.target.value)}
                isInvalid={!!errors.priceType}
                errorMessage={errors.priceType?.message?.toString()}
              >
                {PROJECT_CATEGORY_OPTIONS.map((price) => (
                  <SelectItem
                    key={price.key}
                    value={price.value}
                    classNames={{
                      base: "select-item bg-white py-3 item-center data-[hover=true]:bg-white/80 data-[selectable=true]:focus:bg-white/80 data-[selectable=true]:text-[#202020] data-[selectable=true]:focus:text-[#202020] data-[selected=true]:border-b data-[selected=true]:border-[#2F302B] px-0 rounded-none",
                      title: "text-base leading-[16px]",
                      selectedIcon:
                        "block p-1 w-6 h-6 border-[0.5px] border-[#202020] shadow-[1.125px_1.125px_0px_0px_#000] rounded hidden",
                    }}
                  >
                    {price.label}
                  </SelectItem>
                ))}
              </SelectField>
            )}
          />
        </div>
        <div>
          <h4 className="text-lg md:text-xl">LBP Description</h4>
          <div className="text-sm leading-4 mt-[6px]">Markdown support.</div>
          <div className="flex flex-col gap-2 mt-2 border-b border-black pb-5">
            <div className="flex bg-[#202020] w-full rounded-2xl p-2 gap-4">
              <div
                onClick={() => handleTabChange("edit")}
                className={clsx(
                  "h-10 md:h-14 cursor-pointer text-lg leading-5 w-full rounded-xl flex items-center justify-center",
                  {
                    "bg-[#FFCD4D]": activeTab == "edit",
                    "bg-[#787876] text-[#E5E4E4]": activeTab == "preview",
                  }
                )}
              >
                <span>Edit</span>
              </div>
              <div
                onClick={() => handleTabChange("preview")}
                className={clsx(
                  "h-10 md:h-14 cursor-pointer w-full text-lg leading-5 rounded-xl flex items-center justify-center",
                  {
                    "bg-[#FFCD4D]": activeTab == "preview",
                    "bg-[#787876] text-[#E5E4E4]": activeTab == "edit",
                  }
                )}
              >
                <span>Preview</span>
              </div>
            </div>

            <Controller
              name="lbpDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  classNames={{
                    inputWrapper:
                      "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white border border-black group-data-[invalid=true]:border-[#D53F3F] shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)]",
                    input:
                      "text-[#202020] group-data-[has-value=true]:text-[#202020]/80 !text-sm",
                  }}
                  minRows={5}
                  description={field.value?.length + "/1000"}
                  placeholder="Enter Description"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  isInvalid={!!errors?.lbpDescription}
                  errorMessage={errors?.lbpDescription?.message?.toString()}
                  disabled={activeTab === "preview"}
                />
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg md:text-xl mb-3">Links</h3>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="xlink" className="text-sm md:text-base mb-2">
                X Link
              </label>
              <Controller
                name="xlink"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="xlink"
                    {...field}
                    placeholder="Paste URL here"
                    isInvalid={!!errors?.X}
                    errorMessage={errors?.X?.message?.toString()}
                  // endContent={
                  //   <Button isIconOnly aria-label="copy" className='!size-[32px] !min-w-[32px] bg-white border border-black shadow-button rounded' >
                  //     <CopyIcon className='text-black size-4' />
                  //   </Button>
                  // }
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="website" className="text-sm md:text-base mb-2">
                Website Link
              </label>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="website"
                    {...field}
                    placeholder="Paste URL here"
                    isInvalid={!!errors?.website}
                    errorMessage={errors?.website?.message?.toString()}
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="telegram" className="text-sm md:text-base mb-2">
                Telegram Link
              </label>
              <Controller
                name="telegram"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    placeholder="Paste URL here"
                    isInvalid={!!errors?.telegram}
                    errorMessage={errors?.telegram?.message?.toString()}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="pb-5 border-b border-black">
          <div className="flex items-center gap-[17px]">
            <h4 className="text-base">Geo-blocked Countries</h4>
            <GeoBlockedCountriesModal />
          </div>
          <div className="px-4 py-6 border border-black rounded-2xl bg-white mt-3 shadow-field">
            <div className="max-h-40 overflow-auto flex flex-wrap gap-2">
              {getValues("blockedCountry") ? (
                COUNTRY_LIST.filter((item) =>
                  getValues("blockedCountry")?.includes(item.code)
                ).map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center bg-white border border-black shadow-button px-[14px] py-[10px] rounded-lg relative"
                  >
                    <span>{country.name}</span>
                    <button
                      onClick={() => handleRemoveCountry(country.code)}
                      className="absolute top-0 right-0"
                    >
                      <CloseIcon className="size-4 bg-white/20 rounded-full p-0.5 hover:opacity-60" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-base text-[#202020]/80">
                  No country selected
                </p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center max-md:justify-between md:gap-[18px]">
            <h4 className="text-sm md:text-base">Previous Investment Round</h4>
            <button
              type="button"
              className="text-[10px] md:text-sm relative bg-white border-[0.6px] border-black rounded-lg px-[10px] py-2 shadow-button"
              onClick={() => investmentRoundAppend({})}
            >
              + Add Round
            </button>
          </div>
          <div className="mt-3">
            {investmentRoundFields.map((round, idx) => (
              <div key={round.id} className="">
                <div className="flex items-center justify-between">
                  <span className="text-xl leading-5">Round {idx + 1}</span>
                  <button
                    onClick={() => investmentRoundRemove(idx)}
                    className="border border-black shadow-button p-[6px] max-w-6 max-h-6 rounded"
                  >
                    <CloseIcon className="size-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
                  <Controller
                    name={`investmentRound.${idx}.raiseAmount`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        label="Raised Amount"
                        placeholder="0"
                        value={field.value}
                        onValueChange={(values) =>
                          field.onChange(Number(values.floatValue))
                        }
                        isInvalid={
                          !!(errors as any)?.investmentRound?.[idx]?.raiseAmount
                        }
                        errorMessage={
                          (errors as any)?.investmentRound?.[idx]?.raiseAmount
                            ?.message
                        }
                        className="max-md:col-span-2"
                      />
                    )}

                  />

                  <Controller
                    name={`investmentRound.${idx}.valuationOfRound`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        label="Valuation Of Round"
                        placeholder="0"
                        value={field.value}
                        onValueChange={(values) =>
                          field.onChange(Number(values.floatValue))
                        }
                        isInvalid={
                          !!(errors as any)?.investmentRound?.[idx]
                            ?.valuationOfRound
                        }
                        errorMessage={
                          (errors as any)?.investmentRound?.[idx]
                            ?.valuationOfRound?.message
                        }
                        className="max-md:col-span-2"
                      />
                    )}
                  />

                  <Controller
                    name={`investmentRound.${idx}.tgePercentage`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        label="TGE%"
                        placeholder="0"
                        value={field.value}
                        onValueChange={(values) =>
                          field.onChange(Number(values.floatValue))
                        }
                        isInvalid={
                          !!(errors as any)?.investmentRound?.[idx]
                            ?.tgePercentage
                        }
                        errorMessage={
                          (errors as any)?.investmentRound?.[idx]?.tgePercentage
                            ?.message
                        }
                        className="max-md:col-span-2"
                      />
                    )}
                  />

                  <Controller
                    name={`investmentRound.${idx}.supplySoldRound`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        label="% of Supply Sold in Round"
                        placeholder="0"
                        value={field.value}
                        onValueChange={(values) =>
                          field.onChange(Number(values.floatValue))
                        }
                        isInvalid={
                          !!(errors as any)?.investmentRound?.[idx]
                            ?.supplySoldRound
                        }
                        errorMessage={
                          (errors as any)?.investmentRound?.[idx]
                            ?.supplySoldRound?.message
                        }
                        className="max-md:col-span-2"
                      />
                    )}
                  />

                  <Controller
                    name={`investmentRound.${idx}.vestingLengthTime`}
                    control={control}
                    render={({ field }) => (
                      <NumberField
                        label="Vesting Length (Seconds)"
                        placeholder="0"
                        value={field.value}
                        onValueChange={(values) =>
                          field.onChange(Number(values.floatValue))
                        }
                        isInvalid={
                          !!(errors as any)?.investmentRound?.[idx]
                            ?.vestingLengthTime
                        }
                        errorMessage={
                          (errors as any)?.investmentRound?.[idx]
                            ?.vestingLengthTime?.message
                        }
                        className="col-span-2"
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default ProjectInfo;
