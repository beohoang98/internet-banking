import { PGPService } from "@src/modules/crypto/pgp.service";
import { RSAService } from "@src/modules/crypto/rsa.service";

export interface ConnectAbstractService {
    type: "RSA" | "PGP";
    host: string;

    cryptoService: RSAService | PGPService;
    privateKey: Buffer;

    /**
     *
     * @param accountNumber or userId, etc....
     */
    checkAccount(accountNumber: number | string): Promise<any>;

    sendMoney(accountNumber: number | string, amount: number): Promise<any>;
}
