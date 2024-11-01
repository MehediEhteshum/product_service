import {
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

@InputType("CreateProductInput")
export class CreateProductInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  imageUrl: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category: string;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  stock: number;
}

@InputType("UpdateProductInput")
export class UpdateProductInput extends PartialType(CreateProductInput) {}

@ObjectType()
@InputType()
class DateRange {
  @Field(() => Date, { nullable: true })
  @IsOptional()
  start: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  end: Date;
}

@InputType("SearchProductInput")
export class SearchProductInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  query: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  category: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStock: number;

  @Field(() => DateRange, { nullable: true })
  @IsOptional()
  @IsObject()
  dateRange: DateRange;
}
