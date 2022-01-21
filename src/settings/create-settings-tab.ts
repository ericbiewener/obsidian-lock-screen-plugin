import * as o from 'obsidian';

export const createSettingsTab = (
	plugin: o.Plugin,
	display: (tab: o.PluginSettingTab) => void
) => {
	class SettingTab extends o.PluginSettingTab {
		plugin: o.Plugin;
		hasDisplayed = false

		constructor(plugin: o.Plugin) {
			super(plugin.app, plugin);
		}

		display() {
			if (this.hasDisplayed) return
			display(this);
			this.hasDisplayed = true
		}
	}

	return new SettingTab(plugin);
};
