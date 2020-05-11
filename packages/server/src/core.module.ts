import { DynamicModule, Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Oauth2Module } from "@0auth2Server";
import { UserLoaderService } from "./modules/oauth/userLoader.service";
import { UserValidateService } from "./modules/oauth/userValidate.service";
import { ConfigModule } from "@nestjs/config";
import {createConnection, getConnection} from 'typeorm';
import { User } from "./models/User";

@Global()
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
    ],
})
export class CoreModule {
    static forRoot(): DynamicModule {
        return {
            module: CoreModule,
            global: true,
        };
    }
}
