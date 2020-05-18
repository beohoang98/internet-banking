import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./modules/users/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { createConnection } from "typeorm";
import { User } from "./models/User";
import { UserLoaderService } from "./modules/oauth/userLoader.service";
import { UserValidateService } from "./modules/oauth/userValidate.service";
import { Oauth2Module } from "@switchit/nestjs-oauth2-server";
import { ClientModule } from "@src/modules/client/client.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvVars: false,
            ignoreEnvFile: process.env.NODE_ENV === "production",
        }),
        TypeOrmModule.forRoot({
            autoLoadEntities: true,
        }),
        Oauth2Module.forRootAsync({
            useFactory: async () => {
                const connection = await createConnection();
                const userRepo = connection.getRepository(User);
                return {
                    userLoader: new UserLoaderService(userRepo),
                    userValidator: new UserValidateService(userRepo),
                };
            },
        }),
        CqrsModule,
        ClientModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
