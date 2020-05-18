import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as compression from "compression";
import * as helmet from "helmet";
import { NestExpressApplication } from "@nestjs/platform-express";
import { swaggerInit } from "./config/swagger.config";
import { useContainer } from "class-validator";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.set("trust proxy", 1);
    app.enableCors();
    app.use(compression());
    app.use(helmet());
    app.setGlobalPrefix("/api");
    swaggerInit(app);

    useContainer(app.set(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(3000);
}

bootstrap();
