import { ConnectPgpService } from "@src/modules/connect/connect-pgp.service";
import { Test } from "@nestjs/testing";
import { ConnectPartnerModule } from "@src/modules/connect/connect-partner.module";
import { ConfigModule } from "@nestjs/config";

jest.setTimeout(30000);

describe("Connect PGP", () => {
    let service: ConnectPgpService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [ConnectPartnerModule, ConfigModule.forRoot()],
        }).compile();

        service = module.get(ConnectPgpService);
    });

    test("should defined", () => {
        expect(service).toBeDefined();
    });

    test("should check account success", async () => {
        const res = service.checkAccount("123456789101112").then((data) => {
            console.log(data);
            return data;
        });
        await expect(res).resolves.toBeDefined();
    });

    test("should send money success", async () => {
        const res = service.sendMoney("123456789101112", 50000).then((data) => {
            console.log(data, typeof data);
            return data;
        });
        await expect(res).resolves.toBeDefined();
    });
});
