import { Injectable } from "npm:@nestjs/common";
import { PrismaClient } from "npm:@prisma/client/edge.js";
import { Product } from "../domain/product.entity.ts";

const prisma = new PrismaClient();

@Injectable()
export class ProductRepository {
  async create(product: Product): Promise<Product> {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    return {
      ...createdProduct,
      description: createdProduct.description ?? "",
      imageUrl: createdProduct.imageUrl ?? "",
      category: createdProduct.category ?? "",
    };
  }

  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany();
    return products.map((product) => ({
      ...product,
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      category: product.category ?? "",
    }));
  }

  async findOne(id: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({ where: { id } });
    return product
      ? {
          ...product,
          description: product.description ?? "",
          imageUrl: product.imageUrl ?? "",
          category: product.category ?? "",
        }
      : null;
  }

  async update(id: number, product: Product): Promise<Product | null> {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: product,
    });
    return {
      ...updatedProduct,
      description: updatedProduct.description ?? "",
      imageUrl: updatedProduct.imageUrl ?? "",
      category: updatedProduct.category ?? "",
    };
  }

  async remove(id: number): Promise<Product | null> {
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });
    return deletedProduct
      ? {
          ...deletedProduct,
          description: deletedProduct.description ?? "",
          imageUrl: deletedProduct.imageUrl ?? "",
          category: deletedProduct.category ?? "",
        }
      : null;
  }
}
