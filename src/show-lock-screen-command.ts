import * as o from "obsidian";
import { showLockScreen } from "./show-lock-screen";

export const addShowLockScreenCommand = (
	plugin: o.Plugin,
) => {
	plugin.addCommand({
		id: "lock-screen",
		name: "Lock screen",
		callback: showLockScreen,
	});
};
