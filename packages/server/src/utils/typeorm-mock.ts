import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import { User } from "@src/models/User";

export class MockTypeORMConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(
        connectionName?: string,
    ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: "postgres",
            url: process.env.DATABASE_TEST_URL,
            entities: [Client, User],
            name: connectionName,
            synchronize: true,
            dropSchema: true,
        };
    }
}
