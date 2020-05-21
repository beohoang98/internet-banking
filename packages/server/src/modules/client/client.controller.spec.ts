import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/models/Client";
import * as request from "supertest";
import { ClientService } from "@src/modules/client/client.service";
import { MockTypeORMConfig } from "@src/utils/typeorm-mock";
import { AppModule } from "@src/app.module";
import { PGPService } from "@src/modules/crypto/pgp.service";
import { readFileSync } from "fs";
import { resolve } from "path";

jest.setTimeout(30000);

describe("ClientController", () => {
    let app: INestApplication;
    const testClient: Partial<Client> = {
        id: "test",
        secret: "123456", // same with test-private.asc key
        publicKey: readFileSync(
            resolve(__dirname, "../../keys/test-pub.asc"),
        ).toString("base64"),
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRootAsync({
                    useClass: MockTypeORMConfig,
                }),
                AppModule,
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(() => {
        app.close();
    });

    it("Should create client", async () => {
        const service = app.get(ClientService);
        const client = service.create(
            testClient.id,
            testClient.secret,
            testClient.publicKey,
        );
        await expect(client).resolves.toBeDefined();
    });

    it("Client check info", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        return request(app.getHttpServer())
            .get("/client/check-account")
            .auth(testClient.id, testClient.secret)
            .expect(200);
    });

    it("Client-should-be-verify", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        const pgpClient = app.get(PGPService);
        const sendData = {
            from: "asdasd",
            to: "asdasd",
            amount: 123456789,
        };
        const signature = await pgpClient.sign(
            JSON.stringify(sendData),
            readFileSync(resolve(__dirname, "../../keys/test-private.asc")),
            testClient.secret,
        );

        const res = await request(app.getHttpServer())
            .post("/client/send")
            .auth(testClient.id, testClient.secret)
            .send({
                data: JSON.stringify(sendData),
                signature,
            });

        expect(res.status).toBe(201);
    });
});
