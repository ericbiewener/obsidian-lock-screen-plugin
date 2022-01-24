import * as o from "obsidian";
import { domService } from "./dom-service";
import { addSettingsTab, initSettings } from "./settings";
import { showLockScreen } from "./show-lock-screen";
import { addShowLockScreenCommand } from "./show-lock-screen-command";
import { showLockScreenWhenBackgrounded } from "./show-lock-screen-on-window-blur";

export default class MyPlugin extends o.Plugin {
	async onload() {
		await initSettings(this);
		showLockScreen();
		addSettingsTab(this);
		addShowLockScreenCommand(this);
		showLockScreenWhenBackgrounded(this);
	}

	async onunload() {
		domService.cleanUp();
	}
}
