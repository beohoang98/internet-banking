import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class CheckAccountDto {
    @ApiProperty({
        type: "integer",
        example: "1234567890",
    })
    @IsInt()
    @Min(10 ** 10) // 10 digits
    accountNumber: number;
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
