import { providers } from "ethers";
import { PairFilter } from "../launchpad";
import { GhostIndexer } from "./indexerProviders/ghost";
import {
  GhostAlgebraPairResponse,
  GhostBundleResponse,
  GhostFtoPairResponse,
  GhostFtoTokensResponse,
  GhostHoldingPairsResponse,
  GhostParticipatedProjectsResponse,
  GhostPoolPairResponse,
  GhostToken,
  IndexerProvider,
  LaunchTokenData,
  PageRequest,
  TrendingMEMEs,
} from "./indexerTypes";
import DataLoader from "dataloader";

export default class Indexer<T extends IndexerProvider> {
  dataProvider: T;
  debug: boolean;

  constructor(dataProvider: T, debug: boolean = false) {
    this.dataProvider = dataProvider;
    this.debug = debug;
  }

  callIndexerApi = async <T extends any>(
    query: string,
    options: any
  ): Promise<ApiResponseType<T>> => {
    return await this.dataProvider.callIndexerApi(query, options);
  };

  getFilteredFtoPairs = async (
    filter: PairFilter,
    chainId: string,
    provider?: string,
    pageRequest?: PageRequest,
    projectType?: "fto" | "meme"
  ): Promise<ApiResponseType<GhostFtoPairResponse>> => {
    return await this.dataProvider.getFilteredFtoPairs(
      filter,
      chainId,
      provider,
      pageRequest,
      projectType
    );
  };

  getMostSuccessfulFtos = async (
    chainId: string,
    limit: number
  ): Promise<ApiResponseType<GhostFtoPairResponse>> => {
    return await this.dataProvider.getMostSuccessfulFTOPairs(chainId, limit);
  };

  getAllFtoTokens = async (): Promise<
    ApiResponseType<GhostFtoTokensResponse>
  > => {
    return await this.dataProvider.getAllFtoTokens();
  };

  getFilteredPairs = async (
    filter: Partial<PairFilter>,
    chainId: string,
    provider?: string,
    pageRequest?: PageRequest
  ): Promise<ApiResponseType<GhostPoolPairResponse>> => {
    return await this.dataProvider.getFilteredPairs(
      filter,
      chainId,
      provider,
      pageRequest
    );
  };

  async getPairByTokens({
    token0,
    token1,
  }: {
    token0: string;
    token1: string;
  }) {
    return await this.dataProvider.getPairByTokens({ token0, token1 });
  }

  getHoldingPairs = async (
    walletAddress: string,
    chainId: string,
    filter?: Partial<PairFilter>,
    pageRequest?: PageRequest
  ): Promise<ApiResponseType<GhostHoldingPairsResponse>> => {
    const res = await this.dataProvider.getHoldingPairs(
      walletAddress,
      chainId,
      filter,
      pageRequest
    );

    return res;
  };

  getTrendingMEMEPairs = async (): Promise<ApiResponseType<TrendingMEMEs>> => {
    return await this.dataProvider.getTrendingMEMEPairs();
  };

  getValidatedTokenPairs = async (
    chainId: string
  ): Promise<ApiResponseType<GhostPoolPairResponse>> => {
    return await this.dataProvider.getValidatedTokenPairs(chainId);
  };

  getParticipatedProjects = async (
    walletAddress: string,
    chainId: string,
    pageRequest: PageRequest,
    type: "fto" | "meme",
    filter: Partial<PairFilter>
  ): Promise<ApiResponseType<GhostParticipatedProjectsResponse>> => {
    return await this.dataProvider.getParticipatedProjects(
      walletAddress,
      chainId,
      pageRequest,
      type,
      filter
    );
  };

  getBundle = async (
    chainId: string
  ): Promise<ApiResponseType<GhostBundleResponse>> => {
    return await this.dataProvider.getBundle(chainId);
  };

  getPairTokenData = async (
    tokenAddress: string,
    chainId: string
  ): Promise<ApiResponseType<GhostToken>> => {
    const data = await this.getPairTokensDataLoader.load(tokenAddress);
    return {
      status: "success",
      message: "Success",
      data,
    };
  };

  getPairTokensDataLoader = new DataLoader<string, GhostToken>(
    async (tokenAddresses) => {
      const res = await this.getPairTokensData(tokenAddresses);
      const data = (res as any).data as GhostToken[];
      const dataMap = data.reduce(
        (acc, token) => {
          acc[token.id.toLowerCase()] = token;
          return acc;
        },
        {} as Record<string, GhostToken>
      );
      return tokenAddresses.map((address) => dataMap[address.toLowerCase()]);
    },
    {
      batchScheduleFn: (cb) => {
        setTimeout(cb, 300);
      },
      maxBatchSize: 30,
    }
  );

  getPairTokensData = async (
    tokenAddresses: readonly string[]
  ): Promise<ApiResponseType<GhostToken[]>> => {
    return this.dataProvider.getPairTokensData(tokenAddresses);
  };

  getMemeGraphData = async (
    tokenAddress: string
  ): Promise<ApiResponseType<LaunchTokenData[]>> => {
    return await this.dataProvider.getMemeGraphData(tokenAddress);
  };
}

const ghostIndexer = new GhostIndexer(
  process.env.GHOST_INDEXER_API_KEY ?? "",
  "https://api.ghostlogs.xyz/gg/pub/"
);

export const indexer = new Indexer(ghostIndexer);
