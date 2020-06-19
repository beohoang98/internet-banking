import {
    IsString,
    IsInt,
    IsOptional,
    IsIn,
    IsBoolean,
    IsEnum,
} from "class-validator";
import { BankTypeEnum } from "@src/models/ReceiverList";

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
