import type { Product } from "../../src/domain/index.ts";

export class MockSearchService {
  createCustomIndex(_index: string): Promise<void> {
    return Promise.resolve();
  }
  index(_index: string, _product: Product): Promise<void> {
    return Promise.resolve();
  }
  search(_must: object[], _filter: object[]): Promise<Product[]> {
    return Promise.resolve([]);
  }
  delete(_index: string, _id: string): Promise<void> {
    return Promise.resolve();
  }
}
