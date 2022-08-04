import crawler from "license-checker";
import chalk from "chalk";

import copyleft from "./vendors.copyleft.js";

const options = {
    start: ".",
    failOn : copyleft.join(";"),
    json: true,
    production: true,
    excludePrivatePackages: true
};
// eslint-disable-next-line
console.log(chalk.green("Checking for copyleft licenses"));

crawler.init(options,
    function(error, res){
        if (error) {
            // eslint-disable-next-line
            console.error("Error:", error);
        }
        else {
            // eslint-disable-next-line
            console.log(crawler.asSummary(res));
        }
    }
);
