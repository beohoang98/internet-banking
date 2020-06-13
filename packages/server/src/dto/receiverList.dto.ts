import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AdminRole } from "@src/models/Admin";
import { BankTypeEnum } from "@src/models/ReceiverList";

export class CreateReceiverDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
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
    @IsNotEmpty()
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
