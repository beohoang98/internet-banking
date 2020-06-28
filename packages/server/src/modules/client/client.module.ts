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
import { CryptoModule } from "@src/modules/crypto/crypto.module";
import { ClientController } from "@src/modules/client/client.controller";
import { ClientCheckMiddleware } from "@src/middlewares/client-check.middleware";
import { ConfigModule } from "@nestjs/config";
import { ClientRequestLog } from "@src/models/ClientRequestLog";
import { UserModule } from "@src/modules/users/user.module";

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Client, ClientRequestLog]),
        ConsoleModule,
        CryptoModule,
        UserModule,
    ],
    providers: [ClientService],
    controllers: [ClientController],
    exports: [ClientService, TypeOrmModule],
})
export class ClientModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ClientCheckMiddleware).forRoutes({
            path: "/partner/*",
            method: RequestMethod.POST,
        });
    }
}
