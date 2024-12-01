import { Injectable, Logger } from "@nestjs/common";
import { Redis } from "ioredis";
import { TTL } from "../../core/index";

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT_APP!, 10) || 6379
    });
  }

  async set(key: string, value: string) {
    try {
      await this.redis.set(key, value, "EX", TTL);
      this.logger.log(`Cache key set successfully`);
    } catch (error) {
      this.logger.error(`Failed to set cache key`, error);
      throw new Error(`Failed to set cache key: ${JSON.stringify(error)}`);
    }
  }

  async get(key: string) {
    try {
      const value = await this.redis.get(key);
      this.logger.log(`Cache key retrieved successfully`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get cache key`, error);
      throw new Error(`Failed to get cache key: ${JSON.stringify(error)}`);
    }
  }

  async del(key: string) {
    try {
      await this.redis.del(key);
      this.logger.log(`Cache key deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete cache key`, error);
      throw new Error(`Failed to delete cache key: ${JSON.stringify(error)}`);
    }
  }

  async extendTTL(key: string, ttlExtension: number) {
    try {
      const currentTTL = await this.redis.ttl(key);

      if (currentTTL > 0 && currentTTL < TTL * 0.67) {
        const newTTL = currentTTL + ttlExtension;
        await this.redis.expire(key, newTTL);
        this.logger.log(`TTL for cache key extended successfully`);
      }
    } catch (error) {
      this.logger.error(`Failed to extend TTL for cache key`, error);
      throw new Error(
        `Failed to extend TTL for cache key: ${JSON.stringify(error)}`
      );
    }
  }
}
