import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClientService } from "./modules/client/client.service";
import { UserService } from "./modules/users/user.service";
import { UserRole } from "./models/User";

async function init() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);
    const clientService = app.get(ClientService);

    await userService.create(
        "admin",
        "admin@admin.com",
        "123456",
        UserRole.ADMIN,
    );
    await clientService.create("web", "123456", ["password"], ["user:create"]);
}

init();
