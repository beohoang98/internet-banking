import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Oauth2Module } from "@switchit/nestjs-oauth2-server";
import { UserLoaderService } from "./modules/oauth/userLoader.service";
import { UserValidateService } from "./modules/oauth/userValidate.service";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./modules/users/user.module";

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
            useFactory: () => ({
                userLoader: new UserLoaderService(),
                userValidator: new UserValidateService(),
            }),
        }),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
