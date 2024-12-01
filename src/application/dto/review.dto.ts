import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";

@InputType("CreateReviewInput")
export class CreateReviewInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  productId!: string;
}

@InputType("UpdateReviewInput")
export class UpdateReviewInput extends PartialType(CreateReviewInput) {}
