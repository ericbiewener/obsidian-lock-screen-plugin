import compareVersions from "compare-versions";
import inquirer from "inquirer";
import open from "open";
import yargs from "yargs";
import "zx/globals";
import manifest from "../manifest.json";

// @ts-ignore
const { tag } = yargs.option("tag", {
	alias: "t",
	describe: "new tag/version to create",
}).argv;

const ROOT = path.join(__dirname, "..");
const MANIFEST_FILENAME = path.join(ROOT, "manifest.json");
const VERSIONS_FILENAME = path.join(ROOT, "versions.json");

const getVersion = async () => {
	const { releaseType } = await inquirer.prompt([
		{
			message: "Type of release",
			name: "releaseType",
			type: "list",
			choices: ["major", "minor", "patch"],
		},
	]);

	console.info("releaseType", releaseType);
};

const writeManifest = () => {
	manifest.version = tag;
	return fs.writeFile(
		MANIFEST_FILENAME,
		JSON.stringify(manifest, null, 2),
		"utf-8"
	);
};

const writeVersions = () => {
	const versions = require(VERSIONS_FILENAME);
	const appVersions: string[] = Object.values(versions);
	appVersions.sort(compareVersions);
	versions[tag] = appVersions[appVersions.length - 1];
	return fs.writeFile(
		VERSIONS_FILENAME,
		JSON.stringify(versions, null, 2),
		"utf-8"
	);
};

const main = async () => {
	await getVersion();
	return;
	await Promise.all([writeManifest(), writeVersions()]);
	await $`git add .`;
	await $`git commit -m "bump version"`;
	await $`git push`;
	const releaseUrl =
		await $`gh release create ${tag} --draft=0 --prerelease=0 --title=${tag} --generate-notes`;
	open(releaseUrl.toString());
};

main();
