/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require("path");
const { parsed = {} } = require("dotenv").config();

/**
 *
 * @type {typeof NodeJS.Process.env}
 */
const config = {
    ...parsed,
    ...process.env,
};

/**
 *
 * @type { import("@vue/cli-service").ProjectOptions }
 */
const projectConfig = {
    lintOnSave: !config.NO_ESLINT,
    parallel: true,
    chainWebpack(config) {
        if (config.NO_TS) {
            config.plugins.delete("fork-ts-checker");
        }
        config.resolve.alias["@backend"] = resolve(
            __dirname,
            "..",
            "server/src",
        );
        // config.entryPoints.delete('app');
        // config.entry('app')
        //     .add({
        //         entry: 'src/main.ts',
        //         template: 'public/app.html',
        //         filename: 'app/index.html',
        //     })
        //     .end()
        //     .entry('admin')
        //     .add({
        //         entry: 'src/admin.ts',
        //         template: 'public/admin.html',
        //         filename: 'admin/index.html',
        //     })
        //     .end();

        return config;
    },
    pages: {
        app: {
            entry: "src/main.ts",
            template: "public/app.html",
            filename: "app/index.html",
            title: "Client",
        },
        admin: {
            entry: "src/admin.ts",
            template: "public/admin.html",
            filename: "admin/index.html",
            title: "Admin",
        },
    },
    pluginOptions: {
        options: {
            filename: "[name]_[hash].[ext]",
        },
    },
};

module.exports = projectConfig;
