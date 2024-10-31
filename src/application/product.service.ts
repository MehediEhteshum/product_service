import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminRoleGuard, AuthGuard, TTL } from "../core/index.ts";
import { Product } from "../domain/index.ts";
import {
  CacheService,
  ProductRepository,
  SearchService,
} from "../infrastructure/index.ts";
import {
  CreateProductReq,
  SearchProductReq,
  UpdateProductReq,
} from "./index.ts";

@Resolver(() => Product)
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private cacheStore: CacheService,
    private searchService: SearchService
  ) {
    this.initializeSearchIndex();
  }

  private async initializeSearchIndex() {
    await this.searchService.createCustomIndex("products");
  }

  @Query(() => [Product])
  async findAll(): Promise<Product[]> {
    // ideally, it must have limit and offset
    // plus redis support
    const products = await this.productRepository.findAll();
    return products.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  @Query(() => Product, { nullable: true })
  async findOne(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Product | null> {
    const cachedProduct = await this.cacheStore.get(id);
    let foundProduct: Product | null;

    if (cachedProduct) {
      foundProduct = JSON.parse(cachedProduct);
      foundProduct!.createdAt = new Date(foundProduct!.createdAt);
      foundProduct!.updatedAt = new Date(foundProduct!.updatedAt);
      await this.cacheStore.extendTTL(id, TTL / 2);
    } else {
      foundProduct = await this.productRepository.findOne(id);
      if (foundProduct) {
        await this.cacheStore.set(
          foundProduct.id,
          JSON.stringify(foundProduct)
        );
      }
    }
    return foundProduct;
  }

  @Mutation(() => Product)
  @UseGuards(AuthGuard, AdminRoleGuard)
  async create(
    @Args("createProductData") createProductData: CreateProductReq
  ): Promise<Product> {
    const productData: Omit<Product, "id"> = {
      ...createProductData,
      description: createProductData.description ?? "",
      imageUrl: createProductData.imageUrl ?? "",
      category: createProductData.category ?? "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdProduct = await this.productRepository.create(productData);
    if (createdProduct) {
      await this.cacheStore.set(
        createdProduct.id,
        JSON.stringify(createdProduct)
      );
      await this.searchService.index("products", createdProduct);
    }
    return createdProduct;
  }

  @Mutation(() => Product, { nullable: true })
  @UseGuards(AuthGuard, AdminRoleGuard)
  async update(
    @Args("id", { type: () => ID }) id: string,
    @Args("updateProductData") updateProductData: UpdateProductReq
  ): Promise<Product | null> {
    const existingProduct = await this.findOne(id);
    if (existingProduct) {
      const updatedData: Product = {
        id: existingProduct.id,
        name: updateProductData.name ?? existingProduct.name,
        description:
          updateProductData.description ?? existingProduct.description,
        imageUrl: updateProductData.imageUrl ?? existingProduct.imageUrl,
        category: updateProductData.category ?? existingProduct.category,
        price: updateProductData.price ?? existingProduct.price,
        stock: updateProductData.stock ?? existingProduct.stock,
        createdAt: existingProduct.createdAt,
        updatedAt: new Date(),
      };
      const updatedProduct = await this.productRepository.update(
        id,
        updatedData
      );
      if (updatedProduct) {
        await this.cacheStore.set(
          updatedProduct.id,
          JSON.stringify(updatedProduct)
        );
        await this.searchService.index("products", updatedProduct);
      }
      return updatedProduct;
    }
    return null;
  }

  @Mutation(() => Product, { nullable: true })
  @UseGuards(AuthGuard, AdminRoleGuard)
  async remove(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Product | null> {
    const deletedProduct = await this.productRepository.remove(id);
    if (deletedProduct) {
      await this.cacheStore.del(deletedProduct.id);
      await this.searchService.delete("products", deletedProduct.id);
    }
    return deletedProduct;
  }

  @Query(() => [Product])
  async search(
    @Args("searchProductData") searchProductData: SearchProductReq
  ): Promise<Product[]> {
    let must: object[] = [];
    let filter: object[] = [];

    if (searchProductData.query) {
      must.push({
        bool: {
          should: [
            {
              match: {
                name: {
                  query: searchProductData.query,
                },
              },
            },
            {
              match: {
                description: searchProductData.query,
              },
            },
          ],
          minimum_should_match: 1,
        },
      });
    }

    if (searchProductData.category) {
      filter.push({
        match: {
          category: searchProductData.category,
        },
      });
    }

    if (searchProductData.minPrice || searchProductData.maxPrice) {
      filter.push({
        range: {
          price: {
            gte: searchProductData.minPrice ?? 0,
            lte: searchProductData.maxPrice ?? Infinity,
          },
        },
      });
    }

    if (searchProductData.minStock) {
      filter.push({
        range: {
          stock: {
            gte: searchProductData.minStock,
          },
        },
      });
    }

    if (searchProductData.dateRange) {
      filter.push({
        range: {
          updatedAt: {
            gte: searchProductData.dateRange.start ?? new Date(0),
            lte: searchProductData.dateRange.end ?? new Date(),
          },
        },
      });
    }

    return await this.searchService.search(must, filter);
  }
}
