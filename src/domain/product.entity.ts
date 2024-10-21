import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("ProductInput")
export class Product {
  @Field(() => Int)
  id: number = 0;

  @Field()
  name: string = "";

  @Field({ nullable: true })
  description: string = "";

  @Field()
  price: number = 0;

  @Field(() => Int)
  stock: number = 0;

  @Field({ nullable: true })
  imageUrl: string = "";

  @Field({ nullable: true })
  category: string = "";

  @Field(() => Date)
  createdAt: Date = new Date();

  @Field(() => Date)
  updatedAt: Date = new Date();
}
