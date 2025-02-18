import { kv as vercelKv } from "@vercel/kv";

export const kv = process.env.KV_URL ? vercelKv : new Map();

export const createCache = (namespace: string) => {
  return {
    set: (...args: Parameters<typeof vercelKv.set>) => {
      const [key, ...restArgs] = args;
      return vercelKv.set(`${namespace}-${key}`, ...restArgs);
    },
    get<T> (...args: Parameters<typeof vercelKv.get>) {
      const [key, ...restArgs] = args;
      return vercelKv.get<T>(`${namespace}-${key}`, ...restArgs);
    },
  };
};
