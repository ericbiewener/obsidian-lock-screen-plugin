import * as o from "obsidian";

const settings = {
	password: "",
	timeoutWindowBlur: 30000,
	timeoutInteraction: 30000,
};

export type Settings = typeof settings;

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
