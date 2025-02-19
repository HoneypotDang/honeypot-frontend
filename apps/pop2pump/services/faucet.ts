import { makeAutoObservable } from "mobx";
import { wallet } from "./wallet";
import { NativeFaucetContract } from "./contract/faucet-contract";

class fauset {
  nativeFaucet: NativeFaucetContract | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  init() {
    this.nativeFaucet = new NativeFaucetContract({
      address: wallet.currentChain?.nativeFaucet?.address,
      name: wallet.currentChain?.nativeFaucet?.name,
    });

    this.nativeFaucet.isClaimable();
  }
}

export const faucet = new fauset();
