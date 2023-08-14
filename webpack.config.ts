import path from "path";
import { Configuration, Compiler } from "webpack";
import fse from "fs-extra";
import assert from "assert";
import globby from "globby";

const isProd = process.env.NODE_ENV === "production";
const pluginSrc = path.join(__dirname, "src/plugins");

type Env = {
	"lock-screen"?: boolean;
};

const getPlugin = async (env: Env) => {
	const pluginDirs = await globby(path.join(pluginSrc, "*"), {
		onlyDirectories: true,
		expandDirectories: false,
	});
	const plugins = pluginDirs.map((p) => path.basename(p));
	console.info(`:: plugins`, plugins);
	const plugin = Object.keys(env).find((p) => plugins.includes(p));
	assert(plugin);
	return plugin;
};

export default async (env: Env): Promise<Configuration> => {
	console.info(`:: env`, env);
	const plugin = await getPlugin(env);
	const src = path.join(pluginSrc, plugin);
	const dist = path.join(__dirname, "dist", plugin);

	return {
		target: "node",
		mode: "none",
		entry: path.join(src, "index.ts"),
		output: {
			path: dist,
			libraryTarget: "commonjs2",
		},
		externals: {
			electron: "commonjs2 electron",
			obsidian: "commonjs2 obsidian",
		},
		resolve: {
			extensions: [".ts"],
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "ts-loader",
						},
					],
				},
			],
		},
		plugins: [
			{
				apply: (compiler: Compiler) => {
					compiler.hooks.afterEmit.tap(
						"AfterEmitPlugin",
						postBuild(plugin, src, dist),
					);
				},
			},
		],
		devtool: isProd ? "none" : "source-map",
	};
};

const MANIFEST_FILE = "manifest.json";

const postBuild = (plugin: string, src: string, dist: string) => async () => {
	await fse.copyFile(
		path.join(src, MANIFEST_FILE),
		path.join(dist, MANIFEST_FILE),
	);
	await fse.copy(
		dist,
		path.join(
			"/Users/e0b02rp/Library/CloudStorage/OneDrive-WalmartInc/Notes/.obsidian/plugins",
			plugin,
		),
	);
	console.info("✅ Copied plugin to vault.");
};
