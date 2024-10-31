import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "../../node_modules/.prisma/client/index.js";
import { Product } from "../domain/index.ts";

const prisma = new PrismaClient();

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);

  async create(product: Omit<Product, "id">): Promise<Product> {
    try {
      const createdProduct = await prisma.product.create({
        data: product,
      });
      this.logger.log(`Product created successfully`);
      return createdProduct;
    } catch (error) {
      this.logger.error(`Failed to create product`, error);
      throw new Error(`Failed to create product: ${JSON.stringify(error)}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany();
      this.logger.log(`Products retrieved successfully`);
      return products;
    } catch (error) {
      this.logger.error(`Failed to retrieve products`, error);
      throw new Error(`Failed to retrieve products: ${JSON.stringify(error)}`);
    }
  }

  async findOne(id: string): Promise<Product | null> {
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      this.logger.log(`Product with id retrieved successfully`);
      return product;
    } catch (error) {
      this.logger.error(`Failed to retrieve product with id`, error);
      throw new Error(`Failed to retrieve product: ${JSON.stringify(error)}`);
    }
  }

  async update(id: string, product: Product): Promise<Product | null> {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: product,
      });
      this.logger.log(`Product with id updated successfully`);
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to update product with id`, error);
      throw new Error(`Failed to update product: ${JSON.stringify(error)}`);
    }
  }

  async remove(id: string): Promise<Product | null> {
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id },
      });
      this.logger.log(`Product with id deleted successfully`);
      return deletedProduct;
    } catch (error) {
      this.logger.error(`Failed to delete product with id`, error);
      throw new Error(`Failed to delete product: ${JSON.stringify(error)}`);
    }
  }
}
