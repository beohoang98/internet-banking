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
        .addOAuth2({
            type: "oauth2",
            bearerFormat: "JWT",
            name: "oauth2",
            in: "query",
            flows: {
                password: {
                    tokenUrl: "/api/oauth2/v2/token",
                    refreshUrl: "/api/oauth2/v2/token",
                    scopes,
                },
                clientCredentials: {
                    tokenUrl: "/api/oauth2/v2/token",
                    refreshUrl: "/api/oauth2/v2/token",
                    scopes: clientScopes,
                },
            },
        })
        .setTitle("Bank API")
        .setVersion("0.0.1")
        .build();

    const doc = SwaggerModule.createDocument(app, swaggerOpts);
    SwaggerModule.setup("/api-docs", app, doc);
}
