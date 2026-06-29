import { getRedisConnection } from "./io-redis";

export const redisCache = {
  get: async <T>(key: string): Promise<T | null> => {
    const data = await getRedisConnection().get(key);
    return data ? JSON.parse(data) : null;
  },
  set: async (key: string, value: any, ttlSeconds?: number) => {
    const str = JSON.stringify(value);
    if (ttlSeconds) await getRedisConnection().setex(key, ttlSeconds, str);
    else await getRedisConnection().set(key, str);
  },
  del: (key: string) => getRedisConnection().del(key),
};
