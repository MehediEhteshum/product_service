import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Product } from "../domain/product.entity.ts";
import { CacheService } from "../infrastructure/cache.service.ts";
import { ProductRepository } from "../infrastructure/product.repository.ts";
import { CreateProductReq, UpdateProductReq } from "./dto/product.dto.ts";

@Resolver(() => Product)
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private cacheStore: CacheService
  ) {}

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
    } else {
      foundProduct = await this.productRepository.findOne(id);
      if (foundProduct) {
        await this.cacheStore.set(
          foundProduct.id,
          JSON.stringify(foundProduct),
          300
        );
      }
    }
    return foundProduct;
  }

  @Mutation(() => Product)
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
        JSON.stringify(createdProduct),
        300
      );
    }
    return createdProduct;
  }

  @Mutation(() => Product, { nullable: true })
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
          JSON.stringify(updatedProduct),
          300
        );
      }
      return updatedProduct;
    }
    return null;
  }

  @Mutation(() => Product, { nullable: true })
  async remove(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Product | null> {
    const deletedProduct = await this.productRepository.remove(id);
    if (deletedProduct) {
      await this.cacheStore.del(deletedProduct.id);
    }
    return deletedProduct;
  }
}
