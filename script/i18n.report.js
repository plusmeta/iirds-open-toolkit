const path = require("path");
const chalk = require("chalk");
const i18nExtract = require("vue-i18n-extract").default;

function reportMissingKeys () {
    const currentDir = process.cwd();
    const srcFiles = path.resolve(currentDir, "./src/**/*.?(js|vue)");
    const localeFiles = path.resolve(currentDir, "./src/i18n/locales/**/*.json");
    const extractType = 1; // EXTRACT_MISSING = 1; EXTRACT_UNUSED = 2; EXTRACT_ALL = 3;

    const i18nReport = i18nExtract.createI18NReport(srcFiles, localeFiles, extractType);
    i18nExtract.logI18NReport(i18nReport);
    if (i18nReport.missingKeys.length) {
        console.log(chalk.red("Missing keys detected!\n"));
        process.exit(1);
    } else {
        console.log(chalk.green("No missing keys found!\n"));
        process.exit(0);
    }

}

reportMissingKeys();
