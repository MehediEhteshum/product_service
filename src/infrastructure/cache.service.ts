import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { TTL } from "../core/index.ts";

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
    });
  }

  async set(key: string, value: string) {
    await this.redis.set(key, value, "EX", TTL);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }

  async extendTTL(key: string, ttlExtension: number) {
    const currentTTL = await this.redis.ttl(key);

    if (currentTTL > 0 && currentTTL < TTL * 0.67) {
      const newTTL = currentTTL + ttlExtension;
      await this.redis.expire(key, newTTL);
    }
  }
}
