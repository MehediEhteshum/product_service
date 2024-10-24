import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis();
  }

  async set(key: string, value: string, ttl: number) {
    await this.redis.set(key, value, "EX", ttl);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async del(key: string) {
    await this.redis.del(key);
  }
}
