import { useRouter } from "next/router";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useMemo, useState, useCallback } from "react";
import launchpad from "@/services/launchpad";
import { NextLayoutPage } from "@/types/nextjs";
import { AsyncState } from "@/services/utils";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { wallet } from "@/services/wallet";
import { Button } from "@/components/button/button-next";
import Image from "next/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpcClient } from "@/lib/trpc";
import { UploadImage } from "@/components/UploadImage/UploadImage";
import { useAccount } from "wagmi";
import { chart } from "@/services/chart";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { WrappedToastify } from "@/lib/wrappedToastify";
import Action from "./components/Action";
import Tabs from "./components/Tabs";
import CountdownTimer from "./components/Countdown";
import ProjectTitle from "./components/ProjectTitle";
import KlineChart from "./components/KlineChart";
import { LaunchDataProgress } from "./components/LaunchDataProgress";
import { cn } from "@/lib/tailwindcss";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { amountFormatted } from "@/lib/format";
import CardContainer from "@/components/CardContianer/v3";
import { ReactTyped } from "react-typed";
import {
  OptionsDropdown,
  optionsPresets,
} from "@/components/OptionsDropdown/OptionsDropdown";
import { LucideFileEdit } from "lucide-react";

export const UpdateProjectModal = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(
        z
          .object({
            projectName: z.string(),
            description: z.string(),
            twitter: z.union([
              z.string().url().startsWith("https://x.com/"),
              z.string().url().startsWith("https://twitter.com/"),
              z.literal(""),
            ]),
            website: z.string().url().startsWith("https://").or(z.literal("")),
            telegram: z.union([
              z.string().startsWith("https://t.me/"),
              z.string().startsWith("@"),
              z.literal(""),
            ]),
          })
          .transform((data) => {
            const mutateTelegram = (telegram: string | undefined | null) => {
              if (telegram && telegram.startsWith("@")) {
                return `https://t.me/${telegram.split("@")[1]}`;
              }

              return telegram;
            };
            return {
              ...data,
              telegram: mutateTelegram(data.telegram),
            };
          })
      ),
    });

    const inputBaseClass =
      "w-full bg-white rounded-[12px] md:rounded-[16px] px-3 md:px-4 py-2 md:py-[18px] text-black outline-none border border-black shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] placeholder:text-black/50 text-sm md:text-base font-medium h-[40px] md:h-[60px]";

    const labelBaseClass = "text-black text-sm md:text-base font-medium";

    const FormBody = observer(({ onClose }: any) => (
      <>
        <ModalHeader className="flex flex-col gap-1 text-black">
          Update {pair.launchedToken?.displayName}
        </ModalHeader>
        <ModalBody>
          <div className="w-full rounded-[24px] md:rounded-[32px] bg-white space-y-5 px-4 md:px-8 py-4 md:py-6 custom-dashed">
            <div className="flex flex-col gap-4">
              <UploadImage
                imagePath={
                  !!pair.logoUrl ? pair.logoUrl : "/images/project_honey.png"
                }
                blobName={pair.address + "_logo"}
                onUpload={async (url) => {
                  console.log(url);
                  await launchpad.updateProjectLogo.call({
                    logo_url: url,
                    pair: pair.address,
                    chain_id: wallet.currentChainId,
                  });
                  pair.logoUrl = url;
                }}
              ></UploadImage>
              <div className="text-black opacity-50 text-center text-sm">
                Click icon to upload new token icon
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>Project Name</label>
              <input
                type="text"
                {...register("projectName", {
                  value: pair.projectName,
                  required: "Project name is required",
                })}
                className={inputBaseClass}
                placeholder="Enter project name"
              />
              {errors.projectName && (
                <span className="text-red-500 text-sm">
                  {errors.projectName.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>Description</label>
              <input
                type="text"
                {...register("description", {
                  value: pair.description,
                  required: "Description is required",
                })}
                className={inputBaseClass}
                placeholder="Enter description"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>
                Twitter <span className="text-black/50">(Optional)</span>
              </label>
              <input
                type="text"
                {...register("twitter", {
                  value: pair.twitter,
                })}
                className={inputBaseClass}
                placeholder="Enter Twitter URL"
              />
              {errors.twitter && (
                <span className="text-red-500 text-sm">
                  {errors.twitter.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>
                Website <span className="text-black/50">(Optional)</span>
              </label>
              <input
                type="text"
                {...register("website", {
                  value: pair.website,
                })}
                className={inputBaseClass}
                placeholder="Enter website URL"
              />
              {errors.website && (
                <span className="text-red-500 text-sm">
                  {errors.website.message as any}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className={labelBaseClass}>
                Telegram <span className="text-black/50">(Optional)</span>
              </label>
              <input
                type="text"
                {...register("telegram", {
                  value: pair.telegram,
                })}
                className={inputBaseClass}
                placeholder="Enter Telegram URL"
              />
              {errors.telegram && (
                <span className="text-red-500 text-sm">
                  {errors.telegram.message as any}
                </span>
              )}
            </div>
            <Button
              isLoading={launchpad.updateProject.loading}
              className="bg-black text-white font-bold border-2 border-black hover:bg-black/90 w-full"
              onPress={async () => {
                handleSubmit(async (data) => {
                  await launchpad.updateProject.call({
                    pair: pair.address,
                    chain_id: wallet.currentChainId,
                    projectName: data.projectName,
                    description: data.description,
                    twitter: data.twitter || "",
                    website: data.website || "",
                    telegram: data.telegram || "",
                  });
                  if (launchpad.updateProject.error) {
                    WrappedToastify.error({
                      message: "Update failed",
                      title: "Update Project Detail",
                    });
                    return;
                  }
                  await pair.getProjectInfo();
                  WrappedToastify.success({
                    message: "Update success",
                    title: "Update Project Detail",
                  });
                  onClose();
                })();
              }}
            >
              Submit
            </Button>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </>
    ));
    return (
      <ModalContent className="bg-[#FFCD4D]">
        {(onClose) => <FormBody onClose={onClose}></FormBody>}
      </ModalContent>
    );
  }
);

const MemeView = observer(({ pairAddress }: { pairAddress: string }) => {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const state = useLocalObservable(() => ({
    pair: new AsyncState(async ({ pairAddress }: { pairAddress: string }) => {
      const pair = MemePairContract.loadContract(pairAddress, {
        address: pairAddress as string,
      });

      await pair.init({ force: true });

      pair.raiseToken?.init(false, {
        loadIndexerTokenData: true,
      });

      pair.launchedToken?.init(false, {
        loadIndexerTokenData: true,
      });

      return pair;
    }),
  }));

  const account = useAccount();

  // remind provider to edit project details
  useEffect(() => {
    if (
      !state.pair.value ||
      !state.pair.value.isInit ||
      !state.pair.value.isProvider
    )
      return;

    if (
      !state.pair.value.logoUrl ||
      !state.pair.value.projectName ||
      !state.pair.value.description ||
      !state.pair.value.twitter ||
      !state.pair.value.website ||
      !state.pair.value.telegram
    ) {
      WrappedToastify.warn({
        message: (
          <div>
            <ul className="list-disc list-inside">
              {!state.pair.value.logoUrl && (
                <li className="text-orange-400">no icon</li>
              )}
              {!state.pair.value.projectName && (
                <li className="text-orange-400">no project name</li>
              )}
              {!state.pair.value.description && (
                <li className="text-orange-400">no description</li>
              )}
              {!state.pair.value.twitter && (
                <li className="text-orange-400">no twitter link</li>
              )}
              {!state.pair.value.website && (
                <li className="text-orange-400">no website link</li>
              )}
              {!state.pair.value.telegram && (
                <li className="text-orange-400">no telegram link</li>
              )}
            </ul>
            <p>
              Click{" "}
              <span
                onClick={() => {
                  onOpen();
                  toast.dismiss();
                }}
                className="text-blue-500 cursor-pointer"
              >
                here
              </span>{" "}
              to update the project
            </p>
          </div>
        ),
        options: {
          autoClose: false,
        },
      });
      return () => toast.dismiss();
    }
  }, [
    pairAddress,
    account.address,
    state.pair.value?.isProvider,
    state.pair.value,
    onOpen,
    router.query.edit,
    router,
  ]);
  useEffect(() => {
    if (!wallet.isInit || !pairAddress) {
      return;
    }

    state.pair.call({
      pairAddress: pairAddress as string,
    });
  }, [wallet.isInit, pairAddress]);

  useEffect(() => {
    if (!state.pair.value?.launchedToken) {
      return;
    }
    chart.setCurrencyCode("USD");
    chart.setTokenNumber(0);
    chart.setChartTarget(state.pair.value.launchedToken);
    chart.setChartLabel(state.pair.value.launchedToken?.displayName + "/USD");
    console.log("chart", chart);
  }, [state.pair.value, state.pair.value?.launchedToken]);

  const pair = useMemo(() => state.pair.value, [state.pair.value]);

  return (
    <div className="w-full px-4 md:px-8 xl:px-0 space-y-4 md:space-y-8">
      <CardContainer
        type="default"
        topBorderOffset={0}
        showBottomBorder={false}
        className="px-4 md:px-8 xl:max-w-[min(1500px,100%)] mx-auto pb-20 relative rounded-3xl overflow-hidden"
      >
        {state.pair.value && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
              body: "bg-[#FFCD4D]",
              header: "bg-[#FFCD4D]",
              footer: "bg-[#FFCD4D]",
              closeButton: "hover:bg-black/5",
              base: "max-h-[70vh] overflow-y-auto",
            }}
          >
            <UpdateProjectModal pair={state.pair.value}></UpdateProjectModal>
          </Modal>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-4 md:gap-x-4 md:gap-y-14 w-full @container">
          <div
            className={cn(
              "relative bg-white col-span-1 lg:col-span-2 px-4 md:px-8 py-3 md:py-5 rounded-3xl grid grid-cols-3 text-[#202020]"
            )}
          >
            {" "}
            <OptionsDropdown
              className="p-0 m-0 absolute right-5 top-2 z-10 text-black"
              options={[
                optionsPresets.copy({
                  copyText: pair?.launchedToken?.address ?? "",
                  displayText: "Copy Token address",
                  copysSuccessText: "Token address copied",
                }),
                optionsPresets.share({
                  shareUrl: `${window.location.origin}/launch-detail/${pair?.launchedToken?.address}`,
                  displayText: "Share this project",
                  shareText: "Checkout this Token: " + pair?.projectName,
                }),
                optionsPresets.importTokenToWallet({
                  token: pair?.launchedToken,
                }),
                optionsPresets.viewOnExplorer({
                  address: pair?.address ?? "",
                }),
                {
                  icon: <LucideFileEdit />,
                  display: "Update Project",
                  onClick: () => {
                    if (!pair) return;

                    if (
                      pair.provider.toLowerCase() !==
                      wallet.account.toLowerCase()
                    ) {
                      toast.warning("You are not the owner of this project");
                      return;
                    }

                    onOpen();
                  },
                },
              ]}
            />
            <div className="flex items-center gap-x-4 md:gap-x-[7.5px] justify-center sm:justify-start col-span-1">
              <div className="size-10 md:size-[77px] bg-[#ECC94E] flex items-center justify-center rounded-full shrink-0">
                <Image
                  alt={state.pair.value?.launchedToken?.name || "honey"}
                  width={77}
                  height={0}
                  className="rounded-full hidden md:inline-block w-10 sm:w-[77px]"
                  src={
                    !!state.pair.value?.logoUrl
                      ? state.pair.value.logoUrl
                      : "/images/empty-logo.png"
                  }
                />
              </div>
              <ProjectTitle
                pair={state.pair.value ?? undefined}
                name={state.pair.value?.launchedToken?.name}
                displayName={state.pair.value?.launchedToken?.displayName}
                telegram={state.pair.value?.telegram}
                twitter={state.pair.value?.twitter}
                website={state.pair.value?.website}
                address={state.pair.value?.launchedToken?.address}
                statusColor={state.pair.value?.ftoStatusDisplay?.color}
                status={state.pair.value?.ftoStatusDisplay?.status}
                isValidated={state.pair.value?.isValidated}
              />
            </div>
            <div className="col-span-1 text-xs flex items-center justify-center">
              {pair?.description && (
                <ReactTyped
                  strings={[pair.description]}
                  typeSpeed={25}
                />
              )}
            </div>
            <div className="flex flex-col items-center gap-3 md:gap-8 col-span-1">
              {state.pair.value?.state !== 0 && (
                <CountdownTimer
                  endTime={state.pair.value?.endTime}
                  endTimeDisplay={state.pair.value?.endTimeDisplay}
                />
              )}
              {state.pair.value?.state !== 0 ? (
                <div className="flex flex-wrap items-center justify-end gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs">
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Total Supply
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {DynamicFormatAmount({
                        amount:
                          (
                            state.pair.value as MemePairContract
                          )?.depositedLaunchedToken?.toFixed(18) ?? "0",
                        decimals: 2,
                        endWith: ` ${state.pair.value?.launchedToken?.symbol || ""}`,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Current Raise
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {DynamicFormatAmount({
                        amount:
                          (
                            state.pair.value as MemePairContract
                          )?.depositedRaisedToken?.toFixed(18) ?? "0",
                        decimals: 2,
                        endWith: ` ${state.pair.value?.raiseToken?.symbol || ""}`,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Participants
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {Number(
                        state.pair.value?.participantsCount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-end gap-x-3 md:gap-x-6 gap-y-2 md:gap-y-3 text-xs w-full md:w-[400px]">
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Total Supply
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {DynamicFormatAmount({
                        amount:
                          (
                            state.pair.value as MemePairContract
                          )?.depositedLaunchedToken?.toFixed(18) ?? "0",
                        decimals: 2,
                        endWith: ` ${state.pair.value?.launchedToken?.symbol || ""}`,
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      24H Change
                    </span>
                    <span
                      className={cn(
                        "text-sm md:text-[15px] font-bold",
                        state.pair.value?.launchedToken?.priceChange24hPercentage?.startsWith(
                          "-"
                        )
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {DynamicFormatAmount({
                        amount:
                          state.pair.value?.launchedToken
                            ?.priceChange24hPercentage ?? "0",
                        decimals: 2,
                        endWith: "%",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      MCap
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {DynamicFormatAmount({
                        amount: Number(state.pair.value?.marketValue) || 0,
                        decimals: 2,
                        beginWith: "$",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Price
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      $
                      {DynamicFormatAmount({
                        amount:
                          state.pair.value?.launchedToken?.derivedUSD ?? "0",
                        decimals: 3,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Volume
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {DynamicFormatAmount({
                        amount: state.pair.value?.launchedToken?.volumeUSD || 0,
                        decimals: 2,
                        beginWith: "$",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      TVL
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {DynamicFormatAmount({
                        amount:
                          state.pair.value?.launchedToken
                            ?.totalValueLockedUSD || 0,
                        decimals: 2,
                        beginWith: "$",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Position Count
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {state.pair.value?.launchedToken?.poolCount || 0}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Buys
                    </span>
                    <span className="text-sm md:text-[15px] font-bold text-green-500">
                      {Number(
                        state.pair.value?.launchedTokenBuyCount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Sells
                    </span>
                    <span className="text-sm md:text-[15px] font-bold text-red-500">
                      {Number(
                        state.pair.value?.launchedTokenSellCount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 md:gap-1.5">
                    <span className="text-[10px] md:text-[11px] text-[#5C5C5C]/60 uppercase">
                      Holders
                    </span>
                    <span className="text-sm md:text-[15px] font-bold">
                      {Number(
                        state.pair.value?.launchedToken?.holderCount || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className={cn(
              "bg-[#FFCD4D] min-h-[500px] md:min-h-[665px] px-4 py-6 rounded-2xl space-y-3 relative overflow-hidden col-span-1"
            )}
          >
            <div className="bg-[url('/images/card-container/honey/top-border.svg')] bg-left-top h-6 absolute top-0 left-0 w-full bg-contain"></div>
            {state.pair.value?.state === 0 && (
              <div className="md:block">
                <KlineChart height={500} />
              </div>
            )}

            {state.pair.value?.state === 1 && (
              <div className="flex flex-col gap-y-3 md:gap-y-5">
                <div className="flex flex-col gap-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-black text-center w-full">
                    This Project has Failed!
                  </h2>
                  <Image
                    className="w-full h-auto"
                    src="/images/bera/deadfaceBear.webp"
                    width={1000}
                    height={0}
                    alt="dead face"
                  />
                </div>
              </div>
            )}

            {state.pair.value?.state === 3 && (
              <LaunchDataProgress pair={state.pair.value} />
            )}
            <div className="bg-[url('/images/card-container/honey/bottom-border.svg')] bg-left-top h-6 absolute -bottom-1 left-0 w-full bg-repeat-x bg-auto"></div>
          </div>

          <div className="bg-transparent rounded-2xl space-y-3 col-span-1">
            {state.pair.value && (
              <Action
                pair={state.pair.value}
                refreshTxsCallback={triggerRefresh}
              />
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-16 w-full">
          <Tabs
            pair={state.pair.value}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </CardContainer>
    </div>
  );
});

const LaunchPage: NextLayoutPage = observer(() => {
  const [pairAddress, setPairAddress] = useState<string | null>(null);
  const router = useRouter();
  const { pair: launchTokenAddress } = router.query;

  useEffect(() => {
    if (!launchTokenAddress || !wallet.isInit) return;

    wallet.contracts.memeFacade
      .getPairByLaunchTokenAddress(launchTokenAddress as `0x${string}`)
      .then((pairAddress) => {
        setPairAddress(pairAddress.toLowerCase());
      });
  }, [launchTokenAddress, wallet.isInit]);

  const [projectInfo, setProjectInfo] = useState<{
    name?: string | null;
    description?: string | null;
    provider?: string;
    project_type?: string | null;
    id?: number;
    twitter?: string | null;
    telegram?: string | null;
    website?: string | null;
    logo_url?: string | null;
    banner_url?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!pairAddress || !wallet.isInit) {
      return;
    }
    console.log("pairAddress", pairAddress);
    trpcClient.projects.getProjectInfo
      .query({
        pair: (pairAddress as string).toLowerCase(),
        chain_id: wallet.currentChainId,
      })
      .then((data) => {
        console.log("data", data);
        setProjectInfo(data);
      });
  }, [pairAddress, wallet.isInit]);

  return (
    <>
      {projectInfo && projectInfo?.project_type === "meme" && (
        <MemeView pairAddress={pairAddress as string} />
      )}
    </>
  );
});

export default LaunchPage;
