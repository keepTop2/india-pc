import { defineStore } from "pinia";
// import ElementThemes from '/@/styles/elementTheme';
import { ThemeKey } from "/@/models/commonInterface";

interface ThemesStore {
	themeName: ThemeKey;
}

export const useThemesStore = defineStore("Themes", {
	state: (): ThemesStore => {
		return {
			themeName: "default",
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
		setTheme(str?: ThemeKey) {
			this.themeName = str || "default";
			//设置scss主题色
			document.getElementsByTagName("body")[0].setAttribute("data-theme", this.themeName);
			// const elementThemes: ElementThemes = new ElementThemes();
			//设置element主题色
			// elementThemes.setElementThemes(str);
		},
	},
	persist: {
		key: "Themes",
		storage: sessionStorage,
		paths: ["themeName"],
	},
});
