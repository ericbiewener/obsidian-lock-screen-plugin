import * as o from "obsidian";
import { addShowLockScreenCommand } from "./show-lock-screen-command";
import { initSettings, addSettingsTab } from "./settings";
import { showLockScreenWhenBackgrounded } from "./show-lock-screen-on-window-blur";
import { showLockScreen } from './show-lock-screen'
import { domService } from './dom-service'

export default class MyPlugin extends o.Plugin {
	async onload() {
		await initSettings(this);
		showLockScreen()
		addSettingsTab(this);
		addShowLockScreenCommand(this);
		showLockScreenWhenBackgrounded(this);
	}

	async onunload() {
		domService.cleanUp()
	}
}
