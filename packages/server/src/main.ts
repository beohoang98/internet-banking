import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
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

    await app.init();

    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
