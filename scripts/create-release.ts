import compareVersions from "compare-versions";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";
import { $ } from "zx";

// @ts-ignore
const { tag } = yargs.option("tag", {
	alias: "t",
	describe: "new tag/version to create",
	required: true,
}).argv;

const ROOT = path.join(__dirname, "..");

const writeManifest = () => {
	const manifestFilename = path.join(ROOT, "manifest.json");
	const manifest = require(manifestFilename);
	manifest.version = tag;
	return fs.writeFile(
		manifestFilename,
		JSON.stringify(manifest, null, 2),
		"utf-8"
	);
};

const writeVersions = () => {
	const versionsFilename = path.join(ROOT, "versions.json");
	const versions = require(versionsFilename);
	const appVersions: string[] = Object.values(versions);
	appVersions.sort(compareVersions);
	versions[tag] = appVersions[appVersions.length - 1];
	return fs.writeFile(
		versionsFilename,
		JSON.stringify(versions, null, 2),
		"utf-8"
	);
};

const main = async () => {
	await Promise.all([writeManifest(), writeVersions()]);
	await $`git add .`;
	await $`git commit -m "bump version"`;
	await $`git push`;
	await $`gh release create ${tag} --draft=0 --prerelease=0 --title=${tag} --generate-notes`;
};

main();
