import { AbstractSignService } from "@src/modules/crypto/abstract-sign.service";
import { Injectable } from "@nestjs/common";
import * as NodeRSA from "node-rsa";

@Injectable()
export class RSAService implements AbstractSignService {
    async sign(
        data: string,
        privateKeyBuffer: Buffer,
        encoding = "utf8",
    ): Promise<string> {
        const key = new NodeRSA(privateKeyBuffer);
        const signature = key.sign(data);
        return signature.toString(encoding);
    }

    async verify(
        data: string,
        signature: string,
        clientPublicKeyBuffer: Buffer,
    ): Promise<boolean> {
        const key = new NodeRSA(clientPublicKeyBuffer);
        return key.verify(data, Buffer.from(signature));
    }
}
