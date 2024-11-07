import { defineStore } from "pinia";
/**
 * 1: 窗口大于1440，
 * 2: 窗口大于1024，
 * 3: 窗口小于1024，
 */
export const useLayoutStore = defineStore("layout", {
	state: () => {
		return {
			layoutType: 1,
		};
	},
	getters: {
		getLayoutType(): any {
			return this.layoutType;
		},
	},
	actions: {
		setLayoutType(value: number) {
			this.layoutType = value;
		},
	},
});
