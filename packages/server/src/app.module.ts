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
        CryptoModule.forRoot(),
        AuthModule,
        ClientModule,
        UserModule,
        ConsoleModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
