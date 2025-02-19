import { exec } from "~/lib/contract";
import { BaseContract } from ".";
import { wallet } from "../wallet";
import { Signer, ethers } from "ethers";
import { Contract } from "ethcall";
import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { get } from "http";
import { getContract } from "viem";
import { faucetABI } from "@/lib/abis/faucet";
import { ContractWrite } from "../utils";
import { berachainBartioTestnetNetwork, networksMap } from "../chain";
import { DailyFaucetABI } from "@/lib/abis/faucet/daily-faucet";
import { Token } from "./token";
import { trpcClient } from "@/lib/trpc";
import { toast } from "react-toastify";
import { WrappedToastify } from "@/lib/wrappedToastify";
import { TransactionSuccessToastify } from "@/components/CustomToastify/TransactionPendingToastify/TransactionPendingToastify";

export class NativeFaucetContract implements BaseContract {
  address = "";
  name: string = "";
  canclaim = false;
  cantClaimReason = "";
  nextFaucetTime: number | undefined = undefined;
  abi = DailyFaucetABI;

  constructor(args: Partial<NativeFaucetContract>) {
    Object.assign(this, args);
    makeAutoObservable(this);
  }

  get contract() {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  async isClaimable(): Promise<boolean> {
    //check time

    const queryNativeFaucet = await trpcClient.token.queryNativeFaucet.query({
      address: wallet.account,
    });
    this, (this.canclaim = queryNativeFaucet.claimable);
    this.nextFaucetTime = queryNativeFaucet.claimableUntil ?? undefined;

    return this.canclaim;

    // const timeFaucetable = await this.contract.read.faucetable([
    //   wallet.account as `0x${string}`,
    // ]);

    // if (!timeFaucetable) {
    //   this.canclaim = false;
    //   await this.getNextFaucetTime();
    //   console.log(this.nextFaucetTime);
    //   this.cantClaimReason = "Need to wait 24 hours before next claim";
    //   return false;
    // }

    // const hpotAdress = await this.contract.read.hpot();
    // const minHpotBalance = await this.contract.read.minHpot();

    // const hpotContract = Token.getToken({
    //   address: hpotAdress,
    // });

    // await hpotContract.init();

    // const enoughBalance =
    //   Number(hpotContract.balanceWithoutDecimals.toString()) >=
    //   Number(minHpotBalance.toString());

    // if (!enoughBalance) {
    //   this.canclaim = false;
    //   this.cantClaimReason = `Not enough HPOT balance, need at least ${
    //     Number(minHpotBalance) / Math.pow(10, hpotContract.decimals)
    //   } HPOT`;
    //   return false;
    // }

    // this.canclaim = true;
    // return this.canclaim;
  }

  async getNextFaucetTime(): Promise<number> {
    const res = await this.contract.read?.fauceter([
      wallet.account as `0x${string}`,
    ]);

    this.nextFaucetTime = Number(res.toString());

    return this.nextFaucetTime;
  }

  async Claim(): Promise<boolean> {
    this.canclaim = false;
    const loadingToast = WrappedToastify.pending({
      title: "Claim Faucet",
      message: "Claiming faucet...",
      options: { autoClose: false, isLoading: true },
    });

    const applyNativeFaucet = await trpcClient.token.applyNativeFaucet
      .mutate({
        address: wallet.account,
      })
      .catch((err) => {
        console.dir(err);
        WrappedToastify.error({ message: err.message });
        this.cantClaimReason = err.message;
      });

    toast.dismiss(loadingToast);

    if (applyNativeFaucet) {
      WrappedToastify.success({
        title: "Claim Faucet",
        message: TransactionSuccessToastify({
          hash: applyNativeFaucet.hash,
          action: "Claim Faucet",
        }),
      });
      this.nextFaucetTime = Date.now() + 24 * 60 * 60 * 1000;
      this.isClaimable();
      return true;
    } else {
      return false;
    }
  }

  donateToContract = async (amount: string) => {
    const tx = await wallet.walletClient.sendTransaction({
      account: wallet.account as `0x${string}`,
      to: this.address as `0x${string}`,
      value: ethers.utils.parseEther(amount).toBigInt(),
      chain: null,
    });

    return tx;
  };
}
