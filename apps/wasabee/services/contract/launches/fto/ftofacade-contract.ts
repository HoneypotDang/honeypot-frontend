import { BaseContract } from "../..";
import { wallet } from "../../../wallet";
import { getContract } from "viem";
import { makeAutoObservable } from "mobx";
import { ftoFacadeABI } from "@/lib/abis/ftoFacade";
import { ContractWrite } from "../../../utils";

export class FtoFacadeContract implements BaseContract {
  address = "";
  name: string = "";
  abi = ftoFacadeABI;

  constructor(args: Partial<FtoFacadeContract>) {
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

  get deposit() {
    return new ContractWrite(this.contract.write?.deposit, {
      action: "Deposit",
      isSuccessEffect: true,
    });
  }

  get claimLP() {
    return new ContractWrite(this.contract.write?.claimLP, {
      action: "Claim Liquidity Pool",
      isSuccessEffect: true,
    });
  }
}
