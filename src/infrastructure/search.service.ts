import { Client } from "@elastic/elasticsearch";
import { Injectable } from "@nestjs/common";
import { Product } from "../domain/index.ts";

@Injectable()
export class SearchService {
  private readonly searchClient: Client;

  constructor() {
    this.searchClient = new Client({ node: "http://localhost:9200" });
  }

  async index(index: string, product: Product): Promise<void> {
    await this.searchClient.index({
      index: index,
      id: product.id,
      body: product,
    });
  }

  async delete(index: string, id: string): Promise<void> {
    await this.searchClient.delete({
      index: index,
      id: id,
    });
  }

  async search(searchQuery: string): Promise<Product[]> {
    const response = await this.searchClient.search({
      index: "products",
      body: {
        query: {
          match: {
            name: searchQuery,
          },
        },
      },
    });

    return response.hits.hits.map((hit) => hit._source as Product);
  }
}
