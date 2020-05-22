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

        const diffSec = moment
            .unix(partnerTime)
            .diff(serverTime, "millisecond");
        if (diffSec > 60 * 1000) {
            throw new ForbiddenException("Expired request");
        }

        const hashSecret = this.config.get<string>("HASH_SECRET");
        const body = JSON.stringify(req.body);
        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(body)
            .digest("hex");
        if (hash !== partnerHash) {
            throw new ForbiddenException("Hash invalid");
        }

        return next();
    }
}
