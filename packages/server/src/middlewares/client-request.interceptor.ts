import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ClientRequestLog } from "@src/models/ClientRequestLog";

@Injectable()
export class ClientRequestInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(ClientRequestLog)
        private readonly clientRequestRepository: Repository<ClientRequestLog>,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        const req = context.switchToHttp().getRequest<Request>();

        // it's for logging, so make it no effect to request performance
        (async () => {
            const data = req.body.data || {};
            const signature = req.body.signature || "";
            const clientId = req.user.id; // treat as client(partner)

            await this.clientRequestRepository.save({
                data,
                rawSignature: signature,
                clientId,
            });
        })().catch(console.warn);

        return next.handle();
    }
}
