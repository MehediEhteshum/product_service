import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminGuard, AuthGuard, TTL } from "../core/index.ts";
import { Product } from "../domain/index.ts";
import {
  CacheService,
  ProductRepository,
  SearchService,
} from "../infrastructure/index.ts";
import {
  CreateProductInput,
  SearchProductInput,
  UpdateProductInput,
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

  //@access public
  @Query(() => [Product], { name: "products" })
  async findAll(): Promise<Product[]> {
    // ideally, it must have limit and offset
    // plus redis support
    const products = await this.productRepository.findAll();
    return products.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  //@access public
  @Query(() => Product, { nullable: true, name: "product" })
  async findOne(
    @Args("id", { type: () => String }) id: string
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

  //@access private & RBAC
  @Mutation(() => Product, { name: "createProduct" })
  @UseGuards(AuthGuard, AdminGuard)
  async create(
    @Args("createProductInput") createProductInput: CreateProductInput
  ): Promise<Product> {
    const productData: Omit<Product, "id"> = {
      ...createProductInput,
      description: createProductInput.description ?? "",
      imageUrl: createProductInput.imageUrl ?? "",
      category: createProductInput.category ?? "",
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

  //@access private & RBAC
  @Mutation(() => Product, { nullable: true, name: "updateProduct" })
  @UseGuards(AuthGuard, AdminGuard)
  async update(
    @Args("id", { type: () => String }) id: string,
    @Args("updateProductInput") updateProductInput: UpdateProductInput
  ): Promise<Product | null> {
    const existingProduct = await this.findOne(id);
    if (existingProduct) {
      const updatedData: Product = {
        ...existingProduct,
        name: updateProductInput.name ?? existingProduct.name,
        description:
          updateProductInput.description ?? existingProduct.description,
        imageUrl: updateProductInput.imageUrl ?? existingProduct.imageUrl,
        category: updateProductInput.category ?? existingProduct.category,
        price: updateProductInput.price ?? existingProduct.price,
        stock: updateProductInput.stock ?? existingProduct.stock,
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

  //@access private & RBAC
  @Mutation(() => Product, { nullable: true, name: "removeProduct" })
  @UseGuards(AuthGuard, AdminGuard)
  async remove(
    @Args("id", { type: () => String }) id: string
  ): Promise<Product | null> {
    const deletedProduct = await this.productRepository.remove(id);
    if (deletedProduct) {
      await this.cacheStore.del(deletedProduct.id);
      await this.searchService.delete("products", deletedProduct.id);
    }
    return deletedProduct;
  }

  //@access public
  @Query(() => [Product], { name: "searchProducts" })
  async search(
    @Args("searchProductInput") searchProductInput: SearchProductInput
  ): Promise<Product[]> {
    let must: object[] = [];
    let filter: object[] = [];

    if (searchProductInput.query) {
      must.push({
        bool: {
          should: [
            {
              match: {
                name: {
                  query: searchProductInput.query,
                  analyzer: "autocomplete",
                },
              },
            },
            {
              match: {
                description: searchProductInput.query,
              },
            },
          ],
          minimum_should_match: 1,
        },
      });
    }

    if (searchProductInput.category) {
      filter.push({
        match: {
          category: searchProductInput.category,
        },
      });
    }

    if (searchProductInput.minPrice || searchProductInput.maxPrice) {
      filter.push({
        range: {
          price: {
            gte: searchProductInput.minPrice ?? 0,
            lte: searchProductInput.maxPrice ?? Infinity,
          },
        },
      });
    }

    if (searchProductInput.minStock) {
      filter.push({
        range: {
          stock: {
            gte: searchProductInput.minStock,
          },
        },
      });
    }

    if (searchProductInput.dateRange) {
      filter.push({
        range: {
          updatedAt: {
            gte: searchProductInput.dateRange.start ?? new Date(0),
            lte: searchProductInput.dateRange.end ?? new Date(),
          },
        },
      });
    }

    return await this.searchService.search(must, filter);
  }
}
