import { Args, ID, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Product } from "../domain/product.entity.ts";
import { ProductRepository } from "../infrastructure/product.repository.ts";
import { CreateProductReq, UpdateProductReq } from "./dto/product.dto.ts";

@Resolver(() => Product)
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  @Query(() => [Product])
  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products.sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  @Query(() => Product, { nullable: true })
  async findOne(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Product | null> {
    return await this.productRepository.findOne(id);
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
    return await this.productRepository.create(productData);
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
      return await this.productRepository.update(id, updatedData);
    }
    return null;
  }

  @Mutation(() => Product, { nullable: true })
  async remove(
    @Args("id", { type: () => ID }) id: string
  ): Promise<Product | null> {
    return await this.productRepository.remove(id);
  }
}
