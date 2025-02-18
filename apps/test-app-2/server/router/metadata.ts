import { publicProcedure, router } from "../trpc";
import z from "zod";
import { type PairFilter } from "@/services/launchpad";
import { cacheProvider, getCacheKey } from "@/lib/server/cache";
import { pg } from "@/lib/db";

export const metadataRouter = router({
  getServerMetadata: publicProcedure.query(async () => {
    const res = await pg<
      {
        key: "latest_version" | "latest_site";
        value: string;
      }[]
    >`SELECT key, value FROM kv where key='latest_version' or key='latest_site'`;
    return res.reduce(
      (acc, { key, value }) => {
        acc[key as "latest_version" | "latest_site"] = value;
        return acc;
      },
      {} as Record<"latest_version" | "latest_site", string>
    );
  }),
});
