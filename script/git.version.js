/* eslint-disable no-console */
const fs = require("fs").promises;
const path = require("path");
const chalk = require("chalk");
const gitdesc =  require("git-describe");

const gitFolderPath = path.resolve(__dirname, "..", ".git");
const packageFilePath = path.resolve(__dirname, "..", "package.json");

const packageFile = require(packageFilePath);

async function writeGitVersion () {
    try {
        await fs.access(gitFolderPath);
    } catch(error) {
        return console.log(chalk.red(`Could not access git repository ${gitFolderPath}`));
    }

    const info = await gitdesc.gitDescribe({
        longSemver: true,
        dirtySemver: false
    });

    if (info.semver) {
        packageFile.version = `${info.semver.major}.${info.semver.minor}.${info.distance}`;

        await fs.writeFile(
            packageFilePath,
            JSON.stringify(packageFile, null, 2),
            { encoding: "utf-8" }
        );
        console.log(chalk.green(`Version: ${packageFile.version}`));
    } else {
        console.log(chalk.red("Could not resolve semver"));
    }
}

writeGitVersion();
