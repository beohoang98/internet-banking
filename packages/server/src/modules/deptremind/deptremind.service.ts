import { Inject, Injectable } from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { DeptRemind } from "@src/models/DeptRemind";
import { MailerService } from "@nestjs-modules/mailer";
import { GetDeptRemindDto } from "@src/dto/deptRemind.dto";

enum TemplateEnum {
    REMIND_DEBT = "remindDept",
    DELETE_REMIND_DEBT = "deleteRemindDept",
}

@Injectable()
export class DeptRemindService {
    constructor(
        @Inject(MailerService)
        private readonly mailerService: MailerService,
    ) {}
    async create(
        userId: number,
        desAccountNumber: string,
        amount: number,
        remindNote: string,
    ) {
        const srcAccount = await getRepository(User).findOne(userId);
        const desAccount = await getRepository(User).findOne({
            where: {
                accountNumber: desAccountNumber,
            },
        });
        const dept = new DeptRemind({
            sourceAccount: srcAccount.accountNumber,
            desAccount: desAccount.accountNumber,
            amount: amount,
            remindNote: remindNote,
        });

        await getRepository(DeptRemind).save(dept);
        return await this.sendMail(
            srcAccount.email,
            desAccount.email,
            amount,
            remindNote,
            TemplateEnum.REMIND_DEBT,
        );
    }
    async sendMail(
        srcEmail: string,
        desEmail: string,
        amount: number,
        note: string,
        template: TemplateEnum,
    ) {
        return await this.mailerService.sendMail({
            context: {
                srcEmail,
                desEmail,
                amount,
                note,
            },
            to: desEmail,
            subject: "Dept Remind",
            template: template,
        });
    }

    async getDeptRemind(userId: number) {
        const user = await getRepository(User).findOne(userId);
        const list = await getRepository(DeptRemind).find({
            where: [
                {
                    desAccount: user.accountNumber,
                },
                {
                    sourceAccount: user.accountNumber,
                },
            ],
        });

        const result: GetDeptRemindDto[] = [];

        for (let i = 0; i < list.length; i++) {
            if (list[i].isDone === false) {
                const dept = new GetDeptRemindDto({
                    amount: list[i].amount,
                    note: list[i].remindNote,
                    createAt: list[i].createdAt,
                });

                if (list[i].desAccount === user.accountNumber) {
                    (dept.account = list[i].sourceAccount),
                        (dept.isMyDept = true);
                } else {
                    (dept.account = list[i].desAccount),
                        (dept.isMyDept = false);
                }
                result.push(dept);
            }
        }
        return result;
    }

    async deleteDeptRemind(userId: number, deptId: number, note: string) {
        const user = await getRepository(User).findOne(userId);

        const deleteDept = await getRepository(DeptRemind).findOne(deptId);

        if (deleteDept.sourceAccount === user.accountNumber) {
            const desAccount = await getRepository(User).findOne({
                where: { accountNumber: deleteDept.desAccount },
            });
            await getRepository(DeptRemind).update(deleteDept.id, {
                isDone: true,
                completeNote: note,
            });
            return await this.sendMail(
                user.email,
                desAccount.email,
                deleteDept.amount,
                note,
                TemplateEnum.DELETE_REMIND_DEBT,
            );
        }

        if (deleteDept.desAccount === user.accountNumber) {
            const srcAccount = await getRepository(User).findOne({
                where: { accountNumber: deleteDept.sourceAccount },
            });
            await getRepository(DeptRemind).update(deleteDept.id, {
                isDone: true,
                completeNote: note,
            });
            return await this.sendMail(
                user.email,
                srcAccount.email,
                deleteDept.amount,
                note,
                TemplateEnum.DELETE_REMIND_DEBT,
            );
        }
    }
}
