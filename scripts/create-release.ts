import compareVersions from "compare-versions";
import inquirer from "inquirer";
import open from "open";
import "zx/globals";
import manifest from "../manifest.json";

const ROOT = path.join(__dirname, "..");
const MANIFEST_FILENAME = path.join(ROOT, "manifest.json");
const VERSIONS_FILENAME = path.join(ROOT, "versions.json");

const getVersion = async () => {
	const { releaseType } = await inquirer.prompt([
		{
			message: "Type of release change",
			name: "releaseType",
			type: "list",
			choices: ["patch", "minor", "major"],
		},
	]);

	const version = await $`npm version ${releaseType}`;
	return version.toString().slice(1).trim(); // remove leading "v", i.e. `v1.0.0` -> `1.0.0`
};

const writeManifest = (version: string) => {
	manifest.version = version;
	return fs.writeFile(
		MANIFEST_FILENAME,
		JSON.stringify(manifest, null, 2),
		"utf-8"
	);
};

const writeVersions = (version: string) => {
	const versions = require(VERSIONS_FILENAME);
	const appVersions: string[] = Object.values(versions);
	appVersions.sort(compareVersions);
	versions[version] = appVersions[appVersions.length - 1];
	return fs.writeFile(
		VERSIONS_FILENAME,
		JSON.stringify(versions, null, 2),
		"utf-8"
	);
};

const main = async () => {
	const version = await getVersion();
	await Promise.all([writeManifest(version), writeVersions(version)]);
	await $`git add .`;
	await $`git commit -m "bump version"`;
	await $`git push`;
	const releaseUrl =
		await $`gh release create ${version} --draft=0 --prerelease=0 --title=${version} --generate-notes`;
	open(releaseUrl.toString().trim());
};

main();
