import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { ConnectPartnerModule } from "@src/modules/connect/connect-partner.module";
import { ConnectRSAService } from "./connect-rsa.service";

jest.setTimeout(30000);

describe("Connect RSA", () => {
    let service: ConnectRSAService;
    const testAccountId = "9704880845960482";

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [ConnectPartnerModule, ConfigModule.forRoot()],
        }).compile();

        service = module.get(ConnectRSAService);
    });

    test("should defined", () => {
        expect(service).toBeDefined();
    });

    test("should check account success", async () => {
        const res = service.checkAccount(testAccountId).then((data) => {
            console.log(data);
            return data;
        });
        await expect(res).resolves.toBeDefined();
    });

    test("should send money success", async () => {
        const res = service
            .sendMoney(testAccountId, 0)
            .then((data) => {
                console.log(data, typeof data);
                return data;
            })
            .catch((e) => {
                console.error(e);
                throw e;
            });
        await expect(res).resolves.toBeDefined();
    });
});
