import { Logger } from "@nestjs/common";
import { Product } from "../../src/domain/index";

export class MockProductRepository {
  private readonly logger = new Logger(MockProductRepository.name);

  findAll(): Promise<Product[]> {
    return Promise.resolve([
      {
        id: "1",
        name: "Product 1",
        price: 10,
        stock: 5,
        category: "Electronics",
        description: "A great product",
        imageUrl: "url1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        name: "Product 2",
        price: 20,
        stock: 10,
        category: "Clothing",
        description: "Another great product",
        imageUrl: "url2",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }
  findOne(id: string): Promise<Product | null> {
    return Promise.resolve({
      id: id,
      name: `Product ${id}`,
      price: 10 * parseInt(id),
      stock: 5,
      category: "Electronics",
      description: "A great product",
      imageUrl: "url1",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  create(product: Omit<Product, "id">): Promise<Product> {
    return Promise.resolve({
      id: "3",
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  update(id: string, product: Product): Promise<Product> {
    return Promise.resolve({ ...product, id, updatedAt: new Date() });
  }
  remove(id: string): Promise<Product> {
    return Promise.resolve({
      id,
      name: `Product ${id}`,
      price: 10 * parseInt(id),
      stock: 5,
      category: "Electronics",
      description: "A great product",
      imageUrl: "url1",
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
