import { Token } from "@/services/contract/token";
import { getContract, zeroAddress } from "viem";
import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { AsyncState, ContractWrite } from "@/services/utils";
import { wallet } from "@/services/wallet";
import { BaseLaunchContract } from "../base-launch-contract";
import { LiquidityBootstrapPoolABI } from "@/lib/abis/LiquidityBootstrapPoolAbi";

export class LBPPairContract implements BaseLaunchContract {
  databaseId: number | undefined = undefined;
  address = "";
  name: string = "";
  abi = LiquidityBootstrapPoolABI;
  raiseToken: Token | undefined = undefined;
  launchedToken: Token | undefined = undefined;
  depositedRaisedTokenWithoutDecimals: BigNumber | null = null;
  depositedLaunchedTokenWithoutDecimals: BigNumber | null = null;
  launchedTokenBuyCount: BigNumber | null = null;
  launchedTokenSellCount: BigNumber | null = null;
  endTime: string = "";
  startTime: string = "";
  launchedTokenProvider: string = "";
  projectName = "";
  description = "";
  telegram = "";
  twitter = "";
  website = "";
  isValidated = false;
  isInit = false;
  provider = "";
  canClaimLP = false;
  canRefund = false;
  isRefundable = false;
  raisedTokenMinCap: BigNumber | undefined = undefined;
  userParticipated = false;
  socials: {
    name: string;
    link: string;
    icon: string;
  }[] = [];
  logoUrl = "";
  bannerUrl = "";
  participantsCount = new BigNumber(0);
  beravoteSpaceId = "";
  vaultBalance = BigInt(0);
  state: number = 0;

  constructor(args: Partial<LBPPairContract>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  async init() {
    this.isInit = true;
  }
}
