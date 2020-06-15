import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientModule } from "@src/modules/client/client.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "@src/config/jwt.config";
import { AuthModule } from "@src/modules/auth/auth.module";
import { RedisModule } from "@src/modules/redis/redis.module";
import { ConsoleModule } from "nestjs-console";
import { CryptoModule } from "@src/modules/crypto/crypto.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "@src/filters/all-http.filter";
import { AdminModule } from "./modules/admin/admin.module";
import { MulterModule } from "@nestjs/platform-express";
import { ReceiverListModule } from "./modules/receiverlist/receiverlist.module";
import { OtpModule } from "./modules/otp/otp.module";
import { TransactionModule } from "./modules/transaction/transaction.module";
import { DeptRemindModule } from "./modules/deptremind/deptremind.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvVars: false,
            ignoreEnvFile: process.env.NODE_ENV === "production",
        }),
        TypeOrmModule.forRoot({
            autoLoadEntities: true,
        }),
        RedisModule.register({
            url: process.env.REDIS_URL,
        }),
        PassportModule.register({
            session: false,
            defaultStrategy: "jwt",
        }),
        {
            ...JwtModule.register({
                privateKey: JwtConfig.PRIVATE,
                publicKey: JwtConfig.PUBLIC,
                signOptions: {
                    expiresIn: JwtConfig.ACCESS_EXPIRE,
                },
            }),
            global: true,
        },
        MulterModule.register(),
        CryptoModule.forRoot(),
        AuthModule,
        ClientModule,
        UserModule,
        AdminModule,
        ReceiverListModule,
        OtpModule,
        TransactionModule,
        DeptRemindModule,
        ConsoleModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
    exports: [],
})
export class AppModule {}
