import * as moment from "moment";
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
import * as crypto from "crypto";
import {
    CheckAccountDto,
    SendMoneyDto,
    SendMoneyRequestDto,
} from "@src/dto/client.dto";

require("dotenv").config();

jest.setTimeout(30000);

describe("ClientController", () => {
    let app: INestApplication;

    const hashSecret = process.env.HASH_SECRET;
    const testPGPPassphrase = "123456";
    const testClient: Partial<Client> = {
        id: "test",
        secret: "123456",
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

    const createClient = async () => {
        const service = app.get(ClientService);
        return await service.create(
            testClient.id,
            testClient.secret,
            testClient.publicKey,
        );
    };

    async function createSignBody(sendData: SendMoneyDto) {
        const pgpClient = app.get(PGPService);
        const signature = await pgpClient.sign(
            JSON.stringify(sendData),
            readFileSync(resolve(__dirname, "../../keys/test-private.asc")),
            testPGPPassphrase,
        );
        const body: SendMoneyRequestDto = {
            data: sendData,
            signature,
        };
        return body;
    }

    test("Should-create-partner", async () => {
        const client = createClient();
        await expect(client).resolves.toBeDefined();
    });

    test("partner-check-info", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        const body: CheckAccountDto = {
            accountNumber: 1234567890,
        };

        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");

        return request(app.getHttpServer())
            .post("/partner/check-account")
            .set("x-partner-time", moment().unix().toString())
            .set("x-partner-hash", hash)
            .auth(testClient.id, testClient.secret)
            .send(body)
            .expect(201);
    });

    test("partner-check-info-expires", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        const body: CheckAccountDto = {
            accountNumber: 1234567890,
        };

        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");

        return request(app.getHttpServer())
            .post("/partner/check-account")
            .set("x-partner-time", moment().add(61, "second").unix().toString())
            .set("x-partner-hash", hash)
            .auth(testClient.id, testClient.secret)
            .send(body)
            .expect(403);
    });

    test("partner-check-info-that-body-was-modified", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        const body: CheckAccountDto = {
            accountNumber: 1234567890,
        };

        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");

        body.accountNumber = 1234567891;

        return request(app.getHttpServer())
            .post("/partner/check-account")
            .set("x-partner-time", moment().unix().toString())
            .set("x-partner-hash", hash)
            .auth(testClient.id, testClient.secret)
            .send(body)
            .expect(403);
    });

    test("partner-should-be-verify", async () => {
        await createClient();
        const sendData: SendMoneyDto = {
            accountNumber: 1234567890,
            amount: 500000,
        };
        const body = await createSignBody(sendData);
        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");

        const res = await request(app.getHttpServer())
            .post("/partner/send/")
            .set("x-partner-time", moment().unix().toString())
            .set("x-partner-hash", hash)
            .auth(testClient.id, testClient.secret)
            .send(body);

        console.debug(res.error);
        expect(res.status).toBe(201);
    });

    test("partner-cant-be-verify-when-diff-json-order-keys", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        const pgpClient = app.get(PGPService);
        const sendData: SendMoneyDto = {
            amount: 500000,
            accountNumber: 1234567890,
        };
        const signature = await pgpClient.sign(
            JSON.stringify(sendData),
            readFileSync(resolve(__dirname, "../../keys/test-private.asc")),
            testPGPPassphrase,
        );
        const body: SendMoneyRequestDto = {
            signature,
            data: sendData,
        };
        const bodyButDiffOrder = {
            data: sendData,
            signature,
        };

        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");

        const res = await request(app.getHttpServer())
            .post("/partner/send")
            .set("x-partner-time", moment().unix().toString())
            .set("x-partner-hash", hash)
            .auth(testClient.id, testClient.secret)
            .send(bodyButDiffOrder);

        expect(res.status).toBe(403);
    });

    test("partner-denied-because-wrong-signature", async () => {
        await app
            .get(ClientService)
            .create(testClient.id, testClient.secret, testClient.publicKey);
        const pgpClient = app.get(PGPService);
        const sendData: SendMoneyDto = {
            accountNumber: 1234567890,
            amount: 500000,
        };
        const signature = await pgpClient.sign(
            JSON.stringify(sendData),
            readFileSync(
                resolve(__dirname, "../../keys/test-private-wrong.asc"),
            ),
            testPGPPassphrase,
        );
        const body: SendMoneyRequestDto = {
            data: sendData,
            signature,
        };

        const hash = crypto
            .createHmac("md5", hashSecret)
            .update(JSON.stringify(body))
            .digest("hex");

        const res = await request(app.getHttpServer())
            .post("/partner/send")
            .set("x-partner-time", moment().unix().toString())
            .set("x-partner-hash", hash)
            .auth(testClient.id, testClient.secret)
            .send(body);

        expect(res.status).toBe(403);
    });
});