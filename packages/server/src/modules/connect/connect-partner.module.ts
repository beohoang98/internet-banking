import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConnectPgpService } from "@src/modules/connect/connect-pgp.service";
import { CryptoModule } from "@src/modules/crypto/crypto.module";
import { ConnectRSAService } from "./connect-rsa.service";

@Module({
    imports: [ConfigModule, HttpModule, CryptoModule, ConfigService],
    providers: [ConnectPgpService, ConnectRSAService],
    exports: [ConnectPgpService, ConnectRSAService],
})
export class ConnectPartnerModule {}
