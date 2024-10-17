import { Field, InputType, Int } from "npm:@nestjs/graphql";

@InputType()
export class CreateProductDto {
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
}
