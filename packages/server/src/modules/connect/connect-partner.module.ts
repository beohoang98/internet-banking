import { HttpModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConnectPgpService } from "@src/modules/connect/connect-pgp.service";
import { CryptoModule } from "@src/modules/crypto/crypto.module";

@Module({
    imports: [ConfigModule, HttpModule, CryptoModule],
    providers: [ConnectPgpService],
})
export class ConnectPartnerModule {}
