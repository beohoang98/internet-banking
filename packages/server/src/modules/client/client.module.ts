import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import { ConsoleModule } from "nestjs-console";

@Module({
    imports: [TypeOrmModule.forFeature([Client]), ConsoleModule],
    providers: [ClientService],
    exports: [ClientService, TypeOrmModule],
})
export class ClientModule {}
