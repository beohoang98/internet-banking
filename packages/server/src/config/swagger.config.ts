import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerInit(app: INestApplication) {
    const scopes = [
        "profile:read",
        "profile:write",
        "transaction:read",
        "transaction:write",
        "user:read",
        "user:update",
        "user:delete",
        "user:create",
    ];
    const swaggerOpts = new DocumentBuilder()
        .addServer("/api")
        .addOAuth2({
            type: "oauth2",
            bearerFormat: "JWT",
            name: "oauth2",
            in: "header",
            flows: {
                password: {
                    authorizationUrl: "/api/oauth2/authorize",
                    tokenUrl: "/api/oauth2/token",
                    refreshUrl: "/api/oauth2/token",
                    scopes,
                },
                clientCredentials: {
                    authorizationUrl: "/api/oauth2/authorize",
                    tokenUrl: "/api/oauth2/token",
                    refreshUrl: "/api/oauth2/token",
                    scopes,
                },
            },
        })
        .setTitle("Bank API")
        .setVersion("0.0.1")
        .build();

    const doc = SwaggerModule.createDocument(app, swaggerOpts);
    SwaggerModule.setup("/api-docs", app, doc);
}
