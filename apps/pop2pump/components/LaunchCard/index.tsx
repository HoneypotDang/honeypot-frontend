import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/button";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { cn } from "@/lib/tailwindcss";
import ProjectStatusDisplay from "../atoms/TokenStatusDisplay/TokenStatusDisplay";
import Image from "next/image";
import {
  OptionsDropdown,
  optionsPresets,
} from "../OptionsDropdown/OptionsDropdown";
import { motion } from "framer-motion";
import { itemPopUpVariants } from "@/lib/animation";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import ProgressBar from "../atoms/ProgressBar/ProgressBar";
import { AmountFormat } from "../AmountFormat";
import Countdown from "react-countdown";
import CardContianer from "../CardContianer/CardContianer";
import { FaCrown } from "react-icons/fa";
import BigNumber from "bignumber.js";

type launchCardVariants = "list" | "detail" | "trending";

const ComponentContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 odd:last:col-span-2",
        className
      )}
    >
      {children}
    </div>
  );
};

//-------------------------------------Detail Components-------------------------------------//
const TimeLineComponent = observer(
  ({ pair }: { pair: MemePairContract | FtoPairContract }) => {
    const endedDisplay = <span>Ended!</span>;

    return (
      <ComponentContainer>
        <h6 className="text-xs">End Time</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            {
              //pair?.remainTime
            }
            {pair?.endTime && (
              <Countdown
                date={Number(pair?.endTime) * 1000}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed || pair.state !== 3) {
                    return endedDisplay;
                  } else {
                    return (
                      <span>
                        {days ? `${days}d ` : ""}
                        {hours ? `${hours}h ` : ""}
                        {minutes ? `${minutes}m ` : ""}
                        {seconds ? `${seconds}s ` : ""}
                      </span>
                    );
                  }
                }}
              />
            )}
          </span>
        </div>
      </ComponentContainer>
    );
  }
);

const LaunchProgress = observer(({ pair }: { pair: MemePairContract }) => {
  return (
    <>
      {pair.depositedRaisedToken && pair.raisedTokenMinCap && (
        <ComponentContainer>
          <h6 className="text-xs">Progress</h6>
          <div className="flex items-center gap-2 text-sm w-[80%]">
            <ProgressBar
              label={
                (
                  (pair.depositedRaisedToken.toNumber() /
                    (pair.raisedTokenMinCap.toNumber() / Math.pow(10, 18))) *
                  100
                ).toFixed(2) + "%"
              }
              value={
                (pair.depositedRaisedToken.toNumber() /
                  (pair.raisedTokenMinCap.toNumber() / Math.pow(10, 18))) *
                100
              }
            />
          </div>
        </ComponentContainer>
      )}
    </>
  );
});

const TotalLaunched = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <ComponentContainer>
        <h6 className="text-xs">Total launched</h6>
        <div className="flex items-center gap-2 text-sm">
          {/* <TotalRaisedSvg /> */}
          <span className="font-bold">
            {pair?.depositedLaunchedToken
              ? pair?.depositedLaunchedToken?.toFormat(0)
              : "-"}
            &nbsp;
            {pair?.launchedToken?.displayName}
          </span>
        </div>
      </ComponentContainer>
    );
  }
);

const Participants = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <ComponentContainer>
        <h6 className="text-xs">Participants</h6>
        <div className="flex items-center gap-2 text-sm">
          {/* <TotalRaisedSvg /> */}
          <span className="font-bold">
            {pair?.participantsCount ? pair.participantsCount.toFormat(0) : "-"}
          </span>
        </div>
      </ComponentContainer>
    );
  }
);

const TotalRaised = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <ComponentContainer>
        <h6 className="text-xs">Total raised</h6>
        <div className="flex items-center gap-2 text-sm">
          {/* <TotalRaisedSvg /> */}
          <span className="font-bold">
            {pair?.depositedRaisedToken
              ? pair.depositedRaisedToken.toFormat(3)
              : "-"}
            &nbsp;
            {pair?.raiseToken?.displayName}
          </span>
        </div>
      </ComponentContainer>
    );
  }
);

const TokenPrice = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <div className="flex flex-col items-center gap-1  odd:last:col-span-2">
        <h6 className="text-xs">Token Price</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            <AmountFormat amount={pair?.price?.toFixed()}></AmountFormat>{" "}
            {pair?.raiseToken?.displayName}
          </span>
        </div>
      </div>
    );
  }
);

const UserDeposited = observer(({ pair }: { pair: FtoPairContract }) => {
  return (
    <ComponentContainer>
      <h6 className="text-xs">Your Deposit</h6>
      <div className="flex items-center gap-2 text-sm">
        {/* <TotalRaisedSvg /> */}
        <span className="font-bold">
          {pair?.userDepositedRaisedToken
            ? (
                pair.userDepositedRaisedToken.toNumber() /
                Math.pow(10, pair.raiseToken?.decimals ?? 18)
              ).toFixed(3)
            : "-"}
          &nbsp;
          {pair?.raiseToken?.displayName}
        </span>
      </div>
    </ComponentContainer>
  );
});

//-------------------------------------Action Components-------------------------------------//
const ClaimAction = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <>
        {pair.canClaimLP && (
          <div>
            <Button
              className="w-full"
              onClick={() => {
                pair.claimLP.call();
              }}
              style={{
                backgroundColor: "green",
              }}
            >
              Claim LP
            </Button>
          </div>
        )}
      </>
    );
  }
);

const RefundAction = observer(({ pair }: { pair: MemePairContract }) => {
  return (
    <>
      {pair.canRefund && (
        <div>
          <Button
            className="w-full"
            onClick={() => {
              pair.refund.call();
            }}
            style={{
              backgroundColor: "green",
            }}
          >
            Refund
          </Button>
        </div>
      )}
    </>
  );
});

const ToTokenDetailsPage = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <Link href={`/launch-detail/${pair?.launchedToken?.address}`}>
        <Button className="w-full">View Token</Button>
      </Link>
    );
  }
);

const BuyToken = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <>
        {pair.state === 0 && (
          <Link
            href={`/swap?inputCurrency=${pair.raiseToken?.address}&outputCurrency=${pair.launchedToken?.address}`}
          >
            <Button className="w-full">Buy Token</Button>
          </Link>
        )}
      </>
    );
  }
);

const AddLP = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <>
        {pair.state === 0 && (
          <Link
            href={`/pool?inputCurrency=${pair.launchedToken?.address}&outputCurrency=${pair.raiseToken?.address}`}
          >
            <Button className="w-full">Add LP</Button>
          </Link>
        )}
      </>
    );
  }
);

//-------------------------------------Launch Card-------------------------------------//
const MemeProjectDetails = observer(
  ({ pair, type }: { pair: MemePairContract; type: launchCardVariants }) => {
    console.log("pair.ftoState", pair.state);
    return (
      <>
        <TimeLineComponent pair={pair} />
        {pair.state === 3 && (
          <>
            <LaunchProgress pair={pair} />
            <TotalRaised pair={pair} />
            <Participants pair={pair} />
          </>
        )}
      </>
    );
  }
);

const FtoProjectDetails = observer(
  ({ pair, type }: { pair: FtoPairContract; type: launchCardVariants }) => {
    return (
      <>
        <TimeLineComponent pair={pair} />
        <TotalLaunched pair={pair} />
        <TotalRaised pair={pair} />
        {pair.state === 3 && (
          <>
            <UserDeposited pair={pair} />
          </>
        )}
        {pair.state === 0 && (
          <>
            <TokenPrice pair={pair} />
          </>
        )}
      </>
    );
  }
);

const MemeProjectActions = observer(
  ({ pair, type }: { pair: MemePairContract; type: launchCardVariants }) => {
    return (
      <>
        <ClaimAction pair={pair} />
        <RefundAction pair={pair} />
        <ToTokenDetailsPage pair={pair} />
        <BuyToken pair={pair} />
        <AddLP pair={pair} />
      </>
    );
  }
);

const FtoProjectActions = ({
  pair,
  type,
}: {
  pair: FtoPairContract;
  type: launchCardVariants;
}) => {
  return (
    <>
      <ClaimAction pair={pair} />
      <ToTokenDetailsPage pair={pair} />
      <BuyToken pair={pair} />
      <AddLP pair={pair} />
    </>
  );
};

const ProjectDetail = ({
  projectType,
  pair,
  type,
}: {
  projectType: "meme" | "fto";
  pair: FtoPairContract | MemePairContract;
  type: launchCardVariants;
}) => {
  if (projectType === "meme") {
    return (
      <MemeProjectDetails
        pair={pair as MemePairContract}
        type={type}
      ></MemeProjectDetails>
    );
  } else {
    return (
      <FtoProjectDetails
        pair={pair as FtoPairContract}
        type={type}
      ></FtoProjectDetails>
    );
  }
};

const ProjectActions = ({
  projectType,
  pair,
  type,
}: {
  projectType: "meme" | "fto";
  pair: FtoPairContract | MemePairContract;
  type: launchCardVariants;
}) => {
  if (projectType === "meme") {
    return (
      <MemeProjectActions
        pair={pair as MemePairContract}
        type={type}
      ></MemeProjectActions>
    );
  } else {
    return (
      <FtoProjectActions
        pair={pair as FtoPairContract}
        type={type}
      ></FtoProjectActions>
    );
  }
};

//-------------------------------------Launch Card Variants-------------------------------------//
const DetailLaunchCard = observer(
  ({
    pair,
    action,
    projectType,
    type,
  }: {
    pair: FtoPairContract | MemePairContract;
    action: React.ReactNode;
    projectType: "meme" | "fto";
    type: launchCardVariants;
  }) => {
    return (
      <>
        {pair && (
          <>
            {(pair.bannerUrl || pair.logoUrl) && (
              <Image
                className="opacity-[0.5] z-[-1]"
                src={!!pair.bannerUrl ? pair.bannerUrl : pair.logoUrl}
                alt="banner"
                layout="fill"
                objectFit="cover"
              ></Image>
            )}
            <ProjectStatusDisplay pair={pair} />
            <OptionsDropdown
              className="absolute left-[0.5rem] top-[0.5rem] "
              options={[
                optionsPresets.copy({
                  copyText: pair?.launchedToken?.address ?? "",
                  displayText: "Copy Token address",
                  copysSuccessText: "Token address copied",
                }),
                optionsPresets.importTokenToWallet({
                  token: pair?.launchedToken,
                }),
                optionsPresets.share({
                  shareUrl: `${window.location.origin}/launch-detail/${pair?.launchedToken?.address}`,
                  displayText: "Share this project",
                  shareText:
                    projectType === "meme"
                      ? "My Meme FTO eats bonding burves for breakfast. Inflate & innovation with Boneypot. Den moon 🌙: " +
                        pair?.projectName
                      : "Checkout this Token: " + pair?.projectName,
                }),
                optionsPresets.viewOnExplorer({
                  address: pair?.address ?? "",
                }),
              ]}
            />
            <div className="relative w-14 h-14 rounded-lg overflow-hidden">
              <Image
                src={
                  !!pair?.logoUrl ? pair.logoUrl : "/images/project_honey.png"
                }
                alt="honey"
                fill
                className="object-cover w-full h-full aspect-square"
              ></Image>
            </div>
            <h4 className="text-white text-center text-[1rem] font-bold flex items-start  h-[1.5em] overflow-hidden">
              <div className=" relative ">
                {pair?.launchedToken?.name} ({pair?.launchedToken?.symbol})
              </div>{" "}
            </h4>{" "}
            <div
              className={cn(
                "grid items-start gap-6 text-white mt-2 justify-between w-full break-all grid-cols-2"
              )}
            >
              <ProjectDetail
                projectType={projectType}
                pair={pair}
                type={type}
              />
            </div>
            <div className="w-full mt-[16px] flex gap-4 flex-col sm:flex-row justify-center sm:items-end flex-wrap *:basis-1 grow-[1] *:grow-[1]">
              <ProjectActions
                projectType={projectType}
                pair={pair}
                type={type}
              />
              {action}
            </div>
          </>
        )}
      </>
    );
  }
);

const TrendingLaunchCard = observer(
  ({
    pair,
    action,
    projectType,
  }: {
    pair: FtoPairContract | MemePairContract;
    action: React.ReactNode;
    projectType: "meme" | "fto";
  }) => {
    return projectType === "meme" ? (
      <CardContianer addtionalClassName="z-[-1] cursor-pointer">
        {(pair.bannerUrl || pair.logoUrl) && (
          <Image
            className="opacity-[0.5] z-[-1] "
            src={!!pair.bannerUrl ? pair.bannerUrl : pair.logoUrl}
            alt="banner"
            layout="fill"
            objectFit="cover"
          ></Image>
        )}{" "}
        <Link
          href={`/launch-detail/${pair.address}`}
          className="flex w-full flex-col gap-2 justify-center items-center flex-grow-[1] basis-1 "
        >
          <div className="flex w-full flex-col gap-2 justify-center items-center flex-grow-[1] basis-1">
            <div className="w-14 flex items-center justify-center rounded-lg bg-gold-primary aspect-square overflow-hidden">
              <Image
                src={
                  !!pair?.logoUrl ? pair.logoUrl : "/images/project_honey.png"
                }
                alt="honey"
                // fill
                width={100}
                height={100}
                className="object-cover w-full h-full"
              ></Image>
            </div>
            <h4 className="text-white text-center text-[1rem] font-bold flex items-center">
              <div className=" relative">
                {pair?.launchedToken?.name} <br />({pair?.launchedToken?.symbol}
                )
              </div>
            </h4>{" "}
            <motion.div className="flex flex-col items-center gap-1">
              <h6 className="opacity-50 text-xs">Total raised</h6>
              <div className="flex items-center gap-2 text-sm">
                {/* <TotalRaisedSvg /> */}
                <span className="font-bold">
                  {pair?.depositedRaisedToken
                    ? pair.depositedRaisedToken.toFormat(0)
                    : "-"}{" "}
                  /{" "}
                  {(pair as MemePairContract).raisedTokenMinCap &&
                    ((pair as MemePairContract).raisedTokenMinCap
                      ?.div(Math.pow(10, 18))
                      .toFixed(0) ??
                      0)}
                  &nbsp;
                  {pair?.raiseToken?.displayName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {/* <TotalRaisedSvg /> */}
                <span className="font-bold">
                  {(pair as MemePairContract)?.depositedRaisedToken &&
                  (pair as MemePairContract).raisedTokenMinCap
                    ? new BigNumber(
                        (
                          pair as MemePairContract
                        ).depositedRaisedToken?.toNumber() ?? 0
                      )
                        .div(
                          new BigNumber(
                            (
                              pair as MemePairContract
                            ).raisedTokenMinCap?.toNumber() ?? 0
                          ).div(Math.pow(10, 18))
                        )
                        .times(100)
                        .toFixed(2)
                    : "-"}{" "}
                  %
                </span>
              </div>{" "}
              <div className="flex items-center gap-2 text-sm w-full">
                <ProgressBar
                  value={
                    pair?.depositedRaisedToken &&
                    (pair as MemePairContract).raisedTokenMinCap
                      ? (pair.depositedRaisedToken.toNumber() /
                          (((
                            pair as MemePairContract
                          ).raisedTokenMinCap?.toNumber() ?? 0) /
                            Math.pow(10, 18))) *
                        100
                      : 0
                  }
                />
              </div>
            </motion.div>
          </div>
        </Link>
      </CardContianer>
    ) : (
      <CardContianer addtionalClassName="z-[-1] cursor-pointer">
        {(pair.bannerUrl || pair.logoUrl) && (
          <Image
            className="opacity-[0.5] z-[-1] "
            src={!!pair.bannerUrl ? pair.bannerUrl : pair.logoUrl}
            alt="banner"
            layout="fill"
            objectFit="cover"
          ></Image>
        )}
        <Link
          href={`/launch-detail/${pair?.launchedToken?.address}`}
          className="flex w-full flex-col gap-2 justify-center items-center flex-grow-[1] basis-1"
        >
          <div className="flex flex-col gap-2 justify-center items-center flex-grow-[1] basis-1">
            <div className="w-14 flex items-center justify-center rounded-lg bg-gold-primary aspect-square overflow-hidden">
              <Image
                src={
                  !!pair?.logoUrl ? pair.logoUrl : "/images/project_honey.png"
                }
                alt="honey"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              ></Image>
            </div>
            <h4 className="text-white text-center text-[1rem] font-bold flex items-center">
              <div className=" relative">
                {pair?.launchedToken?.name} <br />({pair?.launchedToken?.symbol}
                )
              </div>
            </h4>{" "}
            <motion.div className="flex flex-col items-center gap-1">
              <h6 className="opacity-50 text-xs">Total raised</h6>
              <div className="flex items-center gap-2 text-sm">
                {/* <TotalRaisedSvg /> */}
                <span className="font-bold">
                  {pair?.depositedRaisedToken
                    ? pair.depositedRaisedToken.toFormat(0)
                    : "-"}{" "}
                  &nbsp;
                  {pair?.raiseToken?.displayName}
                </span>
              </div>
            </motion.div>
          </div>
        </Link>
      </CardContianer>
    );
  }
);

export const LaunchCard = observer(
  ({
    pair,
    action,
    type,
    className,
  }: {
    type?: launchCardVariants;
    pair?: FtoPairContract | MemePairContract | null;
    action: React.ReactNode;
  } & Partial<HTMLAttributes<any>>) => {
    const projectType: "meme" | "fto" =
      pair instanceof MemePairContract ? "meme" : "fto";

    return (
      <motion.div
        variants={itemPopUpVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "flex w-full h-full flex-col justify-center items-center gap-2 border bg-[#1D1407] backdrop-blur-[13.5px] px-2.5 py-3 rounded-[20px] border-solid border-[rgba(247,147,26,0.10)] relative overflow-hidden",
          className
        )}
        whileInView="visible"
      >
        {(!type || type === "detail") && pair && (
          <DetailLaunchCard
            pair={pair}
            action={action}
            projectType={projectType}
            type="detail"
          />
        )}

        {type === "list" && pair && <div>To be implemented</div>}

        {type === "trending" && pair && (
          <TrendingLaunchCard
            pair={pair}
            action={action}
            projectType={projectType}
          />
        )}
      </motion.div>
    );
  }
);
