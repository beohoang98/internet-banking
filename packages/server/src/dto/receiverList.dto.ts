import { IsEnum, IsNumber, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BankTypeEnum } from "@src/models/ReceiverList";

export class CreateReceiverDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Type(() => String)
    name: string;

    @ApiProperty()
    @IsString()
    @Type(() => String)
    desAccountNumber: string;

    @ApiProperty({ enum: BankTypeEnum })
    @IsEnum(BankTypeEnum)
    bankType: BankTypeEnum;
}

export class UpdateReceiverDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @Type(() => String)
    name: string;

    @ApiProperty()
    @IsString()
    @Type(() => String)
    desAccountNumber: string;

    @ApiProperty({ enum: BankTypeEnum })
    @IsEnum(BankTypeEnum)
    bankType: BankTypeEnum;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    id: number;
}
