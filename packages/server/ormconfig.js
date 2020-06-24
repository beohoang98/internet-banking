// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const { parsed } = require("dotenv").config();

const config = {
    ...(parsed || {}),
    ...process.env,
};

module.exports = {
    name: "default",
    type: config.DATABASE_URL.split("://")[0],
    url: config.DATABASE_URL,
    migrations: [path.resolve(__dirname, "dist/migrations/*{.ts,.js}")],
    subscribers: [path.resolve(__dirname, "dist/subscribers/*{.ts,.js}")],
    entities: [path.resolve(__dirname, "dist/models/*{.ts,.js}")],
    synchronize: config.NODE_ENV !== "production",
    logging: !!config.SQL_DEBUG,
    cli: {
        migrationsDir: path.resolve(__dirname, "src/migrations"),
        subscribersDir: path.resolve(__dirname, "src/subscribers"),
        entitiesDir: path.resolve(__dirname, "src/models"),
    },
    database: "internet_banking",
};
