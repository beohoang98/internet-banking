import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ClientService } from "./client.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import { ConsoleModule } from "nestjs-console";
import { ClientRequestMiddleware } from "@src/middlewares/client-request.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([Client]), ConsoleModule],
    providers: [ClientService],
    exports: [ClientService, TypeOrmModule],
})
export class ClientModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(ClientRequestMiddleware).forRoutes("/client/*");
    }
}
