/*
 * @Author: WangMingxin
 * @Description: 体育-搜素
 */
import { defineStore } from "pinia";

import { SportsRootObject, BetMarketInfo } from "/@/models/interface";

interface sportLeagueSeachType {
	/** 选择的联赛 */
	sportsLeagueSelect: string[]; //
}

export const useSportLeagueSeachStore = defineStore("SportLeagueSeach", {
	state: (): sportLeagueSeachType => {
		return {
			sportsLeagueSelect: [], // 选择的联赛
		};
	},
	getters: {
		/**
		 * @description 获取选中的联赛筛选
		 */
		getLeagueSelect(): Array<string> {
			return this.sportsLeagueSelect;
		},
	},

	actions: {
		/**
		 * @description:存储选中的联赛
		 * @param {SportsRootObject} data
		 * @return {*}
		 */
		setSportsLeagueSelect(data: string[]) {
			this.sportsLeagueSelect = data;
		},
		/**
		 * @description: 	清除选中的联赛
		 * @return {*}
		 */
		clearLeagueSelect() {
			this.sportsLeagueSelect = [];
		},
	},
});
