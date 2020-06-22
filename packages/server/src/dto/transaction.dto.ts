import {
    IsString,
    IsInt,
    IsOptional,
    IsIn,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
} from "class-validator";
import { BankTypeEnum } from "@src/models/ReceiverList";

export class CreateTransactionDto {
    @IsString()
    @IsNotEmpty()
    desAccount: string;

    @IsInt()
    amount: number;

    @IsString()
    @IsOptional()
    note: string;

    @IsInt()
    otp: number;

    @IsBoolean()
    isDebtPay: boolean;

    @IsEnum(BankTypeEnum)
    bankType: BankTypeEnum;
}

export class GetMyTransactionDto {
    id!: number | string;
    createAt!: Date;
    note!: string;
    account!: string;
    bankType!: BankTypeEnum;
    amount!: number;
    constructor(data: Partial<GetMyTransactionDto>) {
        Object.assign(this, data);
    }
}

export class CreateTransactionInterbankDto {
    @IsString()
    @IsNotEmpty()
    accountNumber: string;

    @IsInt()
    amount: number;

    @IsString()
    @IsOptional()
    note: string;

    @IsInt()
    otp: number;

    @IsEnum(BankTypeEnum)
    bankType: BankTypeEnum;
}

export class GetInfoInterbankDto {
    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsEnum(BankTypeEnum)
    bankType: BankTypeEnum;
}
