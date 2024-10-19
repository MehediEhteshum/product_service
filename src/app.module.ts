import { Module } from "npm:@nestjs/common";
import { GraphQLModule } from "npm:@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "npm:@nestjs/apollo";
import { ProductController } from "./application/product.controller.ts";
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
  providers: [ProductRepository, ProductController],
})
export class AppModule {}
