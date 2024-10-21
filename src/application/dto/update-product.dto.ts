import { InputType, PartialType } from "@nestjs/graphql";
import { CreateProductDto } from "./create-product.dto.ts";

@InputType()
export class UpdateProductDto extends PartialType(CreateProductDto) {}
