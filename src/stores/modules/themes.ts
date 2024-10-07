import { defineStore } from "pinia";
import { ThemeKey } from "/@/models/commonInterface";
import light from "../../styles/themes/light.css?raw";
import dark from "../../styles/themes/dark.css?raw";

interface ThemesStore {
	themeName: ThemeKey;
}

const applyTheme = (cssContent: string) => {
	const existingStyle = document.querySelector("style[data-theme]");
	existingStyle?.remove();

	const style = document.createElement("style");
	style.setAttribute("data-theme", "true");
	style.textContent = cssContent;
	document.head.appendChild(style);
};

export const useThemesStore = defineStore("Themes", {
	state: (): ThemesStore => ({
		themeName: (localStorage.getItem("Themes") as ThemeKey) || "dark",
	}),
	getters: {
		getTheme: (state): ThemeKey => state.themeName || "default",
	},
	actions: {
		setTheme(theme: ThemeKey = "light") {
			this.themeName = theme;
			localStorage.setItem("Themes", theme);
			applyTheme(theme === "light" ? light : dark);
		},
		initTheme() {
			this.setTheme(this.themeName);
		},
	},
});
