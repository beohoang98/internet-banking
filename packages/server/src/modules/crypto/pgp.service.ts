import { ForbiddenException, Injectable } from "@nestjs/common";
import * as pgp from "openpgp";
import { AbstractSignService } from "@src/modules/crypto/abstract-sign.service";

@Injectable()
export class PGPService implements AbstractSignService {
    async sign(
        data: string,
        privateKeyBuffer: Buffer,
        passphrase: string,
    ): Promise<string> {
        const {
            keys: [privateKey],
        } = await pgp.key.readArmored(privateKeyBuffer);

        const canDecrypt = await privateKey.decrypt(passphrase);
        if (!canDecrypt) {
            throw new ForbiddenException("wrong passphrase");
        }

        const { signature } = await pgp.sign({
            detached: true,
            message: pgp.cleartext.fromText(data),
            privateKeys: privateKey,
        });

        return signature;
    }

    async verify(
        data: string,
        signature: string,
        clientPublicKeyBuffer: Buffer,
    ): Promise<boolean> {
        const {
            keys: [publicKey],
        } = await pgp.key.readArmored(clientPublicKeyBuffer);

        const {
            signatures: [{ valid }],
        } = await pgp.verify({
            message: pgp.message.fromText(data),
            signature: await pgp.signature.readArmored(signature),
            publicKeys: [publicKey],
        });

        return valid;
    }
}
