import { defineStore } from "pinia";
// import ElementThemes from '/@/styles/elementTheme';
import { ThemeKey } from "/@/models/commonInterface";

export interface ThemesStore {
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
			if (document.microAppElement.getElementsByTagName("micro-app-body") && document.microAppElement.getElementsByTagName("micro-app-body").length > 0) {
				// console.log(document.microAppElement.getElementsByTagName("micro-app-body"), "看看这边的");
				document.microAppElement.getElementsByTagName("micro-app-body")[0].setAttribute("data-theme", this.themeName);
			}
		},
	},
	//子应用通用数据放内存中即可 无需缓存
	// persist: {
	// 	key: "Themes",
	// 	storage: sessionStorage,
	// 	paths: ["themeName"],
	// },
});
