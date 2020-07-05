import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import {
    Admin,
    Client,
    ClientRequestLog,
    DebtRemind,
    OTP,
    ReceiverList,
    Transaction,
    User,
} from "@src/models";
import { ClientTransactionLog } from "@src/models/ClientTransactionLog";

export class MockTypeORMConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        connectionName?: string,
    ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: process.env.DATABASE_TEST_URL.split("://")[0] as any,
            url: process.env.DATABASE_TEST_URL,
            entities: [
                Client,
                User,
                ClientRequestLog,
                Transaction,
                Admin,
                DebtRemind,
                OTP,
                ReceiverList,
                Transaction,
                ClientTransactionLog,
            ],
            autoLoadEntities: true,
            name: "default",
            synchronize: true,
            dropSchema: true,
        };
    }
}
