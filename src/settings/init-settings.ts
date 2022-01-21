import * as o from "obsidian";

export type Settings = {
	password: string;
	timeout: number;
};

const settings: Settings = {
	password: "foobar",
	timeout: 30000,
};

let hasInitialized = false;

export const initSettings = async (plugin: o.Plugin) => {
	Object.assign(settings, await plugin.loadData());
	hasInitialized = true;
	return settings;
};

export const getSettings = () => {
	if (hasInitialized) return settings;
	throw new Error("getSettings() called before initSettings() has finished");
};
