import { getSettings } from "./settings";

let isVisible = false;

export const showLockScreen = () => {
	if (isVisible) return;
	isVisible = true;

	const settings = getSettings();

	const container = document.body.createEl("div");
	Object.assign(container.style, {
		background: "var(--background-secondary)",
		position: "fixed",
		top: "0",
		bottom: "0",
		left: "0",
		right: "0",
		zIndex: "999999999",
		display: "flex",
	} as CSSStyleDeclaration);

	const checkPassword = (showError: boolean) => (e: Event) => {
		e.stopPropagation();
		e.preventDefault();

		if (input.value !== settings.password) {
			if (showError) {
				const { color } = input.style;
				input.style.color = "#C00";
				setTimeout(() => {
					input.style.color = color;
				}, 250);
			}
			return;
		}
		container.remove();
		isVisible = false;
	};

	const form = container.createEl("form");
	form.onsubmit = checkPassword(true);
	Object.assign(form.style, {
		margin: "auto",
		padding: "0 2rem",
	});

	const input = form.createEl("input");
	input.type = "password";

	Object.assign(input.style, {
		fontSize: "5rem",
		height: "auto",
		width: "100%",
		textAlign: "center",
		borderTop: "none",
		borderRight: "none",
		borderLeft: "none",
		boxShadow: "none",
	} as CSSStyleDeclaration);

	input.addEventListener("keydown", (e) => {
		if (e.key !== "Escape") return;
		input.value = "";
		input.focus();
	});

	input.addEventListener("keyup", checkPassword(false));

	input.focus();
};
