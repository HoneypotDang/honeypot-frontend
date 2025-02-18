import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { IndexerPaginationState, PageInfo } from "@/services/utils";
import {
  PAGE_LIMIT,
  PairFilter,
  SubgraphProjectFilter,
  defaultPairFilters,
} from "..";
import {
  fetchPot2PumpList,
  subgraphPageRequest,
} from "@/lib/algebra/graphql/clients/pair";
import { wallet } from "@/services/wallet";

export class Pot2PumpPottingService {
  DEFAULT_FILTER: SubgraphProjectFilter = {
    status: "processing",
    search: "",
    currentPage: 0,
    limit: PAGE_LIMIT,
    hasNextPage: true,
    orderBy: "createdAt",
    orderDirection: "desc",
  };

  projectsPage = new IndexerPaginationState<
    SubgraphProjectFilter,
    MemePairContract
  >({
    namespace: "projectsPage",
    defaultFilter: this.DEFAULT_FILTER,
    LoadNextPageFunction: async (filter) => {
      return await this.LoadMoreProjectPage(filter);
    },
  });

  LoadMoreProjectPage = async (filter: SubgraphProjectFilter) => {
    let res;

    res = await fetchPot2PumpList({
      chainId: String(wallet.currentChainId),
      filter: filter,
    });

    if (res.status === "success") {
      return { items: res.data.pairs, filterUpdates: res.data.filterUpdates };
    } else {
      return {
        items: [],
      };
    }
  };
}
