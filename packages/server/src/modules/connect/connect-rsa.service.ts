import { HttpService, Injectable } from "@nestjs/common";
import { ConnectAbstractService } from "./connect-abstract.service";
import { Keys } from "@src/config/keys.config";
import { RSAService } from "../crypto/rsa.service";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import * as moment from "moment";

@Injectable()
export class ConnectRSAService implements ConnectAbstractService {
    type: "RSA" = "RSA";
    privateKey = Keys.RSA_PRIVATE;
    host = "https://internet-banking-29-service.herokuapp.com";
    partnerCode = "";

    constructor(
        readonly cryptoService: RSAService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.partnerCode = this.configService.get<string>(
            "RSA_CLIENT_PARTNER_CODE",
        );
    }

    async checkAccount(accountNumber: number | string) {
        const query = {
            partnerCode: this.partnerCode,
            createdAt: moment().utc().toISOString(),
        };
        const secureHash = this.makeHash(query);
        const { data } = await this.httpService
            .get(`${this.host}/partner/user/account/${accountNumber}`, {
                params: {
                    ...query,
                    secureHash,
                },
            })
            .toPromise();

        return data;
    }

    async sendMoney(accountNumber: number | string, amount: number) {
        const body = {
            amount,
            partnerCode: this.partnerCode,
            createdAt: moment().utc().toISOString(),
        };
        const secureHash = this.makeHash(body);
        const bodyWithHash = {
            ...body,
            secureHash,
        };
        const signature = await this.cryptoService.sign(
            JSON.stringify(bodyWithHash),
            this.privateKey,
            "base64",
        );

        const { data } = await this.httpService
            .patch(`${this.host}/partner/account/${accountNumber}`, {
                ...bodyWithHash,
                signature,
            })
            .toPromise();

        return data;
    }

    makeHash(body: object) {
        const hashSecret = this.configService.get("RSA_CLIENT_HASH_SECRET");
        return crypto
            .createHmac("sha256", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");
    }
}
