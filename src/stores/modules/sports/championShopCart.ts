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
			championBetShow: false as boolean,
			championBetData: [] as any[], // 冠军购物车数据
			championBetObj: {} as any, // 冠军购物车数据
			bettingStatus: 0,
		};
	},
	getters: {
		/**
		 * @description 获取储存当前选中的冠军盘口信息
		 */
		getChampionBetObj(): any {
			return this.championBetObj;
		},
	},

	actions: {
		/**
		 * @description 添加冠军赛事到购物车
		 * @param data  赛事信息
		 */
		async addChampionToCart(data) {
			const { isHaveToken } = useToLogin();
			try {
				await isHaveToken();
			} catch (error) {
				console.error("Error:", error);
				return; // 如果出错直接退出方法
			}
			const { leagueId } = data;
			const index = this.championBetData.findIndex((item) => item.leagueId === leagueId);
			if (index !== -1) {
				this.championBetData[index] = data;
			} else {
				if (this.championBetData.length >= 10) {
					// showToast($.t('sports["最多选择场比赛"]', { value: 10 }));
					return;
				}
			}
			this.championBetObj[leagueId] = data;
			this.championBetData.splice(index !== -1 ? index : this.championBetData.length, 1, data);
			this.championOpenSse(); // 开启线程
			this.examineEventsStatus(); // 判断赛事状态

			console.log("this.championBetObj", this.championBetObj);
			console.log("this.championBetData", this.championBetData);
		},

		examineEventsStatus() {
			if (this.championBetData.some((v) => v.oddsStatus !== "running")) {
				this.bettingStatus = 1;
				console.log("==>>>>>>>盘口关闭", 1);
				return;
			}
			// 判断有没有达到选择赛事有没有超过一条
			if (this.championBetData.length > 1) {
				this.bettingStatus = 2;
				console.log("==>>>>>>>不支持串关", 2);
				return;
			}
			this.bettingStatus = 0;
		},

		// 开启冠军购物车sse线程
		championOpenSse() {
			let requestStr = "";
			const eventIdCollectionList = Object.keys(this.championBetObj);
			eventIdCollectionList.forEach((key, index) => {
				if (index != eventIdCollectionList.length - 1) {
					requestStr += key + ",";
				} else {
					requestStr += key;
				}
			});
			console.log("requestStr", requestStr);
			// 先关闭购物车线程
			workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
			// 开启购物车线程
			workerManage.startWorker(WorkerName.sportShopCartProcessWorker);
			const sportsInfoStore = useSportsInfoStore();
			const params: OpenSportEventSourceParams = {
				apiUrl: SportsCommonFn.getSportPushApiUrl(),
				token: sportsInfoStore.getSportsToken,
				language: SportsCommonFn.getSportLanguage(),
				sportPushApi: SportPushApi.GetOutrights_push,
				webToPushApi: WebToPushApi.sportsShopCart,
				params: {
					query: `$filter=leagueId in (${requestStr})`,
				},
			};
			const viewsToWorkData: WorkerTransfer<OpenSportEventSourceParams, SportShopCartProcessWorkerCommandType> = {
				workerName: WorkerName.sportShopCartProcessWorker,
				commandType: SportShopCartProcessWorkerCommandType.championShopCartViewChanges,
				data: params,
			};
			//发送SSE指令到线程管理器
			pubsub.publish(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, viewsToWorkData);
		},

		// 关闭冠军购物车sse线程
		championCloseSse() {
			workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
		},

		/**
		 * @description SSE推送的最新冠军购物车数据
		 * @param data SSE推送数据源的数据
		 */
		championShopCartSSEProcess(data) {
			this.championBetData.forEach((v) => {
				const championIndex = data.findIndex((i) => i.leagueId === v.leagueId);
				data[championIndex].teams.forEach((t) => {
					if (t.orid == v.orid) {
						v = Object.assign({}, v, t);
					}
				});
			});
		},

		// 删除冠军购物车已添加的数据
		removeChampionTEventCart(data) {
			const index = this.championBetData.findIndex((v) => v.leagueId == data.leagueId);
			this.championBetData.splice(index, 1);
			delete this.championBetObj[data.leagueId];
			this.championOpenSse();
			this.examineEventsStatus();
			// 购物车数据为0停止线程
			if (this.championBetData.length == 0) {
				this.championCloseSse();
				this.closeChampionShopCart();
			}
		},

		// 开启冠军购物车
		openChampionShopCart() {
			this.championBetShow = true;
			this.championOpenSse();
		},

		// 关闭冠军购物车
		closeChampionShopCart() {
			this.championBetShow = false;
			this.championCloseSse();
		},

		// 清空冠军购物车
		clearChampionShopCart() {
			this.championBetData = [] as any[];
			this.championBetObj = {} as any;
			this.championCloseSse();
			this.closeChampionShopCart();
		},
	},
});
