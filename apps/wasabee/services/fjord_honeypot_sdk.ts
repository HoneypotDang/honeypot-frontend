import {
  FjordSdk,
  PoolCreateArgs,
  Pool,
} from "node_modules/@marigoldlabs/fjord-honeypot-sdk/dist/index.js";

const API_URL = "https://fjord-api-dev.fly.dev/api";
const API_KEY = "x0cyKZA90n+ztKyluX2Zb+YSi5FCCp7h7702hlbZ4ps=";

const sdk = new FjordSdk(API_URL, API_KEY);

type TFindManyPools = {
  page: number;
  take: number;
  search: string;
  filters?: { owner?: string; endsAt?: { gt?: string; lt?: string } };
};
type TUpdatePool = { poolAddress: string };
export type TCreatePool = {
  name: string;
  description: string;
  chainId: number;
  address: string;
  owner: string;
  endsAt: Date;
  startsAt: Date;
  swapCount: number;
  swapFee: string;
  swapEnabled: boolean;
  blockNumber: number;
  sellingAllowed: boolean;
  assetTokenAddress: string;
  assetTokenName: string;
  assetTokenSymbol: string;
  shareTokenAddress: string;
  shareTokenName: string;
  shareTokenSymbol: string;
  txHash: string;
  assetTokenDecimals: number;
  assetsInitial: string;
  fundsRaised: number;
  lbpMarketcap: string;
  liquidity: string;
  shareTokenDecimals: number;
  sharesInitial: string;
  sharesReleased: string;
  volume: string;
  weightEnd: string;
  weightStart: string;
  assetsCurrent: string;
  numberParticipants: number;
  sharesCurrent: string;
  bannerUrl: string;
  imageUrl: string;
  vestCliffStart?: Date;
  vestEnd?: Date;
  redemptionDelay?: number;
  learnMoreUrl?: string;
};

export type TCreateSwap = {
  poolId: string;
  txHash: string;
  type: "buy" | "sell" | "swap"; // Assuming the type field is limited to specific values
  tokenIn: string;
  tokenInSym: string;
  tokenOut: string;
  tokenOutSym: string;
  tokenAmountIn: string;
  tokenAmountOut: string;
  walletAddress: string;
  blockHash: string;
  logIndex: number;
  status: "success" | "failed" | "pending"; // Assuming status has specific possible values
  assetPriceProxyRoundId: string;
  assetPriceValue: string;
  sharePriceInAsset: string;
  sharePriceInUsd: string;
  swapFee: string;
  chainIn: number;
  chainOut: number;
  blockNumber: number;
};

class FjordHoneySdk {
  static findManyPools = async ({
    page,
    take,
    search,
    filters,
  }: TFindManyPools) => {
    const skip = page - 1;
    const where: any = {};

    return (await sdk.request.rest.findManyPools({
      skip,
      take,

      where: {
        OR: search
          ? [
              { shareTokenSymbol: { contains: search } },
              { assetTokenSymbol: { contains: search } },
              { name: { contains: search } },
              { shareTokenAddress: { contains: search } },
              { assetTokenAddress: { contains: search } },
            ]
          : undefined,
        owner: !!filters?.owner ? filters.owner : undefined,
        endsAt: filters?.endsAt,
      },
      orderBy: { createdAt: "desc" },
    })) as any as { data: Pool[] };
  };

  static findPool = async (address: string): Promise<Pool | null> => {
    const pool = (await sdk.request.rest.findManyPools({
      where: {
        address: address,
      },
    })) as any as { data: Pool[] };
    return pool.data && pool.data.length > 0 ? pool.data[0] : null;
  };

  static createPool = async (pool: TCreatePool) => {
    const createdPool = await sdk.request.rest.createPool({
      data: {
        name: pool.name,
        description: pool.description,
        chainId: pool.chainId,
        address: pool.address,
        owner: pool.owner,
        startsAt: pool.startsAt,
        endsAt: pool.endsAt,
        swapCount: pool.swapCount,
        swapFee: pool.swapFee,
        swapEnabled: pool.swapEnabled,
        blockNumber: pool.blockNumber,
        sellingAllowed: pool.sellingAllowed,
        assetTokenAddress: pool.assetTokenAddress,
        assetTokenName: pool.assetTokenName,
        assetTokenSymbol: pool.assetTokenSymbol,
        shareTokenAddress: pool.shareTokenAddress,
        shareTokenName: pool.shareTokenName,
        shareTokenSymbol: pool.shareTokenSymbol,
        txHash: pool.txHash,
        assetTokenDecimals: pool.assetTokenDecimals,
        assetsInitial: pool.assetsInitial,
        fundsRaised: pool.fundsRaised,
        lbpMarketcap: pool.lbpMarketcap,
        liquidity: pool.liquidity,
        shareTokenDecimals: pool.shareTokenDecimals,
        sharesInitial: pool.sharesInitial,
        sharesReleased: pool.sharesReleased,
        timestamp: new Date(),
        volume: pool.volume,
        weightEnd: pool.weightEnd,
        weightStart: pool.weightStart,
        assetsCurrent: pool.assetsCurrent,
        numberParticipants: pool.numberParticipants,
        sharesCurrent: pool.sharesCurrent,
        listed: true,
        bannerUrl: pool.bannerUrl,
        imageUrl: pool.imageUrl,
        redemptionDelay: pool.redemptionDelay,
        learnMoreUrl: pool.learnMoreUrl,
        ecosystem: "evm",
        version: 2,
        semver: "2.1.0",
      },
    });
    return createdPool;
  };

  static createSwap = async (data: TCreateSwap) => {
    const swap = await sdk.request.rest.createSwap({
      data: {
        poolId: data.poolId,
        txHash: data.txHash,
        type: data.type,
        tokenIn: data.tokenIn,
        tokenInSym: data.tokenInSym,
        tokenOut: data.tokenOut,
        tokenOutSym: data.tokenOutSym,
        tokenAmountIn: data.tokenAmountIn,
        tokenAmountOut: data.tokenAmountOut,
        walletAddress: data.walletAddress,
        timestamp: new Date(),
        version: 1,
        blockHash: data.blockHash,
        logIndex: data.logIndex,
        status: "success",
        assetPriceProxyRoundId: data.assetPriceProxyRoundId,
        assetPriceTimestamp: new Date(),
        assetPriceValue: data.assetPriceValue,
        sharePriceInAsset: data.sharePriceInAsset,
        sharePriceInUsd: data.sharePriceInUsd,
        swapFee: data.swapFee,
        chainIn: data.chainIn,
        chainOut: data.chainOut,
        source: "fe",
        blockNumber: data.blockNumber,
      },
    });
    return swap;
  };

  static findManySwap = async ({
    poolId,
    page,
  }: {
    poolId: string;
    page: number;
  }) => {
    const take = 10;
    const skip = (page - 1) * take;

    return await sdk.request.rest.findManySwaps({
      where: { poolId },
      take,
      skip,
    });
  };
}

export default FjordHoneySdk;
