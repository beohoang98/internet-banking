import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import { User } from "@src/models/User";
import { ClientRequestLog } from "@src/models/ClientRequestLog";

export class MockTypeORMConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(
        connectionName?: string,
    ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: "postgres",
            url: process.env.DATABASE_TEST_URL,
            entities: [Client, User, ClientRequestLog],
            autoLoadEntities: true,
            name: connectionName,
            synchronize: true,
            dropSchema: true,
        };
    }
}
