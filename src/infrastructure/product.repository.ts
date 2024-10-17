import { Injectable } from "npm:@nestjs/common";
import { PrismaService } from "./database/prisma.service.ts";
import { Product } from "../domain/product.entity.ts";

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<Product> {
    return await this.prisma.product.create({ data: product });
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: number, product: Product): Promise<Product | null> {
    return await this.prisma.product.update({ where: { id }, data: product });
  }

  async remove(id: number): Promise<Product | null> {
    return await this.prisma.product.delete({ where: { id } });
  }
}
