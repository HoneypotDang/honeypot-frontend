import { makeAutoObservable } from "mobx";
import { Token } from "./contract/token";
import { AsyncState } from "./utils";
import { AlgebraPoolContract } from "./contract/algebra/algebra-pool-contract";
import { wallet } from "./wallet";
import { zeroAddress } from "viem";
import { chains } from "@/lib/chain";

class CreatePositionV3 {
  pool: AlgebraPoolContract | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPool(pool: AlgebraPoolContract) {
    this.pool = pool;
  }
}

export const createPositionV3 = new CreatePositionV3();
