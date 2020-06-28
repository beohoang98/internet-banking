// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const { parsed } = require("dotenv").config();

const config = {
    ...(parsed || {}),
    ...process.env,
};

const DB_URL = !!config.MIGRATION
    ? config.PRODUCTION_DATABASE_URL
    : config.DATABASE_URL;

const IS_LOCALHOST =
    DB_URL.includes("localhost") ||
    DB_URL.includes("127.0.0.1") ||
    DB_URL.includes("0.0.0.0");

module.exports = {
    name: "default",
    type: DB_URL.split("://")[0],
    url: DB_URL,
    migrations: [path.resolve(__dirname, "dist/migrations/*{.ts,.js}")],
    subscribers: [path.resolve(__dirname, "dist/subscribers/*{.ts,.js}")],
    entities: [path.resolve(__dirname, "dist/models/*{.ts,.js}")],
    synchronize: config.NODE_ENV !== "production",
    logging: !!config.SQL_DEBUG,
    cli: {
        migrationsDir: "src/migrations",
        subscribersDir: "src/subscribers",
        entitiesDir: "src/models",
    },
    database: "internet_banking",
    extra: {
        ssl: !IS_LOCALHOST
            ? {
                  rejectUnauthorized: false,
              }
            : false,
    },
    migrationsRun: config.AUTO_MIGRATE,
};
