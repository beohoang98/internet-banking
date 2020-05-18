import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerInit(app: INestApplication) {
    const scopes = {
        "profile:read": "",
        "profile:write": "",
        "transaction:read": "",
        "transaction:write": "",
        "user:read": "",
        "user:update": "",
        "user:delete": "",
        "user:create": "",
    };
    const clientScopes = {
        "profile:read": "",
        "transaction:write": "",
    };

    const swaggerOpts = new DocumentBuilder()
        .addBasicAuth({
            name: "basic",
            type: "http",
        })
        .addBearerAuth({
            name: "jwt",
            bearerFormat: "JWT",
            type: "http",
        })
        .setTitle("Bank API")
        .setVersion("0.0.1")
        .build();

    const doc = SwaggerModule.createDocument(app, swaggerOpts);
    SwaggerModule.setup("/api-docs", app, doc);
}
