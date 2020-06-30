// eslint-disable-next-line @typescript-eslint/no-var-requires
const { parsed = {} } = require("dotenv").config();

/**
 *
 * @type {typeof NodeJS.Process.env}
 */
const config = {
    ...parsed,
    ...process.env,
};

module.exports = {
    lintOnSave: !config.NO_ESLINT,
    chainWebpack(config) {
        if (config.NO_TS) {
            config.plugins.delete("fork-ts-checker");
        }
        return config;
    },
    pages: {
        index: {
            entry: "src/main.ts",
            template: "public/index.html",
            filename: "index.html",
        },
        admin: {
            entry: "src/admin.ts",
            template: "public/admin.html",
            filename: "admin/index.html",
            title: "Admin",
        },
    },
};
