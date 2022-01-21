import * as o from "obsidian";
import { createSettingsTab } from "./create-settings-tab";
import { getSettings } from "./init-settings";

export const addSettingsTab = (plugin: o.Plugin) => {
	const settings = getSettings();

	plugin.addSettingTab(
		createSettingsTab(plugin, ({ containerEl }) => {
			new o.Setting(containerEl)
				.setName("Password")
				.setDesc("Lock screen password.")
				.addText((text) =>
					text.setValue(settings.password).onChange(async (value) => {
						settings.password = value;
						await plugin.saveData(settings);
					})
				);

			new o.Setting(containerEl)
				.setName("Delay before showing lock screen")
				.setDesc(
					o.Platform.isDesktopApp
						? "After the window loses focus, wait this many seconds before showing the lock screen."
						: "Show the lock screen after this many seconds without interaction."
				)
				.addText((text) =>
					text
						.setValue(String(settings.timeout / 1000))
						.onChange(async (value) => {
							const parsedVal = parseInt(value, 10) || 0;
							text.setValue(value ? String(parsedVal) : value);
							settings.timeout = parsedVal * 1000;
							await plugin.saveData(settings);
						})
				);
		})
	);
};
