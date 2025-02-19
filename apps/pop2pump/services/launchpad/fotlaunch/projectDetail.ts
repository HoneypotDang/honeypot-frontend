import { makeAutoObservable } from "mobx";
import { PageController } from "@/services/lib/factory";
import { createSiweMessage } from "@/lib/siwe";
import { AsyncState } from "@/services/utils";
import { wallet } from "@/services/wallet";
import { trpcClient } from "@/lib/trpc";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";

class ProjectDetail extends PageController {
  updateProject = new AsyncState(
    async (data: {
      pair: string;
      chain_id: number;
      twitter: string;
      telegram: string;
      website: string;
      description: string;
      projectName: string;
    }) => {
      await createSiweMessage(
        wallet.account,
        "Sign In With Honeypot",
        wallet.walletClient
      );
      await trpcClient.projects.createOrUpdateProjectInfo.mutate(data);
    }
  );
  project = new AsyncState(async ({ pairAddress }: { pairAddress: string }) => {
    const pair = new FtoPairContract({ address: pairAddress as string });
    await pair.init();
    pair.raiseToken?.init();
    pair.launchedToken?.init();
    return pair;
  });
  init = new AsyncState(async ({ pairAddress }: { pairAddress: string }) => {
    await Promise.all([this.project.call({ pairAddress })]);
  });

  get needUpdateWarning() {
    return (
      this.init.isInit && this.project.value && this.project.value.isProvider
    );
  }

  dispose() {
    this.project.reset();
  }
}
