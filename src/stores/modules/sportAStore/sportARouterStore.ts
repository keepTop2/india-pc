import { defineStore } from "pinia";
// import { ThemeKey } from "/@/models/commonInterface";

export interface sportARouterStoreState {
	/**
	 * @description 小容器最后一次路由
	 */
	sporALastRouter: string;
}

export const useSportARouterStore = defineStore("sportARouterStore", {
	state: (): sportARouterStoreState => {
		return {
			//小容器去大容器最后一次路由
			sporALastRouter: "",
		};
	},
	getters: {
		getLastRouter(): any {
			return this.sporALastRouter;
		},
	},
	actions: {
		/**
		 * @description 设置后一次路由
		 * @param str
		 */
		setSportALastRouter(str?: string) {
			this.sporALastRouter = str || "";
		},
	},
	persist: {
		key: "sportARouterStore",
		storage: sessionStorage,
		paths: ["sporALastRouter"],
	},
});
