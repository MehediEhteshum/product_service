import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ProductResolver, ReviewResolver } from "./application/index";
import {
  CacheService,
  EventProducerService,
  ProductRepository,
  ReviewRepository,
  SearchService
} from "./infrastructure/index";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true, // false for production
      path: "/products",
      debug: true, // false for production
      introspection: true // false for production
    })
  ],
  providers: [
    ProductRepository,
    ReviewRepository,
    ProductResolver,
    ReviewResolver,
    CacheService,
    SearchService,
    EventProducerService
  ]
})
export class AppModule {}
