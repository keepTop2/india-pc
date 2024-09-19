import workerManage from "/@/webWorker/workerManage";
import { SportShopCartProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import SportsCommonFn from "./common";
import { SportsRootObject, BetMarketInfo } from "/@/views/sports/models/interface";

import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import pubsub from "/@/pubSub/pubSub";
/**
 * @description:  处理购物车列表信息
 * @param {*} EventData
 * @param {*} EventInfo
 * @return {*}
 */
export const processingInfo = (sportEventData, EventInfo, closeMarketIds?: string[], differentBetTypeMarketIds?: string[], nobetsMarketIds?: [], unSeriesMarketIds?: string[]) => {
	let combo = 0;
	let EventData = JSON.parse(JSON.stringify(sportEventData));

	if (EventData.length === 1) {
		/** 处理单关逻辑 */
		EventData &&
			EventData.forEach((v) => {
				v.betMarketInfo = {} as BetMarketInfo;

				const market = v.markets[EventInfo[v.eventId].betType];

				v.betMarketInfo.betType = market.betType;
				v.betMarketInfo.betTypeName = market.betTypeName;
				v.betMarketInfo.marketId = market.marketId;

				if (closeMarketIds && closeMarketIds.length && closeMarketIds.indexOf(market.marketId) != -1) {
					v.betMarketInfo.marketStatus = "close";
				} else {
					v.betMarketInfo.marketStatus = market.marketStatus;
				}

				market.selections.forEach((selection) => {
					if (selection.key == EventInfo[v.eventId].selectionKey) {
						v.betMarketInfo.key = selection.key;
						v.betMarketInfo.keyName = selection.keyName;
						v.betMarketInfo.point = selection.point;
						v.betMarketInfo.decimalPrice = selection.oddsPrice.decimalPrice;
						v.betMarketInfo.oddsChange = selection?.oddsChange;
					}
				});
			});
	} else if (EventData.length > 1) {
		/** 处理串关逻辑 */
		let comparedIndex = null as null | number;
		// 先循环找出可以作为对比的赛事index
		for (let i = 0; i < EventData.length; i++) {
			const data = EventData[i];
			// 比赛盘口为关闭 赛事支持串关
			if (data.eventStatus === "running" && data.isParlay) {
				comparedIndex = i;
				break;
			}
		}
		combo = 0;
		EventData.forEach((v) => {
			v.betMarketInfo = {} as BetMarketInfo;
			// 如果球类不同 添加不同球类标识 不支持串关
			if (comparedIndex) {
				if (v.sportType != EventData[comparedIndex].sportType) {
					v.betMarketInfo.differentBalls = true;
				} else {
					delete v.betMarketInfo.differentBalls;
				}
			}

			const market = v.markets[EventInfo[v.eventId].betType];
			v.betMarketInfo.betType = market.betType;
			v.betMarketInfo.betTypeName = market.betTypeName;
			v.betMarketInfo.marketId = market.marketId.toString();
			/** 实时判断 不同球类类型(判断为不支持串关) */
			if (differentBetTypeMarketIds && differentBetTypeMarketIds.length && differentBetTypeMarketIds.includes(v.betMarketInfo.marketId)) {
				v.betMarketInfo.differentBalls = true;
			}
			/** 实时判断盘口是否关闭 */
			if (closeMarketIds && closeMarketIds.length && closeMarketIds.includes(v.betMarketInfo.marketId)) {
				v.betMarketInfo.marketStatus = "close";
			} else {
				v.betMarketInfo.marketStatus = market.marketStatus;
			}
			/** 是否支持串关  */
			v.betMarketInfo.combo = market.combo;
			if (market.combo > combo) {
				combo = market.combo;
			}
			try {
				/** 不同球内不支持串关 */
				const firstSportType = EventData[0].sportType;
				if (v.sportType != firstSportType) {
					v.betMarketInfo.combo = 0;
				}
			} catch (error) {}

			/** 实时判断 不支持串关 */
			if (unSeriesMarketIds && unSeriesMarketIds.length && unSeriesMarketIds.includes(v.betMarketInfo.marketId)) {
				v.betMarketInfo.combo = 0;
			}

			/** 实时判断暂时不支持下注  */
			if (nobetsMarketIds && nobetsMarketIds.length) {
				nobetsMarketIds.forEach((i) => {
					if (v.betMarketInfo.marketId == i.marketId) {
						v.betMarketInfo.stateCode = i.stateCode;
					}
				});
			}

			market.selections.forEach((selection) => {
				if (selection.key == EventInfo[v.eventId].selectionKey) {
					v.betMarketInfo.key = selection.key;
					v.betMarketInfo.keyName = selection.keyName;
					v.betMarketInfo.point = selection.point;
					v.betMarketInfo.decimalPrice = selection.oddsPrice.decimalPrice;
					v.betMarketInfo.oddsChange = selection?.oddsChange;
				}
			});
		});
	}
	return {
		combo,
		EventData,
	};
};

/**
 * @description: 判断盘口是否关闭；
 * @param {*} EventData 购物车数据；
 * @param {*} radioStatus 先判断自动接口赔率有无开启
 * @param {*} combo 串关最低数量
 * @return {*}  { 1 盘口关闭 2 不支持串关 3 未达到赛事数量最低要求 4 赔率变化 0 可下注 }
 */
export const examineEventsStatus = (EventData, radioStatus, combo): number => {
	let bettingStatus = 0;
	EventData.some((v) => {
		// 当前赛事信息关闭与选中盘口信息关闭则退出
		if (v.eventStatus !== "running" || v.betMarketInfo?.marketStatus !== "running") {
			bettingStatus = 1;
			return true;
		}
	});
	if (bettingStatus == 1) {
		return 1;
	}
	// 进行串关状态判断
	if (EventData.length > 1) {
		EventData.some((v) => {
			// 当前盘口信息球类标识是否相同 与 赛事小节为0 与 是否为串关赛事
			if (v.betMarketInfo?.differentBalls || v.betMarketInfo?.combo == 0 || !v.isParlay) {
				bettingStatus = 2; // 改变串关状态
				return true;
			}
		});
	}
	if (bettingStatus == 2) return 2;

	// 判断选择赛事的combo达到没 如未到提示
	if (EventData.length < combo) {
		return 3;
	}

	// 先判断自动接口赔率有无开启
	if (!radioStatus) {
		EventData.some((v) => {
			// 当前赛事信息赔率逼当时加入购物车时有下降
			if (v.betMarketInfo?.oddsChange == "oddsDown") {
				bettingStatus = 4;
				return true;
			}
		});
	}
	if (bettingStatus == 4) return 4;
	// 都支持则返回true
	bettingStatus = 0;
	return 0;
};

/**
 * @description: 开启体育sse线程
 * @param {Array} sportsEventSelect
 * @return {*}
 */
export const sportsOpenSse = (sportsEventInfo: Array<any>) => {
	// 先关闭购物车线程
	sportsCloseSse();
	// 开启购物车线程
	workerManage.startWorker(WorkerName.sportShopCartProcessWorker);
	const sportsInfoStore = useSportsInfoStore();
	const params: OpenSportEventSourceParams = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: sportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
		sportPushApi: SportPushApi.GetEvents_push,
		webToPushApi: WebToPushApi.sportsShopCart,
		params: {
			query: `$filter=eventId in (${getEventIdCollection(sportsEventInfo)})`,
		},
	};
	const viewsToWorkData: WorkerTransfer<OpenSportEventSourceParams, SportShopCartProcessWorkerCommandType> = {
		workerName: WorkerName.sportShopCartProcessWorker,
		commandType: SportShopCartProcessWorkerCommandType.sportsShopCartViewChanges,
		data: params,
	};
	//发送SSE指令到线程管理器
	pubsub.publish(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, viewsToWorkData);
};
/**
 * @description: 关闭购物车线程及sse查询
 * @return {*}
 */
export const sportsCloseSse = () => {
	try {
		workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
	} catch (error) {
		console.info(error);
	}
};

/**
 * @returns 处理选中赛事ID
 */
export const getEventIdCollection = (sportsEventInfo: Array<any>) => {
	let requestStr = "";
	const eventIdCollectionList = Object.keys(sportsEventInfo);
	eventIdCollectionList.forEach((key, index) => {
		if (index != eventIdCollectionList.length - 1) {
			requestStr += key + ",";
		} else {
			requestStr += key;
		}
	});
	return requestStr;
};
