/*
 * @Author: WangMingxin
 * @Description: 菜单管理；
 */
import { defineStore } from "pinia";

export const useActivityStore = defineStore("Activity", {
	state: () => {
		return {
			currentActivityData: {},
		};
	},
	getters: {
		/**
		 * @description: 左侧菜单是否是缩小
		 * @return {*}
		 */
		getCurrentActivityData(): any {
			return this.currentActivityData;
		},
	},

	actions: {
		/**
		 * @description: 左侧菜单是否是缩小
		 * @return {*}
		 */
		setCurrentActivityData(data: any) {
			this.currentActivityData = data;
		},
	},
});
