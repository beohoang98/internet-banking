import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
    imports: [CqrsModule],
    providers: [ClientService],
})
export class ClientModule {}
