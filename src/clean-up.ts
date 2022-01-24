type HTMLElementName = keyof HTMLElementTagNameMap;

const ids: string[] = [];

export const cleanupService = {
	cleanUp: () => {
		for (const id of ids) {
			document.getElementById(id)?.remove();
		}
	},
	createEl: (parentEl: HTMLElement, elType: HTMLElementName, id: string) => {
		const el = parentEl.createEl(elType);
		el.id = id;
		ids.push(id);
		return el;
	},
};
