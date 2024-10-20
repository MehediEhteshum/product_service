import { Module } from "npm:@nestjs/common";
import { GraphQLModule } from "npm:@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "npm:@nestjs/apollo";
import { ProductService } from "./application/product.service.ts";
import { ProductRepository } from "./infrastructure/product.repository.ts";

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
  providers: [ProductRepository, ProductService],
})
export class AppModule {}
