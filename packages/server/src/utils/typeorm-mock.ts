import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import { User } from "@src/models/User";
import { ClientRequestLog } from "@src/models/ClientRequestLog";
import { Transaction } from "@src/models/Transaction";

export class MockTypeORMConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(
        connectionName?: string,
    ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: "mysql",
            url: process.env.DATABASE_TEST_URL,
            entities: [Client, User, ClientRequestLog, Transaction],
            autoLoadEntities: true,
            name: connectionName,
            synchronize: true,
            dropSchema: true,
        };
    }
}
