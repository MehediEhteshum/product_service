import { InputType, PartialType } from "npm:@nestjs/graphql";
import { CreateProductDto } from "./create-product.dto.ts";

@InputType()
export class UpdateProductDto extends PartialType(CreateProductDto) {}
