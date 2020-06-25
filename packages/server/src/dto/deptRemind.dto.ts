import { IsInt, IsString } from "class-validator";

export class CreateDeptRemindDto {
    @IsString()
    desAccount: string;

    @IsInt()
    amount: number;

    @IsString()
    remindNote: string;
}

export class GetDeptRemindDto {
    account: string;

    isMyDept: boolean;

    amount: number;

    note: string;

    createAt: Date;

    constructor(data: Partial<GetDeptRemindDto>) {
        Object.assign(this, data);
    }
}
export class DeleteDeptRemindDto {
    @IsInt()
    deptId: number;

    @IsString()
    completeNote: string;
}
