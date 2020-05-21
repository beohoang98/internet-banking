import { DynamicModule, Module } from "@nestjs/common";
import { PGPService } from "@src/modules/crypto/pgp.service";
import { RSAService } from "./rsa.service";

@Module({
    providers: [PGPService, RSAService],
    exports: [PGPService, RSAService],
})
export class CryptoModule {
    static forRoot(): DynamicModule {
        return {
            module: CryptoModule,
            global: true,
        };
    }
}
