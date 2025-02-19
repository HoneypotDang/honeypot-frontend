import { BaseContract } from "@/services/contract";
import { Token } from "@/services/contract/token";
import BigNumber from "bignumber.js";
import { MemePairContract } from "./pot2pump/memepair-contract";
import { LBPPairContract } from "./lbp/lbppair-contract";
import { FtoPairContract } from "./fto/ftopair-contract";

export type LaunchContract =
  | MemePairContract
  | LBPPairContract
  | FtoPairContract;

export type LaunchContractType = "meme" | "lbp" | "fto";

export function getLaunchContractType(
  contract: LaunchContract
): LaunchContractType {
  if (contract instanceof MemePairContract) {
    return "meme";
  }
  if (contract instanceof LBPPairContract) {
    return "lbp";
  }
  if (contract instanceof FtoPairContract) {
    return "fto";
  }
  throw new Error("Invalid contract type");
}

export interface BaseLaunchContract extends BaseContract {
  databaseId: number | undefined;
  address: string;
  name: string;
  abi: readonly any[];
  raiseToken: Token | undefined;
  launchedToken: Token | undefined;
  depositedRaisedTokenWithoutDecimals: BigNumber | null;
  depositedLaunchedTokenWithoutDecimals: BigNumber | null;
  endTime: string;
  startTime: string;
  state: number;
  launchedTokenProvider: string;
  projectName: string;
  description: string;
  telegram: string;
  twitter: string;
  website: string;
  isValidated: boolean;
  isInit: boolean;
  provider: string;
  canClaimLP: boolean;
  socials: {
    name: string;
    link: string;
    icon: string;
  }[];
  logoUrl: string;
  bannerUrl: string;
}
