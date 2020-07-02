import { IsInt, IsString } from "class-validator";

export class CreateDebtRemindDto {
    @IsString()
    desAccount: string;

    @IsInt()
    amount: number;

    @IsString()
    remindNote: string;
}

export class GetDebtRemindDto {
    account: string;

    isMyDebt: boolean;

    amount: number;

    note: string;

    createAt: Date;

    name: string;

    id: number | string;

    constructor(data: Partial<GetDebtRemindDto>) {
        Object.assign(this, data);
    }
}
export class DeleteDebtRemindDto {
    @IsInt()
    deptId: number;

    @IsString()
    completeNote: string;
}
