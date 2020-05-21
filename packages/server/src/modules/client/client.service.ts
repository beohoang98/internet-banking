import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { FindOneOptions, getRepository } from "typeorm";
import { Client } from "@src/models/Client";
import { PasswordEncoder } from "@src/utils/passwordEncoder";
import { Command, Console } from "nestjs-console";
import { Command as CommandClass } from "commander";

@Injectable()
@Console({
    name: "client",
})
export class ClientService {
    /**
     * create new client
     * @param id
     * @param secret input or auto generate
     * @param publicKey optional: admin can add later
     */
    create(id: string, secret?: string, publicKey?: string) {
        const client = new Client({ id, publicKey });

        console.debug(id, secret);
        secret = secret || randomBytes(10).toString("utf8");
        client.secret = PasswordEncoder.encode(secret);

        return getRepository(Client).save(client);
    }

    @Command({
        command: "create <id>",
        options: [
            {
                flags: "-s, --secret <secret>",
                defaultValue: undefined,
            },
        ],
    })
    async createCommand(id: string, command: CommandClass) {
        const secret = command.opts().secret;
        const client = await this.create(id, secret);
        console.log(client);
    }

    findOne(args: FindOneOptions<Client>) {
        return getRepository(Client).findOne(args);
    }
}
