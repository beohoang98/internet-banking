import { IsString, IsInt, IsOptional, IsIn } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    desAccount: string;

    @IsInt()
    amount: number;

    @IsString()
    @IsOptional()
    note: string;

    @IsInt()
    otp: number;
}
