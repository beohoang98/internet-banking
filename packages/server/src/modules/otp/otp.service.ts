import { Injectable } from "@nestjs/common";
import { User } from "@src/models/User";

import { getRepository } from "typeorm";
import { OTP } from "@src/models/Otp";
import * as moment from "moment";

@Injectable()
export class OtpService {
    async createOtp(id: number) {
        const user = await getRepository(User).findOne(id);

        const otp = new OTP({
            user: user,
        });

        otp.code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        otp.expire = moment().add(5, "minute").toDate();

        return await getRepository(OTP).save(otp);
    }

    async validateOtp(userId: number, code: number) {
        const user = await getRepository(User).findOne(userId);

        const check = await getRepository(OTP).findOne({
            where: {
                code: code,
                user: user,
            },
        });
        console.log(check);
        if (!check) return false;
        else {
            if (moment().diff(check.expire) > 0 || check.isUsed === true)
                return false;
            else return true;
        }
    }
}
