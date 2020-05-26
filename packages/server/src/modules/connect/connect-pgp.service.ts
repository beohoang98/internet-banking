import { ConnectAbstractService } from "@src/modules/connect/connect-abstract.service";
import { HttpService, Injectable } from "@nestjs/common";
import { PGPService } from "@src/modules/crypto/pgp.service";
import { Keys } from "@src/config/keys.config";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import * as moment from "moment";
import axios from "axios";

@Injectable()
export class ConnectPgpService implements ConnectAbstractService {
    readonly type = "PGP";
    readonly privateKey = Keys.PGP_PRIVATE;
    readonly publicKey = Keys.PGP_PUBLIC;
    readonly host = "https://hhbank.herokuapp.com";
    constructor(
        readonly cryptoService: PGPService,
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    async checkAccount(accountNumber: number | string): Promise<any> {
        const body = {
            Number: accountNumber,
        };
        const time = moment().unix();

        const hash = this.makeHash({
            Body: body,
            Time: time,
        });
        const partnerCode = this.configService.get<string>(
            "PGP_CLIENT_PARTNER_CODE",
        );

        return await this.httpService
            .post(`${this.host}/user-account/info`, body, {
                headers: {
                    "x-partner-code": partnerCode,
                    "x-partner-time": time.toString(),
                    "x-partner-sig": hash,
                },
            })
            .toPromise();
    }

    async sendMoney(
        accountNumber: number | string,
        amount: number,
    ): Promise<any> {
        const partnerCode = this.configService.get<string>(
            "PGP_CLIENT_PARTNER_CODE",
        );
        const passphrase = this.configService.get<string>("PGP_PASSPHRASE");

        const data = {
            Number: accountNumber + "",
            Money: amount + "",
        };
        const time = moment().unix();

        const { encrypted } = await this.cryptoService.encrypt(
            JSON.stringify(data),
            this.privateKey,
            this.publicKey,
            passphrase,
        );

        const body = {
            message: encrypted,
        };

        const hash = this.makeHash({
            Body: body,
            Time: time,
        });

        const cancelToken = axios.CancelToken.source();
        setTimeout(() => {
            cancelToken.cancel();
        }, 10000);

        return await this.httpService
            .post(`${this.host}/account-number/add`, body, {
                headers: {
                    "x-partner-code": partnerCode,
                    "x-partner-time": time,
                    "x-partner-sig": hash,
                },
                cancelToken: cancelToken.token,
            })
            .toPromise();
    }

    makeHash(body: object): string {
        const hashSecret = this.configService.get<string>(
            "PGP_CLIENT_HASH_SECRET",
        );
        return crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");
    }
}
