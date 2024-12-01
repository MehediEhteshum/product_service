import { ProductResolver } from "../../src/application/index";
import {
  CacheService,
  ProductRepository,
  SearchService
} from "../../src/infrastructure/index";
import { MockCacheService } from "../infrastructure/cache.service.mock";
import { MockProductRepository } from "../infrastructure/product.repository.mock";
import { MockSearchService } from "../infrastructure/search.service.mock";

describe("ProductResolver", () => {
  it("findAll should return all products", async () => {
    const productRepository = new MockProductRepository();
    const cacheService = new MockCacheService();
    const searchService = new MockSearchService();
    const productResolver = new ProductResolver(
      productRepository as unknown as ProductRepository,
      cacheService as unknown as CacheService,
      searchService as unknown as SearchService
    );
    const products = await productResolver.findAll();
    expect(products.length).toBe(2);
  });

  it("findOne should return a product by ID", async () => {
    const productRepository = new MockProductRepository();
    const cacheService = new MockCacheService();
    const searchService = new MockSearchService();
    const productResolver = new ProductResolver(
      productRepository as unknown as ProductRepository,
      cacheService as unknown as CacheService,
      searchService as unknown as SearchService
    );
    const product = await productResolver.findOne("1");
    expect(product!.id).toBe("1");
    expect(product!.name).toBe("Product 1");
    expect(product!.price).toBe(13);
  });
});
