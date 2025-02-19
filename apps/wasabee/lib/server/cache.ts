// import Redis from 'ioredis';
import { metadata } from "@/config/metadata";
import { BentoCache, bentostore } from "bentocache";
import { memoryDriver } from "bentocache/drivers/memory";
import { redisDriver } from "bentocache/drivers/redis";
// import pino from 'pino';
const { REDIS_URL } = process.env;
const isDev = process.env.NODE_ENV === "development";

const bentoGlobal = global as typeof global & {
  bento?: BentoCache<any>;
};

// const logger = pino({
//   level: 'trace',
//   transport: { target: 'pino-pretty' }
// })

export const bento =
  bentoGlobal.bento ||
  new BentoCache({
    default: "multitier",
    stores: {
      multitier: bentostore().useL1Layer(
        memoryDriver({ maxItems: 3000, maxSize: 10_000_000 })
      ),
      // .useL2Layer(
      //   redisDriver({
      //     connection: new Redis(REDIS_URL),
      //   }),
      // ),
    },
    timeouts: {
      soft: "100ms",
      hard: "10s",
    },
    ttl: 5 * 1000,
    earlyExpiration: 0.8,
    gracePeriod: {
      enabled: true,
      duration: "24h",
      fallbackDuration: "1m",
    },
    // logger: isDev ? logger : undefined,
  });

if (!bentoGlobal.bento) {
  bentoGlobal.bento = bento;
}

export const cacheProvider = bento.namespace(
  "honeydex-" + process.env.NODE_ENV + "-" + (metadata.version ?? "V1")
);

export const getCacheKey = (key: string, args?: any) => {
  return `${key}-${JSON.stringify(args)}`;
};
