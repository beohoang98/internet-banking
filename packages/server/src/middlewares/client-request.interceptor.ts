import {
    CallHandler,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientRequestLog } from "@src/models/ClientRequestLog";
import { PGPService } from "@src/modules/crypto/pgp.service";
import { ClientService } from "@src/modules/client/client.service";

@Injectable()
export class ClientRequestInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(ClientRequestLog)
        private readonly clientRequestRepository: Repository<ClientRequestLog>,

        private readonly pgpService: PGPService,
        private readonly clientService: ClientService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest<Request>();
        await this.log(req);

        const client = await this.clientService.findOne({
            where: { id: req.user.id },
        });
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

        console.debug({
            signature,
            data,
            client: client.id,
        });

        if (!isVerify) {
            throw new ForbiddenException({
                message: `signature not match`,
                signature,
                data,
            });
        }

        return next.handle();
    }

    async log(req: Request) {
        const data = req.body.data || {};
        const signature = req.body.signature || "";
        const clientId = req.user.id; // treat as client(partner)

        const log = await this.clientRequestRepository.save({
            data,
            rawSignature: signature,
            clientId,
        });

        console.log("LOG: " + log.id);
    }
}
