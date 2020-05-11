// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const { parsed } = require("dotenv").config();

const config = {
    ...(parsed || {}),
    ...process.env,
};

module.exports = {
    name: "default",
    type: config.TYPEORM_TYPE || "postgres",
    database: config.TYPEORM_DATABASE || "bank_db",
    username: config.TYPEORM_USERNAME || "admin",
    password: config.TYPEORM_PASSWORD || "123456",
    host: config.TYPEORM_HOST || "localhost",
    port: config.TYPEORM_PORT || 5432,
    migrations: [path.resolve(__dirname, "dist/migrations/*{.ts,.js}")],
    subscribers: [path.resolve(__dirname, "dist/subscribers/*{.ts,.js}")],
    entities: [
        path.resolve(__dirname, "dist/models/*{.ts,.js}"),
        path.resolve(
            "../nestjs-oauth2-server-module/dist",
            "**/*.entity{.js,.ts}",
        ),
    ],
    synchronize: config.NODE_ENV !== "production",
    debug: config.SQL_DEBUG,
    cli: {
        migrationsDir: path.resolve(__dirname, "src/migrations"),
        subscribersDir: path.resolve(__dirname, "src/subscribers"),
        entitiesDir: path.resolve(__dirname, "src/models"),
    },
};
