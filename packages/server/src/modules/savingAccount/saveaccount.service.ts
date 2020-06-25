import { Injectable, ForbiddenException } from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { SavingAccount } from "@src/models/SavingAccount";

@Injectable()
export class SavingAccountService {
    async getSavingAccount(id: number) {
        const user = await getRepository(User).findOne(id);
        return await getRepository(SavingAccount).find({
            where: {
                user: user,
            },
        });
    }

    async createSavingAccount(
        userId: number,
        name: string,
        amount: number,
        time: number,
    ) {
        const user = await getRepository(User).findOne(userId);
        const account = new SavingAccount({
            user: user,
            name: name,
            amount: amount,
            time: time,
        });

        if (user.balance - amount < 0) {
            throw new ForbiddenException("Balance is not enough");
        }
        await getRepository(User).update(user.id, {
            balance: user.balance - amount,
        });
        return await getRepository(SavingAccount).save(account);
    }

    async deleSavingAccount(id: number) {
        const account = await getRepository(SavingAccount).findOne(id, {
            relations: ["user"],
        });
        if (!account) {
            throw new ForbiddenException("Cant find account");
        }

        await getRepository(User).update(account.user.id, {
            balance: account.user.balance + account.amount,
        });
        return await getRepository(SavingAccount).delete(id);
    }
}
