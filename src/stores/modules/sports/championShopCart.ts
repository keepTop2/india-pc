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
			sportsEventInfo: {} as any, // 储存当前选中的赛事盘口信息
			championBetData: [] as any[], // 冠军购物车数据
			championBetObj: {} as any, // 冠军购物车数据
			bettingStatus: 0,
			cartType: null as null | string,
		};
	},
	getters: {
		/**
		 * @description 获取储存当前选中的赛事盘口信息
		 */
		getEventInfo(): any {
			return this.sportsEventInfo;
		},
	},

	actions: {
		/**
		 * @description 添加冠军赛事到购物车
		 * @param data  赛事信息
		 */

		async addChampionToCart(data: any) {
			console.log("看看是否每次都会执行");
			// 判断登录状态
			const { isHaveToken } = useToLogin();
			try {
				await isHaveToken();
			} catch (error) {
				console.error("Error:", error);
				return; // 如果出错直接退出方法
			}

			// 冠军数据添加购物车
			if (data.type == "1") {
				const { leagueId } = data;
				const index = this.championBetData.findIndex((item) => item.leagueId === leagueId);
				if (index !== -1) {
					this.championBetData[index] = data;
				} else {
					if (this.championBetData.length >= 10) {
						// showToast($.t('sports["最多选择场比赛"]', { value: 10 }));
						console.log("最多选择十场比赛");
						return;
					}
				}
				this.championBetObj[leagueId] = data;
				this.championBetData.splice(index !== -1 ? index : this.championBetData.length, 1, data);
			}
			// 赛事数据添加购物车
			else if (data.type == "0") {
				const eventId = data.eventId;
				const existingIndex = this.championBetData.findIndex((item) => item.eventId === eventId);
				if (existingIndex !== -1) {
					// 当前数据对象已存在于数组中，替换它
					this.championBetData.splice(existingIndex, 1, data);
				} else if (this.championBetData.length >= 10) {
					// showToast($.t('sports["最多选择场比赛"]', { value: 10 }));
					console.log("最多选择十场比赛");
					return;
				} else {
					// 当前数据对象不存在于数组中，新增它
					this.championBetData.push(data);
				}
				// 赛事添加格式化数据
				this.processingInfo();
			}
			this.examineEventsStatus();
			console.log("最终处理完数据逻辑", this.championBetData);
		},

		processingInfo() {
			// 提取共同的处理逻辑
			const processEvent = (v: any) => {
				const eventInfo = this.sportsEventInfo[v.eventId];
				const { betType, marketId, selectionKey } = eventInfo;
				const market: any = Object.values(v.event.markets).find((item: any) => item.betType === betType && item.marketId === marketId) || {};
				v.event.betMarketInfo = {
					betType: betType,
					betTypeName: market.betTypeName,
					marketId: marketId,
					marketStatus: market.marketStatus,
					combo: market.combo || 0,
				};
				const selection = market.selections ? market.selections.find((s) => s.key === selectionKey) : null;
				if (selection) {
					v.event.betMarketInfo = {
						...v.event.betMarketInfo,
						key: selection.key,
						keyName: selection.keyName,
						point: selection.point,
						decimalPrice: selection.oddsPrice.decimalPrice,
					};
				}
			};
			// 获取第一条赛事数据
			const v = this.championBetData.find((item) => item.type === "0");
			// 进行格式化逻辑
			processEvent(v);
		},

		// 储存当前选中的赛事盘口信息
		async storeEventInfo(key: any, data: any) {
			const { isHaveToken } = useToLogin();
			try {
				await isHaveToken();
			} catch (error) {
				console.error("Error:", error);
				return; // 如果出错直接退出方法
			}
			if (!this.sportsEventInfo[key] && this.championBetData.length >= 10) {
				return;
			} else {
				this.sportsEventInfo[key] = data;
				// 拼接唯一标识
				this.sportsEventInfo[key].listKye = `${data.marketId}-${data.selectionKey}`;
				// 处理选中赛事ID
				this.getEventIdCollection();
			}
		},

		/**
		 * @returns 处理选中赛事ID
		 */
		getEventIdCollection() {
			let requestStr = "";
			const eventIdCollectionList = Object.keys(this.sportsEventInfo);
			eventIdCollectionList.forEach((key, index) => {
				if (index != eventIdCollectionList.length - 1) {
					requestStr += key + ",";
				} else {
					requestStr += key;
				}
			});
			return requestStr;
		},

		// 检测购物车状态，取第一位作为判断标识
		examineEventsStatus() {
			// if (this.championBetData.some((v) => v.event.oddsStatus !== "running")) {
			// 	this.bettingStatus = 1;
			// 	console.log("==>>>>>>>盘口关闭", 1);
			// 	return;
			// }
			// // 判断有没有达到选择赛事有没有超过一条
			if (this.championBetData.length > 1) {
				this.bettingStatus = 2;
				console.log("==>>>>>>>不支持串关", 2);
				return;
			}
			// this.bettingStatus = 0;
			if (this.championBetData.length > 0) {
				const firstItem = this.championBetData[0];
				if (firstItem.type == "0") {
					// 赛事数据逻辑
					this.cartType = "0";
					console.log("执行赛事数据逻辑", this.cartType);
					this.sportsOpenSse();
				} else if (firstItem.type == "1") {
					console.log("执行冠军数据逻辑", this.cartType);
					this.cartType = "1";
					this.championOpenSse();
				}
			}
		},

		// 开启体育购物车sse线程
		sportsOpenSse() {
			// 先关闭购物车线程
			workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
			// 开启购物车线程
			workerManage.startWorker(WorkerName.sportShopCartProcessWorker);
			const sportsInfoStore = useSportsInfoStore();
			const params: OpenSportEventSourceParams = {
				cartType: this.cartType,
				apiUrl: SportsCommonFn.getSportPushApiUrl(),
				token: sportsInfoStore.getSportsToken,
				language: SportsCommonFn.getSportLanguage(),
				sportPushApi: SportPushApi.GetEvents_push,
				webToPushApi: WebToPushApi.sportsShopCart,
				params: {
					query: `$filter=eventId in (${this.getEventIdCollection()})`,
				},
			};
			const viewsToWorkData: WorkerTransfer<OpenSportEventSourceParams, SportShopCartProcessWorkerCommandType> = {
				workerName: WorkerName.sportShopCartProcessWorker,
				commandType: SportShopCartProcessWorkerCommandType.sportsShopCartViewChanges,
				data: params,
			};
			//发送SSE指令到线程管理器
			pubsub.publish(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, viewsToWorkData);
		},

		// 关闭体育购物车sse线程
		sportsCloseSse() {
			workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
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
				cartType: this.cartType,
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
			console.log("data", data);
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
		removeChampionTEventCart(data: any) {
			const index = this.championBetData.findIndex((v) => v.leagueId == data.leagueId);
			this.championBetData.splice(index, 1);
			delete this.championBetObj[data.leagueId];
			this.examineEventsStatus();
			// 购物车数据为0停止线程
			// if (this.championBetData.length == 0) {
			// 	this.championCloseSse();
			// 	this.closeChampionShopCart();
			// }
		},

		// 删除添加的赛事数据
		removeEventCart(data: any) {
			// 匹配购物车赛事善书
			const index = this.championBetData.findIndex((v) => v.eventId == data.eventId);
			this.championBetData.splice(index, 1);
			// 同时删除高亮选中状态
			delete this.sportsEventInfo[data.eventId];
		},

		// 开启冠军购物车
		openChampionShopCart() {
			this.championOpenSse();
		},

		// 关闭冠军购物车
		closeChampionShopCart() {
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
