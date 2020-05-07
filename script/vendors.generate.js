/* eslint-disable no-console */
const crawler = require("npm-license-crawler");
const chalk = require("chalk");

const options = {
    start: ["."],
    json: "./src/config/legal/vendors.json",
    dependencies: true,
    production: true,
    onlyDirectDependencies: true,
    omitVersion: true,
};

console.log(chalk.green("Getting 3rd party licenses"));

crawler.dumpLicenses(options,
    function(error, res){
        if (error) {
            console.error("Error:", error);
        }
        else {
            console.table(res, ["licenses", "repository"]);
        }
    }
);