/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockSearchService {
  createCustomIndex(index: string): Promise<void> {
    return Promise.resolve();
  }
  index(index: string, product: any): Promise<void> {
    return Promise.resolve();
  }
  search(must: any, filter: any): Promise<any[]> {
    return Promise.resolve([]);
  }
  delete(index: string, id: string): Promise<void> {
    return Promise.resolve();
  }
}
