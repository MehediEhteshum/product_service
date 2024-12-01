import { Client } from "@elastic/elasticsearch";
import { Injectable, Logger } from "@nestjs/common";
import { CUSTOM_INDEX_SETTING } from "../../core/index";
import { Product } from "../../domain/index";

@Injectable()
export class SearchService {
  private readonly searchClient: Client;
  private readonly logger = new Logger(SearchService.name);

  constructor() {
    this.searchClient = new Client({ node: process.env.ES_URL });
  }

  async createCustomIndex(index: string): Promise<void> {
    try {
      const indexExists = await this.searchClient.indices.exists({ index });
      if (!indexExists) {
        await this.searchClient.indices.create({
          index: index,
          body: CUSTOM_INDEX_SETTING
        });
        this.logger.log(
          `Index ${index} with custom settings created successfully.`
        );
      } else {
        this.logger.log(`Index ${index} already exists.`);
      }
    } catch (error) {
      this.logger.error(`Failed to create index ${index}`, error);
      throw new Error(`Index creation failed: ${JSON.stringify(error)}`);
    }
  }

  async index(index: string, product: Product): Promise<void> {
    try {
      await this.searchClient.index({
        index: index,
        id: product.id,
        body: product
      });
      this.logger.log(`Indexed product: ${product.name}`);
    } catch (error) {
      this.logger.error(`Failed to index product: ${product.name}`, error);
      throw new Error(`Indexing failed: ${JSON.stringify(error)}`);
    }
  }

  async delete(index: string, id: string): Promise<void> {
    try {
      await this.searchClient.delete({ index: index, id: id });
      this.logger.log(`Deleted product`);
    } catch (error) {
      this.logger.error(`Failed to delete product`, error);
      throw new Error(`Deletion failed: ${JSON.stringify(error)}`);
    }
  }

  async search(must: object[], filter: object[]): Promise<Product[]> {
    try {
      const response = await this.searchClient.search({
        index: "products",
        body: {
          query: {
            bool: {
              must,
              filter
            }
          },
          sort: [
            { _score: { order: "desc" } },
            { updatedAt: { order: "desc" } }
          ]
        }
      });

      this.logger.log(`Search successful: ${response.hits.hits.length} hits`);
      return response.hits.hits.map((hit) => {
        const product = hit._source as Product;
        product.createdAt = new Date(product.createdAt);
        product.updatedAt = new Date(product.updatedAt);
        return product;
      });
    } catch (error) {
      this.logger.error(`Search failed: ${{ must, filter }}`, error);
      throw new Error(`Search failed: ${JSON.stringify(error)}`);
    }
  }
}
