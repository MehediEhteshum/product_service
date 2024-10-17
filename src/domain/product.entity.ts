import { ObjectType, Field, Int } from 'npm:@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => Int)
  id: number = 0;

  @Field()
  name: string = '';

  @Field({ nullable: true })
  description: string | null = null;

  @Field()
  price: number = 0;

  @Field()
  stock: number = 0;

  @Field({ nullable: true })
  imageUrl: string | null = null;

  @Field({ nullable: true })
  category: string | null = null;

  @Field(() => Date)
  createdAt: Date = new Date();

  @Field(() => Date)
  updatedAt: Date = new Date();
}
