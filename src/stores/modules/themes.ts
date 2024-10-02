import { defineStore } from "pinia";
import { ThemeKey } from "/@/models/commonInterface";
import light from "../../styles/themes/light.css?raw";
import dark from "../../styles/themes/dark.css?raw";
interface ThemesStore {
	themeName: ThemeKey;
}
function applyTheme(cssContent: string) {
	const existingStyle = document.querySelector("style[data-theme]");
	if (existingStyle) {
		existingStyle.remove();
	}

	const style = document.createElement("style");
	style.type = "text/css";
	style.setAttribute("data-theme", "true");
	style.textContent = cssContent;
	document.head.appendChild(style);
}
export const useThemesStore = defineStore("Themes", {
	state: (): ThemesStore => {
		return {
			themeName: (localStorage.getItem("Themes") as ThemeKey) || "dark",
		};
	},
	getters: {
		getTheme(): any {
			return this.themeName || "default";
		},
	},
	actions: {
		/**
		 * @deprecated 全局主题切换
		 * @param str
		 */
		setTheme(str: ThemeKey) {
			this.themeName = str || "light";
			localStorage.setItem("Themes", str);
			if (str === "light") {
				applyTheme(light);
			} else if (str === "dark") {
				applyTheme(dark);
			}
		},
		initTheme() {
			this.setTheme(this.themeName);
		},
	},
});
