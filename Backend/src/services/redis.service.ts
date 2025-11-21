import {injectable, BindingScope} from '@loopback/core';
import IORedis from 'ioredis';

@injectable({scope: BindingScope.SINGLETON})
export class RedisService {
  private client: IORedis;

  constructor() {
    this.client = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds = 604800) {
    // 7 ngày
    return this.client.set(key, value, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
}
