import { ApiProperty } from "@nestjs/swagger";
import {
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    IsOptional,
    IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { BankTypeEnum } from "@src/models/ReceiverList";

export class CheckAccountDto {
    @ApiProperty({
        type: "integer",
        example: 1234567890,
    })
    @IsInt()
    @Min(10 ** 10) // 10 digits
    accountNumber: number;
}
export class CheckAccountResponseDto {
    @ApiProperty()
    accountNumber: number;

    @ApiProperty()
    name: string;
}

export class SendMoneyDto extends CheckAccountDto {
    @ApiProperty({
        type: "integer",
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    amount: number;
}

export class SendMoneyRequestDto {
    @ApiProperty()
    @Type(() => SendMoneyDto)
    data: SendMoneyDto;

    @ApiProperty({
        description: "PGP Signature",
        example: "-----BEGIN PGP .... -----",
    })
    @IsString()
    @IsNotEmpty()
    signature: string;
}

export class SendMoneyDtoV2 extends CheckAccountDto {
    @ApiProperty({
        type: "integer",
        minimum: 0,
    })
    @IsInt()
    @Min(0)
    amount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    sourceAccount: string;

    @ApiProperty()
    @IsOptional()
    note: string;

    @ApiProperty()
    @IsEnum(BankTypeEnum)
    bankType: BankTypeEnum;
}

export class SendMoneyRequestV2Dto {
    @ApiProperty()
    @Type(() => SendMoneyDtoV2)
    data: SendMoneyDtoV2;

    @ApiProperty({
        description: "PGP Signature",
        example: "-----BEGIN PGP .... -----",
    })
    @IsString()
    @IsNotEmpty()
    signature: string;
}
