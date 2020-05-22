import {
    ForbiddenException,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { PGPService } from "@src/modules/crypto/pgp.service";
import { getRepository } from "typeorm";
import { Client } from "@src/models/Client";

@Injectable()
export class ClientRequestMiddleware
    implements NestMiddleware<Request, Response> {
    constructor(private readonly pgpService: PGPService) {}

    async use(req: Request, res: Response, next: () => void) {
        const client = await getRepository(Client).findOne(req.client.id);
        if (!client) {
            throw new UnauthorizedException();
        }

        const signature = req.body.signature;
        const data = JSON.stringify(req.body.data);
        const isVerify = await this.pgpService.verify(
            data,
            signature,
            Buffer.from(client.publicKey, "base64"),
        );
        if (!isVerify) {
            throw new ForbiddenException(`signature not match`);
        }
        return next();
    }
}
