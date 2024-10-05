// 热门联赛
import { defineStore } from "pinia";

interface PopularLeagueType {
	/** 热门联赛是否显示 */
	visible: boolean;
}

export const usePopularLeague = defineStore("popularLeague", {
	state: (): PopularLeagueType => {
		return {
			visible: true,
		};
	},
	actions: {
		/** 显示热门联赛 */
		showPopularLeague() {
			console.log("触发了1");
			this.visible = true;
		},
		/** 隐藏热门联赛 */
		hidePopularLeague() {
			console.log("触发了2");
			this.visible = false;
		},
	},
});
