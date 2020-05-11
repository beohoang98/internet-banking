import { NestFactory } from "@nestjs/core";
import { CoreModule } from "./core.module";
import { CommandModule, CommandService } from "nestjs-command";

async function main() {
    const app = await NestFactory.createApplicationContext(CoreModule);
    app.select(CommandModule)
        .get(CommandService)
        .exec();
}
main();
