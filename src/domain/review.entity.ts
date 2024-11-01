import { Field, ID, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment: string;

  @Field(() => ID)
  productId: string;

  @Field(() => ID)
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
