// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const { parsed } = require("dotenv").config();

const config = {
    ...(parsed || {}),
    ...process.env,
};

module.exports = {
    name: "default",
    url: parsed.DATABASE_URL,
    migrations: [path.resolve(__dirname, "dist/migrations/*{.ts,.js}")],
    subscribers: [path.resolve(__dirname, "dist/subscribers/*{.ts,.js}")],
    entities: [
        path.resolve(__dirname, "dist/models/*{.ts,.js}"),
        path.dirname(require.resolve("@switchit/nestjs-oauth2-server"))
         + "/**/*.entity{.js,.ts}",
    ],
    synchronize: config.NODE_ENV !== "production",
    debug: config.SQL_DEBUG,
    cli: {
        migrationsDir: path.resolve(__dirname, "src/migrations"),
        subscribersDir: path.resolve(__dirname, "src/subscribers"),
        entitiesDir: path.resolve(__dirname, "src/models"),
    },
};
