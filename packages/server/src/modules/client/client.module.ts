import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { ClientService } from "./client.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import { ConsoleModule } from "nestjs-console";
import { ClientRequestMiddleware } from "@src/middlewares/client-request.middleware";
import { CryptoModule } from "@src/modules/crypto/crypto.module";
import { ClientController } from "@src/modules/client/client.controller";
import { ClientCheckMiddleware } from "@src/middlewares/client-check.middleware";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Client]),
        ConsoleModule,
        CryptoModule,
    ],
    providers: [ClientService],
    controllers: [ClientController],
    exports: [ClientService, TypeOrmModule],
})
export class ClientModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ClientRequestMiddleware)
            .forRoutes({
                path: "/partner/send",
                method: RequestMethod.POST,
            })
            .apply(ClientCheckMiddleware)
            .forRoutes({
                path: "/partner/*",
                method: RequestMethod.POST,
            });
    }
}
