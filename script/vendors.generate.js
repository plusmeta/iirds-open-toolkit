import fs from "fs/promises";
import crawler from "license-checker";
import chalk from "chalk";

const options = {
    start: ".",
    json: true,
    production: true,
    relativeLicensePath: true,
    excludePrivatePackages: true
};
// eslint-disable-next-line
console.log(chalk.green("Getting 3rd party licenses"));

crawler.init(options,
    async function(error, res){
        if (error) {
            // eslint-disable-next-line
            console.error("Error:", error);
        }
        else {
            await fs.writeFile(
                "src/config/legal/vendors.json",
                JSON.stringify(res, null, 2) + "\n",
                { encoding: "utf-8" }
            );
            // eslint-disable-next-line
            console.table(res, ["licenses", "repository"]);
        }
    }
);
