import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductRepository } from "../infrastructure/product.repository.ts";
import { Product } from "../domain/product.entity.ts";

@Resolver(() => Product)
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  @Query(() => [Product])
  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  @Query(() => Product, { nullable: true })
  findOne(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Product | null> {
    return this.productRepository.findOne(id);
  }

  @Mutation(() => Product)
  create(
    @Args("createProductData") createProductData: Product
  ): Promise<Product> {
    return this.productRepository.create(createProductData);
  }

  @Mutation(() => Product, { nullable: true })
  update(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateProductData") updateProductData: Product
  ): Promise<Product | null> {
    return this.productRepository.update(id, updateProductData);
  }

  @Mutation(() => Product, { nullable: true })
  remove(@Args("id", { type: () => Int }) id: number): Promise<Product | null> {
    return this.productRepository.remove(id);
  }
}
