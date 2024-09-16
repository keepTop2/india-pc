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
 * @description: 开启体育sse线程
 * @param {Array} sportsEventSelect
 * @return {*}
 */
export const sportsOpenSse = (outrightBetObj: Array<any>) => {
	// 先关闭购物车线程
	sportsCloseSse();
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
			query: `$filter=leagueId in (${getEventIdCollection(outrightBetObj)})`,
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
 * @description: 处理选中冠军赛事ID (用于sse开启)
 * @param {Array} outrightBetObj
 * @return {*}
 */
export const getEventIdCollection = (outrightBetObj: Array<any>) => {
	const leagueIds: any = [];
	for (const key in outrightBetObj) {
		if (Object.prototype.hasOwnProperty.call(outrightBetObj, key)) {
			const leagueId = outrightBetObj[key].leagueId;
			if (!leagueIds.includes(leagueId)) {
				leagueIds.push(leagueId);
			}
		}
	}
	let requestStr = "";
	leagueIds.forEach((key, index) => {
		if (index != leagueIds.length - 1) {
			requestStr += key + ",";
		} else {
			requestStr += key;
		}
	});
	return requestStr;
};
