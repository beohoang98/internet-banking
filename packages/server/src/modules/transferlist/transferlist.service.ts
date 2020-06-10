import { Injectable } from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { TransferList, BankTypeEnum } from "@src/models/TransferList";

@Injectable()
export class TransferListService {
    async getTransferList(id: number) {
        return await getRepository(TransferList).find({
            where: {
                id: id,
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

        const account = new TransferList({
            desAccountNumber,
            name,
            bankType,
            user,
        });

        return await getRepository(TransferList).save(account);
    }

    async updateAccount(
        desAccountNumber: string,
        name: string,
        bankType: BankTypeEnum,
        id: number,
    ) {
        return await getRepository(TransferList).update(id, {
            desAccountNumber,
            name,
            bankType,
        });
    }

    async deleteAccount(id: number) {
        return await getRepository(TransferList).delete(id);
    }
}
