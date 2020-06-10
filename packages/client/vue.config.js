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
    },
};
