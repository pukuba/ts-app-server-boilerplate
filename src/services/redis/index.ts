import _ from "lodash";
import Redis, { ChainableCommander, RedisKey, RedisValue } from "ioredis";
import { getConstant } from "~/common";

type ZAddArguments = { member: string; score: number; };

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
        await redisClient.set(key, value, "PX", options.mode === "EX" ? options.duration * 1000 : options.duration);
      } else {
        await redisClient.set(key, value);
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
    zadd: async (key: RedisKey, scores: Array<ZAddArguments> | ZAddArguments): Promise<void> => {
      const multi = redisClient.multi();
      for (const { member, score } of Array.isArray(scores) ? scores : [scores]) {
        multi.zadd(key, score, member);
      }
      await multi.exec();
    },
    zscore: async (key: RedisKey, member: RedisValue): Promise<number | null> => {
      const score = await redisClient.zscore(key, member);
      const scoreNumber = Number(score);
      return Number.isNaN(scoreNumber) || scoreNumber === 0 ? null : scoreNumber;
    },
    zaddWithZremRangeByScore: async (key: RedisKey, scores: Array<ZAddArguments> | ZAddArguments, min: number, max: number): Promise<void> => {
      const multi = redisClient.multi();
      for (const { member, score } of Array.isArray(scores) ? scores : [scores]) {
        multi.zadd(key, score, member);
      }
      multi.zremrangebyscore(key, min, max);
      await multi.exec();
    },
    zrange: async (key: RedisKey, start: number, stop: number): Promise<string[]> => {
      return redisClient.zrange(key, start, stop);
    },
    zrangebyscore: async (key: RedisKey, min: number, max: number): Promise<string[]> => {
      return redisClient.zrangebyscore(key, min, max);
    },
    zremrangebyscore: async (key: RedisKey, min: number, max: number): Promise<number> => {
      return redisClient.zremrangebyscore(key, min, max);
    },
    zrem: async (key: RedisKey, value: RedisValue): Promise<number> => {
      return redisClient.zrem(key, value);
    },
    expire: async (key: RedisKey, seconds: number): Promise<void> => {
      await redisClient.expire(key, seconds);
    },
  };
});

export type RedisService = Awaited<ReturnType<typeof getRedisService>>;
