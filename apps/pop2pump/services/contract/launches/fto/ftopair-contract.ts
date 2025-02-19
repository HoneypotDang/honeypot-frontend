import { BaseContract } from "../..";
import { wallet } from "../../../wallet";
import { getContract } from "viem";
import { AsyncState, ContractWrite } from "../../../utils";
import { makeAutoObservable } from "mobx";
import { MUBAI_FTO_PAIR_ABI } from "@/lib/abis/ftoPair";
import BigNumber from "bignumber.js";
import { Token } from "../../token";
import { dayjs } from "@/lib/dayjs";
import { cn } from "@/lib/tailwindcss";
import { trpcClient } from "@/lib/trpc";
import { ZodError } from "zod";
import launchpad, { statusTextToNumber } from "../../../launchpad";
import { BaseLaunchContract } from "@/services/contract/launches/base-launch-contract";
import { formatAmountWithAlphabetSymbol } from "@/lib/algebra/utils/common/formatAmount";

export class FtoPairContract implements BaseLaunchContract {
  databaseId: number | undefined = undefined;
  address = "";
  name: string = "";
  abi = MUBAI_FTO_PAIR_ABI;
  raiseToken: Token | undefined = undefined;
  launchedToken: Token | undefined = undefined;
  depositedRaisedTokenWithoutDecimals: BigNumber | null = null;
  depositedLaunchedTokenWithoutDecimals: BigNumber | null = null;
  launchedTokenBuyCount: BigNumber | null = null;
  launchedTokenSellCount: BigNumber | null = null;
  endTime: string = "";
  startTime: string = "";
  state: number = 3;
  launchedTokenProvider: string = "";
  userDepositedRaisedToken: BigNumber | null = null;
  projectName = "";
  description = "";
  telegram = "";
  twitter = "";
  website = "";
  isValidated = false;
  isInit = false;
  provider = "";
  canClaimLP = false;
  socials: {
    name: string;
    link: string;
    icon: string;
  }[] = [];
  logoUrl = "";
  bannerUrl = "";
  participantsCount = new BigNumber(0);
  beravoteSpaceId = "";

  constructor(args: Partial<FtoPairContract>) {
    Object.assign(this, args);
    this.getIsValidated();
    makeAutoObservable(this);
  }

  get startTimeDisplay() {
    return this.startTime
      ? dayjs(
          new BigNumber(this.startTime).multipliedBy(1000).toNumber()
        ).toISOString()
      : "-";
  }

  get endTimeDisplay() {
    return this.endTime
      ? dayjs(
          new BigNumber(this.endTime).multipliedBy(1000).toNumber()
        ).toISOString()
      : "-";
  }

  get priceChangeDisplay() {
    return this.launchedToken?.derivedUSD &&
      Number(this.launchedToken?.derivedUSD) &&
      this.launchedToken?.initialUSD &&
      Number(this.launchedToken.initialUSD)
      ? `${formatAmountWithAlphabetSymbol((Number(this.launchedToken.derivedUSD) / Number(this.launchedToken.initialUSD)).toFixed(2), 2)}%`
      : "--";
  }

  get depositedRaisedToken() {
    if (!this.raiseToken) {
      console.log("token is not initialized");
      return undefined;
    }

    return this.depositedRaisedTokenWithoutDecimals && this.raiseToken.decimals
      ? this.depositedRaisedTokenWithoutDecimals.div(
          new BigNumber(10).pow(this.raiseToken.decimals)
        )
      : undefined;
  }

  get depositedLaunchedToken() {
    if (!this.launchedToken) {
      console.log("token is not initialized");
      return undefined;
      return;
    }

    return this.depositedLaunchedTokenWithoutDecimals &&
      this.launchedToken.decimals
      ? this.depositedLaunchedTokenWithoutDecimals.div(
          new BigNumber(10).pow(this.launchedToken.decimals)
        )
      : undefined;
  }

  get isProvider() {
    return (
      this.launchedTokenProvider.toLocaleLowerCase() ===
      wallet.account.toLocaleLowerCase()
    );
  }

  get contract() {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  get facadeContract() {
    return wallet.contracts.ftofacade;
  }

  get fotFactoryContract() {
    return wallet.contracts.ftofactory;
  }

  get price() {
    if (this.state === 0) {
      return this.launchedToken?.derivedUSD
        ? new BigNumber(this.launchedToken.derivedUSD)
        : new BigNumber(0);
    } else {
      return this.depositedRaisedToken &&
        this.depositedLaunchedToken &&
        this.raiseToken?.derivedUSD
        ? this.depositedRaisedToken
            .multipliedBy(this.raiseToken.derivedUSD)
            .div(this.depositedLaunchedToken)
        : undefined;
    }
  }

  get marketValue() {
    return this.price && this.depositedLaunchedToken
      ? this.price?.multipliedBy(this.depositedLaunchedToken)
      : 0;
  }

  get isCompleted() {
    return (
      this.endTime && new BigNumber(this.endTime).isLessThan(dayjs().unix())
    );
  }

  get remainTime() {
    const now = dayjs();
    if (!this.endTime) {
      return "-";
    }
    //console.log("this.endTime", this.endTime);
    const targetTime = dayjs(
      new BigNumber(this.endTime).multipliedBy(1000).toNumber()
    );
    if (!targetTime.isValid()) {
      return "Invalid Date";
    }

    const diffDays = targetTime.diff(now, "days");

    if (Math.abs(diffDays) >= 1) {
      return `${Math.abs(diffDays)} ${
        diffDays > 0 ? "days later" : "days ago"
      }`;
    }

    const diffHours = targetTime.diff(now, "hours");

    if (Math.abs(diffHours) >= 1) {
      return `${Math.abs(diffHours)} ${
        diffHours > 0 ? "hours later" : "hours ago"
      }`;
    }

    const diffMinutes = targetTime.diff(now, "minutes");
    if (Math.abs(diffMinutes) >= 1) {
      return `${Math.abs(diffMinutes)} ${
        diffMinutes > 0 ? "minutes later" : "minutes ago"
      }`;
    }

    return "Ends in a minute";
  }

  deposit = new AsyncState(async ({ amount }: { amount: string }) => {
    if (!this.raiseToken || !this.launchedToken) {
      throw new Error("token is not initialized");
    }
    if (this.raiseToken.isNative) {
      // @ts-ignore
      await wallet.currentChain.nativeToken.deposit.callV2({
        value: BigInt(amount),
      });
    }

    amount = new BigNumber(amount)
      .multipliedBy(new BigNumber(10).pow(this.raiseToken.decimals))
      .toFixed();
    await this.raiseToken.approveIfNoAllowance({
      amount,
      spender: this.facadeContract.address,
    });
    console.log(
      this.raiseToken.address as `0x${string}`,
      this.launchedToken.address as `0x${string}`,
      BigInt(amount),
      BigInt(0)
    );
    await this.facadeContract.deposit.call([
      this.raiseToken.address as `0x${string}`,
      this.launchedToken.address as `0x${string}`,
      BigInt(amount),
      BigInt(0),
    ]);
    await Promise.all([
      this.getDepositedRaisedToken(),
      this.raiseToken.getBalance(),
    ]);
  });

  claimLP = new AsyncState(async () => {
    if (!this.raiseToken || !this.launchedToken) {
      throw new Error("token is not initialized");
    }

    await this.facadeContract.claimLP.call([
      this.raiseToken.address as `0x${string}`,
      this.launchedToken.address as `0x${string}`,
    ]);

    this.canClaimLP = false;
  });

  resume = new AsyncState(async () => {
    if (!this.raiseToken || !this.launchedToken) {
      throw new Error("token is not initialized");
    }

    await this.fotFactoryContract.resume.call([
      this.raiseToken.address as `0x${string}`,
      this.launchedToken.address as `0x${string}`,
    ]);

    await this.getFTOState();
  });

  pause = new AsyncState(async () => {
    if (!this.raiseToken || !this.launchedToken) {
      throw new Error("token is not initialized");
    }

    await this.fotFactoryContract.pause.call([
      this.raiseToken.address as `0x${string}`,
      this.launchedToken.address as `0x${string}`,
    ]);

    await this.getFTOState();
  });

  get withdraw() {
    return new ContractWrite(this.contract.write.withdraw, {
      action: "Withdraw",
    });
  }

  get ftoStatusDisplay() {
    switch (this.state) {
      case 0:
        return {
          status: "success",
          color: "bg-success/20 text-success-600",
        };
      case 1:
        return {
          status: "Fail",
          color: "bg-danger/20 text-danger",
        };
      case 2:
        return {
          status: "Paused",
          color: "bg-warning/20 text-warning-600",
        };
      case 3:
        if (this.isCompleted) {
          return {
            status: "Completed",
            color: "bg-[rgba(226,232,240,0.1)] text-default-foreground",
          };
        }
        return {
          status: "Processing",
          color: "text-[#83C2E9] bg-[rgba(131,194,233,0.1)]",
        };
    }
  }

  async getProjectInfo() {
    const res = await trpcClient.projects.getProjectInfo.query({
      chain_id: wallet.currentChainId,
      pair: this.address,
    });
    if (!res) {
      return;
    }
    this.socials = [];
    if (res.id) {
      this.databaseId = res.id;
    }
    if (res.telegram) {
      this.telegram = res.telegram;
      this.socials.push({
        name: "telegram",
        link: res.telegram,
        icon: "/images/telegram.svg",
      });
    }
    if (res.twitter) {
      this.twitter = res.twitter;
      this.socials.push({
        name: "twitter",
        link: res.twitter,
        icon: "/images/twitter.svg",
      });
    }
    if (res.website) {
      this.website = res.website;
      this.socials.push({
        name: "website",
        link: res.website,
        icon: "/images/website.svg",
      });
    }
    if (res.description) {
      this.description = res.description;
    }
    if (res.name) {
      this.projectName = res.name;
    }
    if (res.provider) {
      this.provider = res.provider;
    }
    if (res.logo_url) {
      this.logoUrl = res.logo_url;
      this.launchedToken?.setLogoURI(res.logo_url);
    }
    if (res.banner_url) {
      this.bannerUrl = res.banner_url;
    }
  }

  async init({
    raisedToken,
    launchedToken,
    depositedRaisedToken,
    depositedLaunchedToken,
    startTime,
    endTime,
    ftoState,
  }: {
    raisedToken?: Token;
    launchedToken?: Token;
    depositedRaisedToken?: string;
    depositedLaunchedToken?: string;
    startTime?: string;
    endTime?: string;
    ftoState?: number;
  } = {}) {
    if (this.isInit) {
      return;
    }

    await Promise.all([
      this.getRaisedToken(raisedToken),
      this.getLaunchedToken(launchedToken),
      this.getDepositedRaisedToken(depositedRaisedToken),
      this.getDepositedLaunchedToken(depositedLaunchedToken),
      this.getStartTime(startTime),
      this.getEndTime(endTime),
      this.getFTOState(ftoState),
      this.getLaunchedTokenProvider(),
      this.getProjectInfo(),
      this.getCanClaimLP(),
      this.getUserDepositeAmount(),
    ]).catch((error) => {
      console.error(error, `init-${this.address}`);
      trpcClient.projects.revalidateProjectType.mutate({
        chain_id: wallet.currentChainId,
        pair: this.address,
      });
      return;
    });
    this.isInit = true;
  }

  getIsValidated() {
    this.isValidated = wallet.currentChain?.validatedFtoAddresses.includes(
      this.address.toLowerCase()
    );
  }

  async getCanClaimLP() {
    if (
      !wallet.account ||
      // provider can't claim LP
      wallet.account.toLowerCase() === this.provider.toLowerCase()
    ) {
      return false;
    }

    try {
      const claimed = await this.contract.read.claimedLp([wallet.account] as [
        `0x${string}`,
      ]);

      const claimable = await this.contract.read.claimableLP([
        wallet.account,
      ] as [`0x${string}`]);

      this.canClaimLP = claimable > claimed;
    } catch (error) {
      this.canClaimLP = false;
    }
  }

  async getRaisedToken(token?: Token) {
    if (token) {
      this.raiseToken = token;
      this.raiseToken.init();
    } else {
      const res = (await this.contract.read.raisedToken()) as `0x${string}`;
      this.raiseToken = Token.getToken({ address: res });
      this.raiseToken.init();
    }
  }

  async getLaunchedToken(launchedToken?: Token) {
    if (launchedToken) {
      this.launchedToken = launchedToken;
      this.launchedToken.init();
    } else {
      const res = (await this.contract.read.launchedToken()) as `0x${string}`;
      this.launchedToken = Token.getToken({ address: res });
      this.launchedToken.init();
    }
  }

  async getDepositedRaisedToken(amount?: string) {
    if (amount) {
      this.depositedRaisedTokenWithoutDecimals = new BigNumber(amount);
    } else {
      const res = (await this.contract.read.depositedRaisedToken()) as bigint;
      this.depositedRaisedTokenWithoutDecimals = new BigNumber(res.toString());
    }
  }

  async getDepositedLaunchedToken(amount?: string) {
    if (amount) {
      this.depositedLaunchedTokenWithoutDecimals = new BigNumber(amount);
    } else {
      const res = (await this.contract.read.depositedLaunchedToken()) as bigint;
      this.depositedLaunchedTokenWithoutDecimals = new BigNumber(
        res.toString()
      );
    }
  }

  async getUserDepositeAmount() {
    const res = await this.contract.read.raisedTokenDeposit([
      wallet.account as `0x${string}`,
    ]);

    this.userDepositedRaisedToken = new BigNumber(res.toString());
  }

  async getEndTime(endtime?: string) {
    if (endtime) {
      this.endTime = endtime;
    } else {
      const res = await this.contract.read.endTime();
      this.endTime = res.toString();
    }
  }

  async getStartTime(startTime?: string) {
    if (startTime) {
      this.startTime = startTime;
    } else {
      const res = await this.contract.read.startTime();
      this.startTime = res.toString();
    }
  }

  async getFTOState(state?: number) {
    if (state) {
      this.state = state;
    } else {
      const res = await this.contract.read.FTOState();
      this.state = res;
    }
  }
  async getLaunchedTokenProvider() {
    if (this.provider) {
      this.launchedTokenProvider = this.provider;
      return;
    } else {
      const res = await this.contract.read.launchedTokenProvider();
      this.launchedTokenProvider = res;
      this.provider = res;
    }
  }
}
