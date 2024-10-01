import { defineStore } from "pinia";
// import { showToast } from "vant";
import { i18n } from "/@/i18n/index";
import workerManage from "/@/webWorker/workerManage";
import { SportShopCartProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import pubsub from "/@/pubSub/pubSub";
import { useToLogin } from "/@/hooks/toLogin";
const $: any = i18n.global;

export const useSportsBetChampionStore = defineStore("sportsBetChampion", {
	state: () => {
		return {
			championBetData: [] as any[], // 冠军购物车数据
			championBetObj: {} as any, // 冠军购物车数据
			bettingStatus: 0,
		};
	},
	getters: {},

	actions: {
		/**
		 * @description 添加冠军赛事到购物车
		 * @param data  赛事信息
		 */

		async addChampionToCart(data: any) {
			const { isHaveToken } = useToLogin();
			try {
				await isHaveToken();
			} catch (error) {
				console.error("Error:", error);
				return; // 如果出错直接退出方法
			}
			this.championBetData.push(data);
			console.log("this.championBetData", this.championBetData);
		},
	},
});
