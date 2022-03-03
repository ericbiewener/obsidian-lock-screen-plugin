import * as o from "obsidian";
import { domService } from "./dom-service";
import { globalState } from "./global-state";
import { addSettingsTab, initSettings } from "./settings";
import { showLockScreen } from "./show-lock-screen";
import { addShowLockScreenCommand } from "./show-lock-screen-command";
import { showLockScreenWhenBackgrounded } from "./show-lock-screen-event-listeners";

export default class MyPlugin extends o.Plugin {
	async onload() {
		globalState.plugin = this;
		await initSettings();
		showLockScreen();
		addSettingsTab();
		addShowLockScreenCommand();
		showLockScreenWhenBackgrounded();

		this.app.workspace.getActiveViewOfType(o.MarkdownView)?.editor.focus();
	}

	async onunload() {
		domService.cleanUp();
	}
}
