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

export class Pot2PumpService {
  DEFAULT_FILTERS: {
    MY_LAUNCHES_FILTER: SubgraphProjectFilter;
    MY_PARTICIPATED_PAIRS_FILTER: SubgraphProjectFilter;
  } = {
    MY_LAUNCHES_FILTER: {
      status: "all",
      search: "",
      currentPage: 0,
      limit: PAGE_LIMIT,
      hasNextPage: true,
      creator: wallet.account,
      orderBy: "endTime",
      orderDirection: "desc",
    },
    MY_PARTICIPATED_PAIRS_FILTER: {
      status: "all",
      search: "",
      currentPage: 0,
      limit: PAGE_LIMIT,
      hasNextPage: true,
      participant: wallet.account,
      orderBy: "endTime",
      orderDirection: "desc",
    },
  } as const;

  myLaunches = new IndexerPaginationState<
    SubgraphProjectFilter,
    MemePairContract
  >({
    namespace: "myLaunches",
    LoadNextPageFunction: async (filter) => {
      return await this.LoadMoreMyLaunchesPage(filter);
    },
    defaultFilter: this.DEFAULT_FILTERS.MY_LAUNCHES_FILTER,
  });

  participatedPairs = new IndexerPaginationState<
    SubgraphProjectFilter,
    MemePairContract
  >({
    namespace: "participatedPairs",
    LoadNextPageFunction: async (filter) => {
      return await this.LoadMoreParticipatedPage(filter);
    },
    defaultFilter: this.DEFAULT_FILTERS.MY_PARTICIPATED_PAIRS_FILTER,
  });

  LoadMoreMyLaunchesPage = async (filter: SubgraphProjectFilter) => {
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

  LoadMoreParticipatedPage = async (filter: SubgraphProjectFilter) => {
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
