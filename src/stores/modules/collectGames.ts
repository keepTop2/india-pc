/*
 * @Author: WangMingxin
 * @Description: 菜单管理；
 */
import { defineStore } from "pinia";
import { activityApi } from "/@/api/activity";

export const collectGamesStore = defineStore("collectGames", {
	state: () => {
		return {
			collectGamesList: {} as any,
		};
	},
	getters: {
		/**
		 * @description: 左侧菜单是否是缩小
		 * @return {*}
		 */
		getCollectGamesList(): any {
			return this.collectGamesList;
		},
	},

	actions: {
		setCollectGamesList(data: any) {
			this.collectGamesList = data;
		},
	},
});
