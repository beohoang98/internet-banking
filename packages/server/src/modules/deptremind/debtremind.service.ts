import { Injectable, Inject } from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { DebtRemind } from "@src/models/DebtRemind";
import { MailerService } from "@nestjs-modules/mailer";
import { GetDebtRemindDto } from "@src/dto/debtRemind.dto";
import { CheckAccountDto } from "@src/dto/client.dto";

enum TemplateEnum {
    Remind_Dept = "remindDept",
    Delete_Remind_Dept = "deleteRemindDept",
}

@Injectable()
export class DebtRemindService {
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
        const dept = new DebtRemind({
            sourceAccount: srcAccount.accountNumber,
            desAccount: desAccount.accountNumber,
            amount: amount,
            remindNote: remindNote,
        });

        await getRepository(DebtRemind).save(dept);
        return await this.sendMail(
            srcAccount.email,
            desAccount.email,
            amount,
            remindNote,
            TemplateEnum.Remind_Dept,
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
        const list = await getRepository(DebtRemind).find({
            where: [
                {
                    desAccount: user.accountNumber,
                },
                {
                    sourceAccount: user.accountNumber,
                },
            ],
        });

        const result: GetDebtRemindDto[] = [];

        for (let i = 0; i < list.length; i++) {
            if (list[i].isDone === false) {
                const dept = new GetDebtRemindDto({
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

        const deleteDept = await getRepository(DebtRemind).findOne(deptId);

        if (deleteDept.sourceAccount === user.accountNumber) {
            const desAccount = await getRepository(User).findOne({
                where: { accountNumber: deleteDept.desAccount },
            });
            await getRepository(DebtRemind).update(deleteDept.id, {
                isDone: true,
                completeNote: note,
            });
            return await this.sendMail(
                user.email,
                desAccount.email,
                deleteDept.amount,
                note,
                TemplateEnum.Delete_Remind_Dept,
            );
        }

        if (deleteDept.desAccount === user.accountNumber) {
            const srcAccount = await getRepository(User).findOne({
                where: { accountNumber: deleteDept.sourceAccount },
            });
            await getRepository(DebtRemind).update(deleteDept.id, {
                isDone: true,
                completeNote: note,
            });
            return await this.sendMail(
                user.email,
                srcAccount.email,
                deleteDept.amount,
                note,
                TemplateEnum.Delete_Remind_Dept,
            );
        }
    }
}
