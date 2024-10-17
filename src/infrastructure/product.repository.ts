import { Injectable } from "npm:@nestjs/common";
import { PrismaClient } from "npm:@prisma/client";
import { Product } from "../domain/product.entity.ts";

const prisma = new PrismaClient();

@Injectable()
export class ProductRepository {
  async create(product: Product): Promise<Product> {
    return await prisma.product.create({ data: product });
  }

  async findAll(): Promise<Product[]> {
    return await prisma.product.findMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return await prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, product: Product): Promise<Product | null> {
    return await prisma.product.update({ where: { id }, data: product });
  }

  async remove(id: number): Promise<Product | null> {
    return await prisma.product.delete({ where: { id } });
  }
}
