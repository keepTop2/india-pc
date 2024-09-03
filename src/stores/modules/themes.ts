import { defineStore } from "pinia";
// import ElementThemes from '/@/styles/elementTheme';
import { ThemeKey } from "/@/models/commonInterface";

interface ThemesStore {
	themeName: ThemeKey;
}

export const useThemesStore = defineStore("Themes", {
	state: (): ThemesStore => {
		return {
			themeName: (localStorage.getItem("Themes") as ThemeKey) || "light",
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
		setTheme(str: ThemeKey): void {
			this.themeName = str || "light";
			const link = document.getElementById("theme-link") as HTMLLinkElement;
			localStorage.setItem("Themes", str);
			if (link) {
				link.href = `/@/styles/themes/${this.themeName}.css`;
			} else {
				const newLink = document.createElement("link");
				newLink.id = "theme-link";
				newLink.rel = "stylesheet";
				newLink.href = `/@/styles/themes/${this.themeName}.css`;
				document.head.appendChild(newLink);
			}
		},
		initTheme() {
			this.setTheme(this.themeName);
		},
	},
});
