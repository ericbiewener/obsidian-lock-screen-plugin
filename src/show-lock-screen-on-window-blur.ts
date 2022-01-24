import * as o from "obsidian";
import { getSettings } from "./settings";
import { showLockScreen } from "./show-lock-screen";

const showLockScreenAfterTimeout = () =>
	setTimeout(showLockScreen, getSettings().timeout);

const showLockScreenOnWindowBlur = (plugin: o.Plugin) => {
	let timeout: NodeJS.Timeout;

	plugin.registerDomEvent(window, "blur", () => {
		timeout = showLockScreenAfterTimeout();
	});

	plugin.registerDomEvent(window, "focus", () => {
		if (timeout) clearTimeout(timeout);
	});
};

type HTMLElementEvent = Parameters<o.Plugin["registerDomEvent"]>[1];

const showLockScreenWhenInteractionStops = (plugin: o.Plugin) => {
	let timeout = showLockScreenAfterTimeout();

	const resetTimeout = () => {
		clearTimeout(timeout);
		timeout = showLockScreenAfterTimeout();
	};

	const documentEvents: HTMLElementEvent[] = [
		"keydown",
		"keyup",
		"scroll",
		"mousemove",
		"mousedown",
		"mouseup",
		"touchstart",
		"touchend",
		"wheel",
	];

	for (const e of documentEvents) {
		plugin.registerDomEvent(document, e, resetTimeout);
	}
};

export const showLockScreenWhenBackgrounded = (plugin: o.Plugin) => {
	if (o.Platform.isDesktopApp) {
		showLockScreenOnWindowBlur(plugin);
	} else {
		showLockScreenWhenInteractionStops(plugin);
	}
};
