import { globalState } from "./global-state";
import { showLockScreen } from "./show-lock-screen";

export const addShowLockScreenCommand = () => {
	globalState.plugin.addCommand({
		id: "lock-screen",
		name: "Lock screen",
		callback: showLockScreen,
	});
};
