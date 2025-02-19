import { publicProcedure, router } from "../trpc";
import z from "zod";
import { indexer } from "@/services/indexer/indexer";
import { type PairFilter } from "@/services/launchpad";
import {
  GhostPoolPairResponse,
  GhostParticipatedProjectsResponse,
  PageRequest,
  TrendingMEMEs,
  GhostBundleResponse,
  GhostToken,
  LaunchTokenData,
  GhostAlgebraPairResponse,
} from "@/services/indexer/indexerTypes";
import { cacheProvider, getCacheKey } from "@/lib/server/cache";

export const indexerFeedRouter = router({
  getFilteredFtoPairs: publicProcedure
    .input(
      z.object({
        filter: z.object({
          status: z.string().optional(),
          search: z.string().optional(),
          showNotValidatedPairs: z.boolean().optional(),
        }),
        chainId: z.string(),
        provider: z.string().optional(),
        pageRequest: z
          .object({
            direction: z.string(z.enum(["next", "prev"])),
            cursor: z.string().optional(),
          })
          .optional(),
        projectType: z.enum(["fto", "meme"]).optional(),
      })
    )
    .query(async ({ input }) => {
      return cacheProvider.getOrSet(
        getCacheKey("getFilteredFtoPairs", input),
        async () => {
          const res = await indexer.getFilteredFtoPairs(
            input.filter as PairFilter,
            input.chainId,
            input.provider,
            input.pageRequest as PageRequest,
            input.projectType
          );

          return res;
        }
      );
    }),
  getMostSuccessfulFtos: publicProcedure
    .input(
      z.object({
        chainId: z.string(),
        limit: z.number(),
      })
    )
    .query(async ({ input }) => {
      return cacheProvider.getOrSet(
        getCacheKey("getMostSuccessfulFtos", input),
        async () => {
          const res = await indexer.getMostSuccessfulFtos(
            input.chainId,
            input.limit
          );

          return res;
        }
      );
    }),
  getAllFtoTokens: publicProcedure
    .output(
      z.object({
        status: z.literal("success"),
        data: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            symbol: z.string(),
            decimals: z.number(),
          })
        ),
        message: z.string(),
      })
    )
    .query(async (): Promise<any> => {
      return cacheProvider.getOrSet(
        getCacheKey("getAllFtoTokens"),
        async () => {
          const res = await indexer.getAllFtoTokens();

          return res;
        }
      );
    }),
  getAllPairs: publicProcedure.query(
    async (): Promise<ApiResponseType<GhostPoolPairResponse>> => {
      return cacheProvider.getOrSet(getCacheKey("getAllPairs"), async () => {
        const res = await indexer.dataProvider.getAllPairs();
        return res;
      });
    }
  ),
  getFilteredPairs: publicProcedure
    .meta({
      cache: {
        ttl: 60,
      },
    })
    .input(
      z.object({
        filter: z.object({
          searchString: z.string().optional(),
          limit: z.number().optional(),
          sortingTarget: z.string().optional(),
          sortingDirection: z.string().optional(),
        }),
        chainId: z.string(),
        provider: z.string().optional(),
        pageRequest: z
          .object({
            direction: z.enum(["next", "prev"]),
            cursor: z.string().optional(),
          })
          .optional(),
      })
    )
    .query(
      async ({ input }): Promise<ApiResponseType<GhostPoolPairResponse>> => {
        return cacheProvider.getOrSet(
          getCacheKey("getFilteredPairs", input),
          async () => {
            const res = await indexer.getFilteredPairs(
              input.filter,
              input.chainId,
              input.provider,
              input.pageRequest
            );

            return res;
          }
        );
      }
    ),

  getHoldingsPairs: publicProcedure
    .input(
      z.object({
        walletAddress: z.string(),
        chainId: z.string(),
        filter: z
          .object({
            searchString: z.string().optional(),
            limit: z.number(),
          })
          .optional(),
        pageRequest: z
          .object({
            direction: z.string(z.enum(["next", "prev"])),
            cursor: z.string().optional(),
          })
          .optional(),
      })
    )
    .query(async ({ input }) => {
      return cacheProvider.getOrSet(
        getCacheKey("getHoldingsPairs", input),
        async () => {
          const res = await indexer.getHoldingPairs(
            input.walletAddress,
            input.chainId,
            input.filter,
            input.pageRequest as PageRequest
          );

          return res;
        }
      );
    }),
  getValidatedTokenPairs: publicProcedure
    .input(
      z.object({
        chainId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return cacheProvider.getOrSet(
        getCacheKey("getValidatedTokenPairs", input),
        async () => {
          const res = await indexer.getValidatedTokenPairs(input.chainId);
          return res;
        },
        {
          ttl: 60 * 1000,
        }
      );
    }),
  getTrendingMEMEPairs: publicProcedure.query(
    async (): Promise<ApiResponseType<TrendingMEMEs>> => {
      return cacheProvider.getOrSet(
        getCacheKey("getTrendingMEMEPairs"),
        async () => {
          const res = await indexer.getTrendingMEMEPairs();
          return res;
        }
      );
    }
  ),
  getBundle: publicProcedure
    .input(
      z.object({
        chainId: z.string(),
      })
    )
    .query(async ({ input }): Promise<ApiResponseType<GhostBundleResponse>> => {
      return cacheProvider.getOrSet(
        getCacheKey("getBundle", input),
        async () => {
          const res = await indexer.getBundle(input.chainId);
          return res;
        }
      );
    }),
  getParticipatedProjects: publicProcedure
    .input(
      z.object({
        walletAddress: z.string(),
        chainId: z.string(),
        pageRequest: z.object({
          direction: z.string(z.enum(["next", "prev"])),
          cursor: z.string().optional(),
        }),
        type: z.enum(["fto", "meme"]),
        filter: z.object({
          search: z.string().optional(),
          limit: z.number(),
          status: z.enum(["success", "fail", "all", "processing"]).optional(),
        }),
      })
    )
    .query(
      async ({
        input,
      }): Promise<ApiResponseType<GhostParticipatedProjectsResponse>> => {
        return cacheProvider.getOrSet(
          getCacheKey("getParticipatedProjects", input),
          async () => {
            const res = await indexer.getParticipatedProjects(
              input.walletAddress,
              input.chainId,
              input.pageRequest as PageRequest,
              input.type,
              input.filter
            );

            return res;
          }
        );
      }
    ),
  getPairTokenData: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        chainId: z.string(),
      })
    )
    .query(async ({ input }): Promise<ApiResponseType<GhostToken>> => {
      return cacheProvider.getOrSet(
        getCacheKey("getPairTokenData", input),
        async () => {
          const res = await indexer.getPairTokenData(
            input.tokenAddress,
            input.chainId
          );
          return res;
        }
      );
    }),

  getMemeGraphData: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
      })
    )
    .query(async ({ input }): Promise<ApiResponseType<LaunchTokenData[]>> => {
      return cacheProvider.getOrSet(
        getCacheKey("getMemeGraphData", input),
        async () => {
          return await indexer.getMemeGraphData(input.tokenAddress);
        }
      );
    }),
});
