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

    isMyDept: boolean;

    amount: number;

    note: string;

    createAt: Date;

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
