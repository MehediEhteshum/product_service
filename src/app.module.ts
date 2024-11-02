import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ProductService, ReviewService } from "./application/index.ts";
import {
  CacheService,
  ProductRepository,
  ReviewEventProducerService,
  ReviewRepository,
  SearchService,
} from "./infrastructure/index.ts";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true, // false for production
      path: "/products",
      debug: true, // false for production
      introspection: true, // false for production
    }),
  ],
  providers: [
    ProductRepository,
    ReviewRepository,
    ProductService,
    ReviewService,
    CacheService,
    SearchService,
    ReviewEventProducerService,
  ],
})
export class AppModule {}
