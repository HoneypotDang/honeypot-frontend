import { BaseContract } from "./..";
import { wallet } from "@/services/wallet";
import { makeAutoObservable } from "mobx";
import { Address, getContract, zeroAddress } from "viem";
import { ICHIVaultFactoryABI } from "@/lib/abis/aquabera/ICHIVaultFactory";
import { ContractWrite } from "@/services/utils";

export class ICHIVaultFactoryContract implements BaseContract {
  address: Address = zeroAddress;
  name: string = "ICHIVaultFactory";
  abi = ICHIVaultFactoryABI;

  constructor(args: Partial<ICHIVaultFactoryContract>) {
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

  async createICHIVault(
    tokenA: string,
    allowTokenA: boolean,
    tokenB: string,
    allowTokenB: boolean
  ) {
    if (!wallet.walletClient?.account) {
      return;
    }

    // example event
    // ICHIVaultCreated (index_topic_1address sender, address ichiVault, address tokenA, bool allowTokenA, address tokenB, bool allowTokenB, uint256 count)
    // [topic 0]:0xc40564e4b61a849e6f9fd666c2109aa6ceffc5a019f87d4d3e0eaaf807b0783e
    // [topic 1]:0xa2541af7b9657bcac4205557f1699e18976f3f0c
    // 0x0000000000000000000000002b98b7ca8ddbaf056a70a9be9777fb0092ff278e0000000000000000000000005b0c7cccc718ee837238be9323ccb63aee538ff40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fc5e3743e9fac8bb60408797607352e24db7d65e00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000008

    return new ContractWrite(this.contract.write.createICHIVault, {
      action: "Create ICHIVault",
    }).call([
      tokenA as `0x${string}`,
      allowTokenA,
      tokenB as `0x${string}`,
      allowTokenB,
    ]);
  }
}
