import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import * as moment from "moment";
import * as crypto from "crypto";

@Injectable()
export class ClientCheckMiddleware
    implements NestMiddleware<Request, Response> {
    constructor(private readonly config: ConfigService) {}

    async use(req: Request, res: Response, next: () => void) {
        const serverTime = moment();
        const partnerTime = +req.header("x-partner-time");
        const partnerHash = req.header("x-partner-hash");

        console.debug(req.headers);

        const diffSec = moment
            .unix(partnerTime)
            .diff(serverTime, "millisecond");
        if (diffSec > 60 * 1000) {
            throw new ForbiddenException("Expired request");
        }

        const hashSecret = this.config.get<string>("HASH_SECRET");
        const body =
            typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(body)
            .digest("hex");
        console.debug(body, hash, partnerHash);

        if (hash !== partnerHash) {
            throw new ForbiddenException({
                hash,
                yourHash: partnerHash,
                body,
            });
        }

        return next();
    }
}
