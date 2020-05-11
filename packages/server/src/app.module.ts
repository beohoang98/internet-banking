import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./modules/users/user.module";
import { CoreModule } from "./core.module";

@Module({
    imports: [CoreModule.forRoot(), ConfigModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
