/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockCacheService {
  get(_key: string): Promise<string | null> {
    return Promise.resolve(null);
  }
  set(_key: string, _value: string): Promise<void> {
    return Promise.resolve();
  }
  extendTTL(_key: string, _ttl: number): Promise<void> {
    return Promise.resolve();
  }
  del(_key: string): Promise<void> {
    return Promise.resolve();
  }
}
