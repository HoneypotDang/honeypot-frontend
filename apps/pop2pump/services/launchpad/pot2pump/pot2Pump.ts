import { wallet } from "@/services/wallet";
import { PAGE_LIMIT, SubgraphProjectFilter } from "..";
import { IndexerPaginationState } from "@/services/utils";
import {
  fetchPot2PumpList,
  fetchPot2Pumps,
} from "@/lib/algebra/graphql/clients/pair";
import { Pot2Pump } from "@/lib/algebra/graphql/clients/type";

export class Pot2PumpPumpingService {
  DEFAULT_FILTER: SubgraphProjectFilter = {
    currentPage: 0,
    status: "success",
    limit: PAGE_LIMIT,
    hasNextPage: true,
    orderBy: "endTime",
    orderDirection: "desc",
  };

  projectsPage = new IndexerPaginationState<SubgraphProjectFilter, Pot2Pump>({
    namespace: "projectsPage",
    defaultFilter: this.DEFAULT_FILTER,
    LoadNextPageFunction: async (filter) =>
      await this.LoadMoreProjectPage(filter),
  });

  LoadMoreProjectPage = async (filter: SubgraphProjectFilter) => {
    const res = await fetchPot2PumpList({
      chainId: String(wallet.currentChainId),
      filter: filter,
    });

    const data = await fetchPot2Pumps({
      chainId: String(wallet.currentChainId),
      filter: filter,
    });

    console.log("query data", data);

    if (res.status === "success") {
      return { items: data.pot2Pumps };
    } else {
      return {
        items: [],
      };
    }
  };
}
