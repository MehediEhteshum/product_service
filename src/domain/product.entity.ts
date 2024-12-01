import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  imageUrl!: string;

  @Field({ nullable: true })
  category!: string;

  @Field()
  price!: number;

  @Field(() => Int)
  stock!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
