import _ from "lodash";
import Redis, { ChainableCommander, RedisKey, RedisValue } from "ioredis";
import { getConstant } from "~/common";

export const getRedisService = _.memoize(async () => {
  const redisClient = new Redis({
    host: getConstant("REDIS_HOST"),
    port: getConstant("REDIS_PORT"),
    connectTimeout: 1000,
    keepAlive: 30000,
    retryStrategy: (times: number): number => {
      return Math.min(times * 50, 2000);
    },
    enableAutoPipelining: true,
    maxRetriesPerRequest: 5,
    family: 4,
    lazyConnect: false,
    enableReadyCheck: true,
  });
  return {
    redis: redisClient,
    get: async (key: RedisKey): Promise<string | null> => {
      return redisClient.get(key);
    },
    mget: async (keys: RedisKey[]): Promise<Array<string | null>> => {
      return redisClient.mget(keys);
    },
    set: async (key: RedisKey, value: RedisValue, options?: {
      mode: "EX" | "PX"; duration: number;
    }): Promise<void> => {
      if (options) {
        redisClient.set(key, value, "PX", options.mode === "PX" ? options.duration * 1000 : options.duration);
      } else {
        redisClient.set(key, value);
      }
    },
    mset: async (keyValues: [RedisKey, RedisValue][], options?: {
      mode: "EX" | "PX"; duration: number;
    }): Promise<RedisValue> => {
      if (options) {
        return redisClient.mset(...keyValues.flat(), options.mode, options.mode === "PX" ? options.duration * 1000 : options.duration);
      } else {
        return redisClient.mset(...keyValues.flat());
      }
    },
    del: async (key: RedisKey): Promise<void> => {
      redisClient.del(key);
    },
    mdel: async (keys: RedisKey[]): Promise<void> => {
      redisClient.del(...keys);
    },
    multi: (): ChainableCommander => {
      return redisClient.multi();
    },
    sismember: async (key: RedisKey, value: RedisValue): Promise<boolean> => {
      return Boolean(redisClient.sismember(key, value));
    },
    sadd: async (key: RedisKey, value: RedisValue): Promise<number> => {
      return redisClient.sadd(key, value);
    },
    smembers: async (key: RedisKey): Promise<string[]> => {
      return redisClient.smembers(key);
    },
    scard: async (key: RedisKey): Promise<number> => {
      return redisClient.scard(key);
    },
  };
});

export type RedisService = Awaited<ReturnType<typeof getRedisService>>;
