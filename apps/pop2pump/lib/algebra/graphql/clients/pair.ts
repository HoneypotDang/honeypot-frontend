import { gql } from "@apollo/client";
import { infoClient } from ".";
import { PairFilter, SubgraphProjectFilter } from "@/services/launchpad";
import { PageRequest } from "@/services/indexer/indexerTypes";
import dayjs from "dayjs";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import BigNumber from "bignumber.js";
import { Token } from "@/services/contract/token";
import { Pot2Pump } from "../generated/graphql";
import {
  Pot2PumpPottingNearSuccessDocument,
  Pot2PumpPottingHighPriceDocument,
  Pot2PumpPottingNewTokensDocument,
  Pot2PumpPottingNearSuccessQuery,
  Pot2PumpPottingHighPriceQuery,
  Pot2PumpPottingNewTokensQuery,
  Pot2PumpPottingTrendingQuery,
  Pot2PumpPottingTrendingDocument,
  Pot2PumpPottingTrendingQueryVariables,
} from "../generated/graphql";
import { filter } from "lodash";

type SubgraphToken = {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
  holderCount: string;
  derivedMatic: string;
  totalSupply: string;
};

export type Pot2PumpListData = {
  pot2Pumps: Pot2Pump[];
};

export type Pair = {
  id: string;
  token0Id: string;
  token1Id: string;
  depositedRaisedToken: string;
  depositedLaunchedToken: string;
  createdAt: string;
  endTime: string;
  status: string;
  participantsCount: string;
  token0: SubgraphToken;
  token1: SubgraphToken;
};

type PageInfo = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
};

export type subgraphPageRequest = {
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
};

type PairsListResponse = {
  status: string;
  message: string;
  data: {
    pairs: Pair[];
    pageInfo: PageInfo;
  };
};

type MemetrackerListResponse = {
  status: string;
  message: string;
  data: {
    pairs: Pair[];
  };
};

type Pot2PumpListResponse = {
  status: string;
  message: string;
  data: {
    pairs: MemePairContract[];
    filterUpdates: Partial<SubgraphProjectFilter>;
  };
};

const subgraphTokenQuery = `
  id
  symbol
  name
  decimals
  derivedMatic
  derivedUSD
  initialUSD
  txCount
  holderCount
  totalSupply
  volumeUSD
  totalValueLockedUSD
  marketCap
  poolCount
  priceChange24hPercentage
`;

const pop2PumpQuery = `
  launchToken {
    ${subgraphTokenQuery}
  }
  raisedToken {
    ${subgraphTokenQuery}
  }
  id
  DepositRaisedToken
  DepositLaunchToken
  createdAt
  endTime
  state
  participantsCount
  raisedTokenReachingMinCap
  raisedTokenMinCap
  creator
  buyCount
  sellCount
`;

export const pot2PumpListToMemePairList = (
  pot2Pump: Partial<Pot2Pump>[]
): MemePairContract[] => {
  return pot2Pump.map(pot2PumpToMemePair);
};

export const pot2PumpToMemePair = (
  pot2Pump: Partial<Pot2Pump>
): MemePairContract => {
  const contract = MemePairContract.loadContract(pot2Pump.id!, {
    address: pot2Pump.id,
    depositedLaunchedTokenWithoutDecimals: new BigNumber(
      pot2Pump.DepositLaunchToken
    ),
    depositedRaisedTokenWithoutDecimals: new BigNumber(
      pot2Pump.DepositRaisedToken
    ),
    launchedTokenProvider: pot2Pump.creator,
    provider: pot2Pump.creator,
    raisedTokenMinCap: new BigNumber(pot2Pump.raisedTokenMinCap),
    participantsCount: new BigNumber(pot2Pump.participantsCount),
    launchedTokenBuyCount: new BigNumber(pot2Pump.buyCount),
    launchedTokenSellCount: new BigNumber(pot2Pump.sellCount),
    endTime: pot2Pump.endTime,
    startTime: pot2Pump.createdAt,
    canClaimLP:
      pot2Pump.raisedTokenReachingMinCap &&
      pot2Pump.participants &&
      pot2Pump.participants.length > 0 &&
      !pot2Pump.participants[0].claimed,
    canRefund:
      !pot2Pump.raisedTokenReachingMinCap &&
      pot2Pump.participants &&
      pot2Pump.participants.length > 0 &&
      !pot2Pump.participants[0].refunded &&
      pot2Pump.endTime < dayjs().unix(),
  });

  if (pot2Pump.launchToken?.id) {
    contract.launchedToken = Token.getToken({
      address: pot2Pump.launchToken?.id,
      name: pot2Pump.launchToken?.name,
      symbol: pot2Pump.launchToken?.symbol,
      decimals: Number(pot2Pump.launchToken?.decimals),
      holderCount: pot2Pump.launchToken?.holderCount,
      derivedETH: pot2Pump.launchToken?.derivedMatic,
      totalSupplyWithoutDecimals: BigNumber(pot2Pump.launchToken?.totalSupply),
      derivedUSD: pot2Pump.launchToken?.derivedUSD,
      volumeUSD: pot2Pump.launchToken?.volumeUSD,
      initialUSD: pot2Pump.launchToken?.initialUSD,
      totalValueLockedUSD: pot2Pump.launchToken?.totalValueLockedUSD,
      poolCount: Number(pot2Pump.launchToken?.poolCount),
      priceChange24hPercentage: pot2Pump.launchToken?.priceChange24hPercentage,
    });
  }
  if (pot2Pump.raisedToken?.id) {
    contract.raiseToken = Token.getToken({
      address: pot2Pump.raisedToken?.id,
      name: pot2Pump.raisedToken?.name,
      symbol: pot2Pump.raisedToken?.symbol,
      decimals: Number(pot2Pump.raisedToken?.decimals),
      holderCount: pot2Pump.raisedToken?.holderCount,
      derivedETH: pot2Pump.raisedToken?.derivedMatic,
      totalSupplyWithoutDecimals: BigNumber(pot2Pump.raisedToken?.totalSupply),
      derivedUSD: pot2Pump.raisedToken?.derivedUSD,
      volumeUSD: pot2Pump.raisedToken?.volumeUSD,
      initialUSD: pot2Pump.raisedToken?.initialUSD,
      totalValueLockedUSD: pot2Pump.raisedToken?.totalValueLockedUSD,
      poolCount: Number(pot2Pump.raisedToken?.poolCount),
      priceChange24hPercentage: pot2Pump.raisedToken?.priceChange24hPercentage,
    });
  }

  //console.log("pot2Pump:", pot2Pump);

  if (!contract.logoUrl) {
    contract.getProjectInfo();
  }
  // contract.launchedToken?.loadLogoURI();
  // contract.raiseToken?.loadLogoURI();

  return contract;
};

export async function fetchNearSuccessPot2Pump () {
  const { data } = await infoClient.query<Pot2PumpPottingNearSuccessQuery>({
    query: Pot2PumpPottingNearSuccessDocument,
    variables: {
      endTime: Math.floor(new Date().getTime() / 1000),
    },
  });

  console.log(
    "Pot2PumpPottingNearSuccessDocument",
    Pot2PumpPottingNearSuccessDocument
  );

  return pot2PumpListToMemePairList(data.pot2Pumps as Partial<Pot2Pump>[]);
}

export async function fetchPottingNewTokens () {
  const { data } = await infoClient.query<Pot2PumpPottingNewTokensQuery>({
    query: Pot2PumpPottingNewTokensDocument,
    variables: {
      endTime: Math.floor(new Date().getTime() / 1000),
    },
  });

  return pot2PumpListToMemePairList(data.pot2Pumps as Partial<Pot2Pump>[]);
}

export async function fetchPumpingHighPricePot2Pump () {
  const { data } = await infoClient.query<Pot2PumpPottingHighPriceQuery>({
    query: Pot2PumpPottingHighPriceDocument,
  });

  return pot2PumpListToMemePairList(data.pot2Pumps as Partial<Pot2Pump>[]);
}

export async function fetchPottingTrendingPot2Pump () {
  const { data } = await infoClient.query<Pot2PumpPottingTrendingQuery>({
    query: Pot2PumpPottingTrendingDocument,
  });

  return pot2PumpListToMemePairList(data.pot2Pumps as Partial<Pot2Pump>[]);
}

export async function fetchPairsList ({
  filter,
  pageRequest,
}: {
  filter: PairFilter;
  pageRequest?: PageRequest;
}): Promise<PairsListResponse> {
  let whereCondition = "";
  let conditions = [];

  if (filter.search) {
    conditions.push(`
      launchToken_: {
        or: [
          {name_contains_nocase: "${filter.search}"}, 
          {symbol_contains_nocase: "${filter.search}"}, 
          {id: "${filter.search.toLowerCase()}"}
        ]
      }
    `);
  }

  if (filter.status === "success") {
    conditions.push(`raisedTokenReachingMinCap: true`);
  } else if (filter.status === "fail") {
    conditions.push(
      `raisedTokenReachingMinCap: false, endTime_lte: ${dayjs().unix()}`
    );
  } else if (filter.status === "processing") {
    conditions.push(
      `raisedTokenReachingMinCap: false, endTime_gt: ${dayjs().unix()}`
    );
  }

  // Add TVL range conditions
  if (filter.tvlRange?.min !== undefined) {
    conditions.push(`LaunchTokenTVL_gte: "${filter.tvlRange.min}"`);
  }
  if (filter.tvlRange?.max !== undefined) {
    conditions.push(`LaunchTokenTVL_lte: "${filter.tvlRange.max}"`);
  }

  // Add participants range conditions
  if (filter.participantsRange?.min !== undefined) {
    conditions.push(`participantsCount_gte: "${filter.participantsRange.min}"`);
  }
  if (filter.participantsRange?.max !== undefined) {
    conditions.push(`participantsCount_lte: "${filter.participantsRange.max}"`);
  }

  if (conditions.length > 0) {
    whereCondition = `{ ${conditions.join(", ")} }`;
  }

  const queryParts = [
    filter.limit ? `first: ${filter.limit}` : "",
    pageRequest?.pageNum && filter.limit
      ? `skip: ${(pageRequest?.pageNum - 1) * filter.limit}`
      : "",
    pageRequest?.orderBy ? `orderBy: ${pageRequest?.orderBy}` : "",
    pageRequest?.orderDirection
      ? `orderDirection: ${pageRequest.orderDirection}`
      : "",
    whereCondition ? `where: ${whereCondition}` : "",
  ].filter(Boolean);

  const query = `
    query PairsList {
      pot2Pumps(
        ${queryParts.join(", ")}
      ) {
        ${pop2PumpQuery}
      }
    }
  `;

  const { data } = await infoClient.query<Pot2PumpListData>({
    query: gql(query),
  });

  function transformPairsListData (data: Pot2PumpListData): PairsListResponse {
    const pairs = data.pot2Pumps.map((pot2Pump) => ({
      id: pot2Pump.id,
      token0Id: pot2Pump.launchToken.id,
      token1Id: pot2Pump.raisedToken.id,
      depositedRaisedToken: pot2Pump.DepositRaisedToken,
      depositedLaunchedToken: pot2Pump.DepositLaunchToken,
      createdAt: pot2Pump.createdAt,
      endTime: pot2Pump.endTime,
      status: pot2Pump.state,
      participantsCount: pot2Pump.participantsCount,
      token0: {
        id: pot2Pump.raisedToken.id,
        name: pot2Pump.raisedToken.name,
        symbol: pot2Pump.raisedToken.symbol,
        decimals: pot2Pump.raisedToken.decimals,
        holderCount: pot2Pump.raisedToken.holderCount,
        derivedMatic: pot2Pump.raisedToken.derivedMatic,
        totalSupply: pot2Pump.raisedToken.totalSupply,
      },
      token1: {
        id: pot2Pump.launchToken.id,
        name: pot2Pump.launchToken.name,
        symbol: pot2Pump.launchToken.symbol,
        decimals: pot2Pump.launchToken.decimals,
        holderCount: pot2Pump.launchToken.holderCount,
        derivedMatic: pot2Pump.launchToken.derivedMatic,
        totalSupply: pot2Pump.launchToken.totalSupply,
      },
    }));

    const pageInfo: PageInfo = {
      hasPreviousPage: false,
      hasNextPage: pairs.length === filter.limit,
      startCursor: "",
      endCursor: "",
    };

    return {
      status: "success",
      message: "Success",
      data: {
        pairs,
        pageInfo,
      },
    };
  }

  return transformPairsListData(data);
}

export async function fetchMemetrackerList ({
  chainId,
}: {
  chainId: string;
}): Promise<MemetrackerListResponse> {
  const query = `
    query MemetrackerList {
      pot2Pumps(
        first: 25
        where: {raisedTokenReachingMinCap: true}
        orderBy: launchToken__derivedMatic
        orderDirection: desc
      ) {
        ${pop2PumpQuery}
      }
    }
  `;

  const { data } = await infoClient.query<Pot2PumpListData>({
    query: gql(query),
  });

  function transformPairsListData (
    data: Pot2PumpListData
  ): MemetrackerListResponse {
    const pairs = data.pot2Pumps.map((pot2Pump) => ({
      id: pot2Pump.id,
      token0Id: pot2Pump.launchToken.id,
      token1Id: pot2Pump.raisedToken.id,
      depositedRaisedToken: pot2Pump.DepositRaisedToken,
      depositedLaunchedToken: pot2Pump.DepositLaunchToken,
      createdAt: pot2Pump.createdAt,
      endTime: pot2Pump.endTime,
      status: pot2Pump.state,
      participantsCount: pot2Pump.participantsCount,
      token0: {
        id: pot2Pump.launchToken.id,
        name: pot2Pump.launchToken.name,
        symbol: pot2Pump.launchToken.symbol,
        decimals: pot2Pump.launchToken.decimals,
        holderCount: pot2Pump.launchToken.holderCount,
        derivedMatic: pot2Pump.launchToken.derivedMatic,
        totalSupply: pot2Pump.launchToken.totalSupply,
      },
      token1: {
        id: pot2Pump.raisedToken.id,
        name: pot2Pump.raisedToken.name,
        symbol: pot2Pump.raisedToken.symbol,
        decimals: pot2Pump.raisedToken.decimals,
        holderCount: pot2Pump.raisedToken.holderCount,
        derivedMatic: pot2Pump.raisedToken.derivedMatic,
        totalSupply: pot2Pump.raisedToken.totalSupply,
      },
    }));

    return {
      status: "success",
      message: "Success",
      data: {
        pairs,
      },
    };
  }

  return transformPairsListData(data);
}

export async function fetchPot2PumpList ({
  filter,
}: {
  chainId: string;
  filter: SubgraphProjectFilter;
}): Promise<Pot2PumpListResponse> {
  let whereCondition: string[] = [];



  if (filter.status === "success") {
    whereCondition.push(` raisedTokenReachingMinCap: true `);
  } else if (filter.status === "fail") {
    whereCondition.push(
      ` raisedTokenReachingMinCap: false, endTime_lt: ${Math.floor(Date.now() / 1000)} `
    );
  } else if (filter.status === "processing") {
    whereCondition.push(
      ` raisedTokenReachingMinCap: false, endTime_gte: ${Math.floor(Date.now() / 1000)} `
    );
  }

  if (filter.tvl?.min !== undefined) {
    filter.tvl.min.length > 0 && whereCondition.push(` LaunchTokenTVLUSD_gte: "${filter.tvl.min}" `);
  }
  if (filter.tvl?.max !== undefined) {
    filter.tvl.max.length > 0 && whereCondition.push(` LaunchTokenTVLUSD_lte: "${filter.tvl.max}" `);
  }

  if (filter.participants?.min !== undefined) {
    whereCondition.push(
      ` participantsCount_gte: "${filter.participants.min}" `
    );
  }
  if (filter.participants?.max !== undefined) {
    whereCondition.push(
      ` participantsCount_lte: "${filter.participants.max}" `
    );
  }

  if (filter?.marketcap?.min !== undefined) {
    whereCondition.push(
      ` LaunchTokenMCAPUSD_gte: "${filter?.marketcap?.min}" `
    );
  }
  if (filter?.marketcap?.max !== undefined) {
    ` LaunchTokenMCAPUSD_lte: "${filter?.marketcap?.min}" `

  }

  if (filter?.daybuys?.min !== undefined) {
    whereCondition.push(
      ` buyCount_gte: "${filter?.daybuys?.min}" `
    );
  }
  if (filter?.daybuys?.max !== undefined) {
    whereCondition.push(
      ` buyCount_lte: "${filter?.daybuys?.max}" `
    );
  }

  if (filter?.daysells?.min !== undefined) {
    whereCondition.push(
      ` sellCount_gte: "${filter?.daysells?.min}" `
    );
  }

  if (filter?.daysells?.max !== undefined) {
    whereCondition.push(
      ` sellCount_lte: "${filter?.daysells?.max}" `
    );
  }

  if (filter?.depositraisedtoken?.min !== undefined) {
    whereCondition.push(
      ` DepositRaisedToken_gte: "${filter?.depositraisedtoken?.min}" `
    );
  }

  if (filter?.depositraisedtoken?.max !== undefined) {
    whereCondition.push(
      ` DepositRaisedToken_lte: "${filter?.depositraisedtoken?.max}" `
    );
  }



  const launchTokenFilter: any = {};

  console.log("filter.search", filter.search)

  if (filter.search) {
    launchTokenFilter.and = [
      {
        or: [
          { name_contains_nocase: filter.search },
          { symbol_contains_nocase: filter.search },
          { id: filter.search.toLowerCase() }
        ]
      }
    ]
  }

  if (filter?.dayvolume?.min !== undefined) {
    if (filter.search) {
      launchTokenFilter.and.push({ volumeUSD_gte: filter?.dayvolume?.min })
    } else {
      launchTokenFilter.volumeUSD_gte = filter?.dayvolume?.min
    }
  }

  if (filter?.dayvolume?.max !== undefined) {
    if (filter.search) {
      launchTokenFilter.and.push({ volumeUSD_lte: filter?.dayvolume?.max })
    } else {
      launchTokenFilter.volumeUSD_lte = filter?.dayvolume?.max
    }
  }

  if (filter?.daytxns?.min !== undefined) {
    if (filter.search) {
      launchTokenFilter.and.push({ txCount_gte: filter?.daytxns?.min })
    } else {
      launchTokenFilter.txCount_gte = filter?.daytxns?.min
    }
  }

  if (filter?.daytxns?.max !== undefined) {
    if (filter.search) {
      launchTokenFilter.and.push({ txCount_lte: filter?.daytxns?.max })
    } else {
      launchTokenFilter.txCount_lte = filter?.daytxns?.max
    }
  }

  if (filter?.daychange?.min !== undefined) {
    if (filter.search) {
      launchTokenFilter.and.push({ priceChange24hPercentage_gte: filter?.daychange?.min })
    } else {
      launchTokenFilter.priceChange24hPercentage_gte = filter?.daychange?.min
    }
  }

  if (filter?.daychange?.max !== undefined) {
    if (filter.search) {
      launchTokenFilter.and.push({ priceChange24hPercentage_lte: filter?.daychange?.max })
    } else {
      launchTokenFilter.priceChange24hPercentage_lte = filter?.daychange?.max
    }
  }

  if (Object.keys(launchTokenFilter).length > 0) {
    const filterString = Object.entries(launchTokenFilter)
      .map(([key, value]) => {
        if (key === "and" && Array.isArray(value)) {
          // Handle the 'and' case specifically
          const andConditions = value
            .map((condition) => {
              if (condition.or && Array.isArray(condition.or)) {
                // Handle the 'or' case inside 'and'
                const orConditions = condition.or
                  .map((orCondition: any) => `{ ${Object.entries(orCondition).map(([k, v]) => `${k}: "${v}"`).join(", ")} }`)
                  .join(", ");
                return `{or: [${orConditions}]}`;
              } else {
                // Handle normal 'and' conditions
                return `{ ${Object.entries(condition).map(([k, v]) => `${k}: "${v}"`).join(", ")} }`;
              }
            })
            .join(", ");
          return `and: [${andConditions}]`;
        } else {
          // For other cases (e.g., txCount_gte)
          return `${key}: "${value}"`;
        }
      })
      .join(", ");

    console.log("filterString", filterString)

    whereCondition.push(`launchToken_: { ${filterString} }`);
  }

  if (filter.creator) {
    whereCondition.push(` creator: "${filter.creator.toLowerCase()}" `);
  }

  if (filter.participant) {
    whereCondition.push(
      ` participants_:{account:"${filter.participant.toLowerCase()}"}`
    );
  }

  const queryParts = [
    filter.limit ? `first: ${filter.limit}` : "",
    filter?.currentPage && filter.limit
      ? `skip: ${filter?.currentPage * filter.limit}`
      : "",
    filter.orderBy ? `orderBy: ${filter.orderBy}` : "",
    filter.orderDirection ? `orderDirection: ${filter.orderDirection}` : "",
    whereCondition.length > 0
      ? `where:{ ${whereCondition
        .map((condition) => `${condition}`)
        .join(",\n")}}`
      : "",
  ].filter(Boolean);

  const queryString = queryParts.join(",\n");

  const query = `
    query PairsList {
      pot2Pumps ${queryString.length > 0 ? `(${queryString})` : ""}{
        ${pop2PumpQuery}
      }
    }
  `;

  console.log("Pumping query", query)

  const { data } = await infoClient.query<Pot2PumpListData>({
    query: gql(query),
  });

  return {
    status: "success",
    message: "Success",
    data: {
      pairs: await pot2PumpListToMemePairList(
        data.pot2Pumps as Partial<Pot2Pump>[]
      ),
      filterUpdates: {
        currentPage: filter?.currentPage ? filter?.currentPage + 1 : 1,
        hasNextPage: data.pot2Pumps.length === filter.limit,
      },
    },
  };
}

export async function fetchPot2Pumps ({
  filter,
}: {
  chainId: string;
  filter: SubgraphProjectFilter;
}): Promise<Pot2PumpListData> {
  const whereCondition: string[] = [];

  if (filter.search) {
    whereCondition.push(`
      launchToken_: {
        or: [
          {name_contains_nocase: "${filter.search}"}, 
          {symbol_contains_nocase: "${filter.search}"}, 
          {id: "${filter.search.toLowerCase()}"}
        ]
      }
    `);
  }

  if (filter.status === "success") {
    whereCondition.push(` raisedTokenReachingMinCap: true `);
  } else if (filter.status === "fail") {
    whereCondition.push(
      ` raisedTokenReachingMinCap: false, endTime_lt: ${Math.floor(Date.now() / 1000)} `
    );
  } else if (filter.status === "processing") {
    whereCondition.push(
      ` raisedTokenReachingMinCap: false, endTime_gte: ${Math.floor(Date.now() / 1000)} `
    );
  }

  console.log("filter", filter);

  if (filter.tvl?.min !== undefined) {
    whereCondition.push(` LaunchTokenTVLUSD_gte: "${filter.tvl.min}" `);
  }
  if (filter.tvl?.max !== undefined) {
    whereCondition.push(` LaunchTokenTVLUSD_lte: "${filter.tvl.max}" `);
  }

  if (filter.participants?.min !== undefined) {
    whereCondition.push(
      ` participantsCount_gte: "${filter.participants.min}" `
    );
  }
  if (filter.participants?.max !== undefined) {
    whereCondition.push(
      ` participantsCount_lte: "${filter.participants.max}" `
    );
  }

  if (filter.creator) {
    whereCondition.push(` creator: "${filter.creator.toLowerCase()}" `);
  }

  if (filter.participant) {
    whereCondition.push(
      ` participants_:{account:"${filter.participant.toLowerCase()}"}`
    );
  }

  const queryParts = [
    filter.limit ? `first: ${filter.limit}` : "",
    filter?.currentPage && filter.limit
      ? `skip: ${filter?.currentPage * filter.limit}`
      : "",
    filter.orderBy ? `orderBy: ${filter.orderBy}` : "",
    filter.orderDirection ? `orderDirection: ${filter.orderDirection}` : "",
    whereCondition.length > 0
      ? `where:{ ${whereCondition
        .map((condition) => `${condition}`)
        .join(",\n")}}`
      : "",
  ].filter(Boolean);

  const query = `
    query PairsList {
      pot2Pumps(
        ${queryParts.join(",\n")}
      ) {
        ...pot2Pump
      }
    }
  `;

  const { data } = await infoClient.query<Pot2PumpListData>({
    query: gql(query),
  });

  return data;
}
