import { Client } from "@elastic/elasticsearch";
import { Injectable, Logger } from "@nestjs/common";
import { Product } from "../domain/index.ts";

@Injectable()
export class SearchService {
  private readonly searchClient: Client;
  private readonly logger = new Logger(SearchService.name);

  constructor() {
    this.searchClient = new Client({ node: "http://localhost:9200" });
  }

  async index(index: string, product: Product): Promise<void> {
    try {
      await this.searchClient.index({
        index: index,
        id: product.id,
        body: product,
      });
      this.logger.log(`Indexed product: ${product.name}`);
    } catch (error) {
      this.logger.error(
        `Failed to index product: ${product.name}`,
        error.stack
      );
      throw new Error(`Indexing failed: ${error.message}`);
    }
  }

  async delete(index: string, id: string): Promise<void> {
    try {
      await this.searchClient.delete({ index: index, id: id });
      this.logger.log(`Deleted product: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete product`, error.stack);
      throw new Error(`Deletion failed: ${error.message}`);
    }
  }

  async search(searchQuery: string): Promise<Product[]> {
    try {
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
    } catch (error) {
      this.logger.error(`Search failed: ${searchQuery}`, error.stack);
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}
