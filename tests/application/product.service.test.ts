import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { ProductService } from "../../src/application/index.ts";
import {
  CacheService,
  ProductRepository,
  SearchService,
} from "../../src/infrastructure/index.ts";
import { MockCacheService } from "../infrastructure/cache.service.mock.ts";
import { MockProductRepository } from "../infrastructure/product.repository.mock.ts";
import { MockSearchService } from "../infrastructure/search.service.mock.ts";

describe("ProductService", () => {
  it("findAll should return all products", async () => {
    const productRepository = new MockProductRepository();
    const cacheService = new MockCacheService();
    const searchService = new MockSearchService();
    const productService = new ProductService(
      productRepository as unknown as ProductRepository,
      cacheService as unknown as CacheService,
      searchService as unknown as SearchService
    );
    const products = await productService.findAll();
    expect(products.length).toBe(2);
  });

  it("findOne should return a product by ID", async () => {
    const productRepository = new MockProductRepository();
    const cacheService = new MockCacheService();
    const searchService = new MockSearchService();
    const productService = new ProductService(
      productRepository as unknown as ProductRepository,
      cacheService as unknown as CacheService,
      searchService as unknown as SearchService
    );
    const product = await productService.findOne("1");
    expect(product!.id).toBe("1");
    expect(product!.name).toBe("Product 1");
    expect(product!.price).toBe(10);
  });
});
