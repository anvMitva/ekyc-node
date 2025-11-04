import type { RedisClientType } from "redis";

import logger from "../logger/winston.logger.js";

type RedisClient = RedisClientType<Record<string, never>, Record<string, never>, Record<string, never>>;

export class CacheService {
  static generateKey(prefix: string, identifier: string): string {
    return `${prefix}:${identifier}`;
  }

  static async get<T>(redisClient: RedisClient, key: string, bypassCache = false): Promise<T | null> {
    if (bypassCache) {
      return null;
    }

    try {
      const data = await redisClient.get(key);
      if (typeof data !== "string" || data.length === 0) {
        return null;
      }

      return JSON.parse(data) as T;
    } catch (error) {
      logger.warn("Failed to read cache key %s: %s", key, (error as Error).message);
      return null;
    }
  }

  static async set<T>(redisClient: RedisClient, key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (typeof ttl === "number" && Number.isFinite(ttl)) {
        await redisClient.set(key, serialized, { EX: ttl });
      } else {
        await redisClient.set(key, serialized);
      }
    } catch (error) {
      logger.error("error while storing data in redis for key %s: %s", key, (error as Error).message);
    }
  }
}
