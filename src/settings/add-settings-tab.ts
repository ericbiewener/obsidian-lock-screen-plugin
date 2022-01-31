import * as o from "obsidian";
import { createSettingsTab } from "./create-settings-tab";
import { getSettings } from "./init-settings";

const cleanNumericVal = (text: o.TextComponent, value: string) => {
	const parsedVal = parseInt(value, 10) || 0;
	text.setValue(value ? String(parsedVal) : value);
	return parsedVal;
};

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

			if (o.Platform.isDesktopApp) {
				new o.Setting(containerEl)
					.setName("Delay before showing lock screen (Desktop)")
					.setDesc(
						"After the window loses focus, wait this many seconds before showing the lock screen."
					)
					.addText((text) =>
						text
							.setValue(String(settings.timeoutWindowBlur / 1000))
							.onChange(async (value) => {
								const parsedVal = cleanNumericVal(text, value);
								settings.timeoutWindowBlur = parsedVal * 1000;
								await plugin.saveData(settings);
							})
					);
			} else {
				const setting = new o.Setting(containerEl)
					.setName("Delay before showing lock screen (Mobile)")
					.setDesc(
						"Show the lock screen after this many seconds without interaction."
					)
					.addText((text) =>
						text
							.setValue(
								String(settings.timeoutInteraction / 1000)
							)
							.onChange(async (value) => {
								const parsedVal = cleanNumericVal(text, value);
								settings.timeoutInteraction = Math.max(
									parsedVal * 1000,
									5000
								);
								await plugin.saveData(settings);
							})
					);

				const msgEl = setting.descEl.createEl("span");
				msgEl.classList.add("mod-warning");
				msgEl.innerText =
					" Values lower than 5s can make the app unusable and will therefore default to 5s instead.";
			}
		})
	);
};
