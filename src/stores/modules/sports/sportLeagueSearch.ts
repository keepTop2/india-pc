import { defineStore } from "pinia";

interface sportLeagueSearchType {
	/** 选择的联赛 */
	sportsLeagueSelect: string[]; //
}

export const useSportLeagueSearchStore = defineStore("SportLeagueSearch", {
	state: (): sportLeagueSearchType => {
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
