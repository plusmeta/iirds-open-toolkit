/* eslint-disable no-console */
import fs from "fs/promises";
import chalk from "chalk";
import gitdesc from "git-describe";

async function writeGitVersion () {
    try {
        await fs.access(".git");
    } catch(error) {
        return console.log(chalk.red("Could not access git repository"));
    }

    const info = await gitdesc.gitDescribe({
        longSemver: true,
        dirtySemver: false
    });

    if (info.semver) {
        const resolvedSemVer = `${info.semver.major}.${info.semver.minor}.${info.distance}`;

        // version.js
        const versionInfo = {
            version: resolvedSemVer,
            released: Date.now()
        };
        await fs.writeFile(
            "public/info/version.json",
            JSON.stringify(versionInfo, null, 2) + "\n",
            { encoding: "utf-8" }
        );

        // package.json
        const packageFile = await fs.readFile(
            "package.json",
            { encoding: "utf-8" }
        );
        const packageData = JSON.parse(packageFile);
        packageData.version = resolvedSemVer;

        await fs.writeFile(
            "package.json",
            JSON.stringify(packageData, null, 2) + "\n",
            { encoding: "utf-8" }
        );

        console.log(chalk.green(`Version: ${resolvedSemVer}`));
    } else {
        console.log(chalk.red("Could not resolve semver"));
    }
}

writeGitVersion();
