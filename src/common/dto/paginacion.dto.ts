import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginacionDTO {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limite?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    offset?: number;
}