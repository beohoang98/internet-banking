// import {
//     ForbiddenException,
//     Injectable,
//     NestMiddleware,
//     UnauthorizedException,
// } from "@nestjs/common";
// import { Request, Response } from "express";
// import { PGPService } from "@src/modules/crypto/pgp.service";
// import { ClientService } from "@src/modules/client/client.service";
//
// @Injectable()
// export class ClientRequestMiddleware
//     implements NestMiddleware<Request, Response> {
//     constructor(
//         private readonly pgpService: PGPService,
//         private readonly clientService: ClientService,
//     ) {}
//
//     async use(req: Request, res: Response, next: () => void) {
//         console.debug(req.user, req.client);
//         const client = await this.clientService.findOne({
//             where: { id: req.user.id },
//         });
//         if (!client) {
//             throw new UnauthorizedException();
//         }
//
//         const signature = req.body.signature;
//         const data = JSON.stringify(req.body.data);
//         const isVerify = await this.pgpService.verify(
//             data,
//             signature,
//             Buffer.from(client.publicKey, "base64"),
//         );
//
//         console.debug({
//             signature,
//             data,
//             client: client.id,
//         });
//
//         if (!isVerify) {
//             throw new ForbiddenException({
//                 message: `signature not match`,
//                 signature,
//                 data,
//             });
//         }
//         return next();
//     }
// }
