import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

@InputType("CreateProductInput")
export class CreateProductReq {
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
export class UpdateProductReq extends PartialType(CreateProductReq) {}
