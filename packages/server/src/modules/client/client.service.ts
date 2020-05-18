import { Injectable } from "@nestjs/common";
import { CreateClientCommand } from "@switchit/nestjs-oauth2-server";
import { CommandBus } from "@nestjs/cqrs";

@Injectable()
export class ClientService {
    constructor(private readonly commandBus: CommandBus) {}

    async create(
        name: string,
        secret: string,
        grants: string[],
        scope: string[],
    ) {
        const command = new CreateClientCommand(name, scope.join(","), name);
        return await this.commandBus.execute(command);
    }
}
