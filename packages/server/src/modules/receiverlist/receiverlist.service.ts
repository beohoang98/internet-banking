import { Injectable } from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { ReceiverList, BankTypeEnum } from "@src/models/ReceiverList";

@Injectable()
export class ReceiverListService {
    async getTransferList(id: number) {
        const user = await getRepository(User).findOne({
            where: {
                id,
            },
        });
        return await getRepository(ReceiverList).find({
            where: {
                user: user,
            },
        });
    }

    async addAccount(
        desAccountNumber: string,
        name: string,
        bankType: BankTypeEnum = BankTypeEnum.LOCAL,
        userId: number,
    ) {
        const user = await getRepository(User).findOne({
            where: {
                id: userId,
            },
        });

        const account = new ReceiverList({
            desAccountNumber,
            name,
            bankType,
            user,
        });

        return await getRepository(ReceiverList).save(account);
    }

    async updateAccount(
        desAccountNumber: string,
        name: string,
        bankType: BankTypeEnum,
        id: number,
    ) {
        return await getRepository(ReceiverList).update(id, {
            desAccountNumber,
            name,
            bankType,
        });
    }

    async deleteAccount(id: number) {
        return await getRepository(ReceiverList).delete(id);
    }
}
