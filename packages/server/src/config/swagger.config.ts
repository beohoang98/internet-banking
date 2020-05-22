import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function swaggerInit(app: INestApplication) {
    const swaggerOpts = new DocumentBuilder()
        .addBasicAuth(
            {
                type: "http",
                in: "header",
            },
            "basic",
        )
        .addBasicAuth(
            {
                type: "http",
                in: "header",
            },
            "partner",
        )
        .addBearerAuth({
            name: "jwt",
            bearerFormat: "JWT",
            type: "http",
        })
        .setTitle("Bank API")
        .setVersion("0.0.1")
        .setContact(
            "An Hoang",
            "https://github.com/beohoang98",
            "beohoang98@gmail.com",
        )
        .addServer(
            process.env.NODE_ENV !== "production"
                ? `http://localhost:${process.env.PORT || 3000}`
                : process.env.SERVER_URL ||
                      `https://beohoang98-bank-dev.herokuapp.com`,
        )
        .build();

    const doc = SwaggerModule.createDocument(app, swaggerOpts);
    SwaggerModule.setup("/api-docs", app, doc);
}
