import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../../node_modules/.prisma/client/index.js";
import { Product } from "../domain/product.entity.ts";

const prisma = new PrismaClient();

@Injectable()
export class ProductRepository {
  async create(product: Omit<Product, "id">): Promise<Product> {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany();
    return products;
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    return product;
  }

  async update(id: string, product: Product): Promise<Product | null> {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: product,
    });
    return updatedProduct;
  }

  async remove(id: string): Promise<Product | null> {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    return deletedProduct;
  }
}
