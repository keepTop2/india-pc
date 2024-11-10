/*
 * @Author: WangMingxin
 * @Description: 菜单管理；
 */
import { defineStore } from "pinia";
import { gameApi } from "/@/api/game";

export const useCollectGamesStore = defineStore("collectGames", {
	state: () => {
		return {
			collectGamesList: [] as any,
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
		setCollectGamesList() {
			gameApi.queryCollection().then((res) => {
				this.collectGamesList = res.data?.records;
			});
		},
	},
});
