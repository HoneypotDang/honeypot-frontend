import { makeAutoObservable } from "mobx";
import { Token } from "./contract/token";
import { AsyncState } from "./utils";
import { AlgebraPoolContract } from "./contract/algebra/algebra-pool-contract";
import { wallet } from "./wallet";
import { zeroAddress } from "viem";
import { chains } from "@/lib/chain";

class RemoveLiquidityV3 {
  currentRemovePair: AlgebraPoolContract | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setCurrentRemovePair(pair: AlgebraPoolContract) {
    this.currentRemovePair = pair;
  }
}

export const removeLiquidityV3 = new RemoveLiquidityV3();
