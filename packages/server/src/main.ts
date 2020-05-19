import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as compression from "compression";
import * as helmet from "helmet";
import { NestExpressApplication } from "@nestjs/platform-express";
import { swaggerInit } from "./config/swagger.config";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.set("trust proxy", 1);
    app.enableCors();
    app.use(compression());
    app.use(helmet());
    app.setGlobalPrefix("/api");
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    swaggerInit(app);

    await app.listen(3000);
}

bootstrap();
