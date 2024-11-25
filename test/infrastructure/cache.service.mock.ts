/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockCacheService {
  get(key: string): Promise<string | null> {
    return Promise.resolve(null);
  }
  set(key: string, value: string): Promise<void> {
    return Promise.resolve();
  }
  extendTTL(key: string, ttl: number): Promise<void> {
    return Promise.resolve();
  }
  del(key: string): Promise<void> {
    return Promise.resolve();
  }
}
