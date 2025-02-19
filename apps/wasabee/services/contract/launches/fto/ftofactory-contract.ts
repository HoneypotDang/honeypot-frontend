import { BaseContract } from "../..";
import { wallet } from "../../../wallet";
import { Address, getContract } from "viem";
import { makeAutoObservable } from "mobx";
import { ContractWrite, AsyncState } from "../../../utils";
import { ftoFactoryABI } from "@/lib/abis/ftoFactory";
import { FtoPairContract } from "./ftopair-contract";

export class FtoFactoryContract implements BaseContract {
  address = "";
  name: string = "";
  abi = ftoFactoryABI;
  constructor(args: Partial<FtoFactoryContract>) {
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

  async events(depositerAddress: Address): Promise<readonly Address[]> {
    const res = await this.contract.read.events([depositerAddress]);
    return res;
  }

  get createFTO() {
    return new ContractWrite(this.contract.write.createFTO, {
      action: "Create FTO Project",
      isSuccessEffect: true,
    });
  }

  get allPairsLength(): AsyncState {
    return new AsyncState(this.contract.read.allPairsLength);
  }

  get allPairs() {
    return new AsyncState(this.contract.read.allPairs);
  }

  get resume() {
    return new ContractWrite(this.contract.write.resume, {
      action: "Resume",
    });
  }
  get pause() {
    return new ContractWrite(this.contract.write.pause, {
      action: "Pause",
    });
  }
}
