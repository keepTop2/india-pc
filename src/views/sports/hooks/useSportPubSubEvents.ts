/**
 * @description 体育订阅数据处理 hooks
 * @description 用于处理体育相关的订阅数据，包括监听SSE数据、处理线程管理器发送的数据、以及与视图数据的交互。
 * - 监听服务器发送事件（SSE）数据。
 * - 处理来自线程管理器的已处理数据。
 * - 维护与更新视图界面所需的数据状态。
 * @returns {{
 *   state: SportViewState,          // 当前的体育视图数据状态
 *   initSportPubsub: Function,      // 初始化体育订阅事件的函数
 *   unSubSport: Function,           // 取消体育订阅事件的函数
 *   clearState: Function           // 用于清空视图数据状态，常用于切换Tab时
 * }}
 */

import { reactive, watch } from "vue";
import pubsub from "/@/pubSub/pubSub";
import { ServerData } from "/@/models/commonInterface";
import { Sports, SportData, SportViewData } from "/@/views/sports/models/interface";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
import Common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import { useUserStore } from "/@/stores/modules/user";
import { WebToPushApi, SportPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import { OddsChangeParam, SportViewModels, WorkerToviewSport, WorkerToViewSportsShopCart } from "/@/views/sports/models/sportViewModels";
import { SportViewProcessWorkerCommandType, WorkerName, WorkerCommonCommadnType, SportShopCartProcessWorkerCommandType } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import { useLoading } from "/@/directive/loading/hooks";
import viewSportPubSubEventData from "./viewSportPubSubEventData";

const { stopLoading } = useLoading();
export default function useSportPubSubEvents() {
	const sportsBetEvent = useSportsBetEventStore();
	const ChampionShopCart = useChampionShopCartStore();

	//体育订阅事件
	const initSportPubsub = () => {
		// //订阅SSE推送数据
		// pubsub.subscribe(pubsub.PubSubEvents.SSEEvents.receiver.eventName, pubSportWoker);
		//订阅线程管理器处理好的事件
		pubsub.subscribe(pubsub.PubSubEvents.WorkerEvents.workerToView.eventName, workerToviewSportProcess);

		//订阅子路由视图数据发生变化事件
		// pubsub.subscribe(pubsub.PubSubEvents.SportEvents.childrenViewChange.eventName, childrenViewChangeProcess);
		//订阅子路由子路由初始化视图数据
		// pubsub.subscribe(pubsub.PubSubEvents.SportEvents.initChildrenView.eventName, initChildrenViewProcess);
	};

	//取消订阅体育事件
	const unSubSport = () => {
		// clearState();
		// //取消订阅SSE推送数据
		// pubsub.unsubscribe(pubsub.PubSubEvents.SSEEvents.receiver.eventName, pubSportWoker);
		//取消订阅线程管理器处理好数据事件
		pubsub.unsubscribe(pubsub.PubSubEvents.WorkerEvents.workerToView.eventName, workerToviewSportProcess);
		// //取消订阅订阅子路由视图数据发生变化事件
		// pubsub.unsubscribe(pubsub.PubSubEvents.SportEvents.childrenViewChange.eventName, childrenViewChangeProcess);
		// //取消订阅子路由子路由初始化视图数据
		// pubsub.unsubscribe(pubsub.PubSubEvents.SportEvents.initChildrenView.eventName, initChildrenViewProcess);
	};

	// 体育登录
	const sportsLogin = async () => {
		const store = useUserStore();
		const sportsInfoStore = useSportsInfoStore();
		const params = {
			userAccount: store.userInfo.userAccount,
			device: "H5",
			venueCode: "SBA",
		};
		try {
			let res: any;
			if (store.userInfo.token) {
				res = await sportsApi.sportsLogin(params).catch((err) => err);
			} else {
				res = await sportsApi.sbaAnonLogin(params).catch((err) => err);
			}
			if (res.code === Common.ResCode.SUCCESS) {
				if (res.data.type === "token") {
					sportsInfoStore.setSportsToken(res.data.source);
				}
			}
			return res; // 返回 res
		} catch (err) {
			return ""; // 返回错误对象
		}
	};

	/**
	 * @description 切换tab时清空数据
	 */
	const clearState = () => {
		viewSportPubSubEventData.clearState();
	};

	/**
	 * @description 用于初始化赔率状态 oddsChange 将要重置的盘口id与对应的赔率传入体育线程，更新数据。
	 */
	const clearSportsOddsChange = (data: OddsChangeParam) => {
		//线程名称 体育视图处理线程
		pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
		//线程指令 更新赔率sportOddsChange 指令
		pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportOddsChange;
		//清空参数
		pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OddsChangeParam;
		//参数赋值
		pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = data;
		//发送指令到线程管理器 清理oddsChange
		// 重点的入参为 oddsChange  传入 marketId 与 对应的盘口内容用于做数据匹配
		pubsub.publish(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubsub.PubSubEvents.WorkerEvents.viewToWorker.params);
	};

	//收到线程处理好的数据
	const workerToviewSportProcess = <T, T2>(event: WorkerTransfer<T, T2>) => {
		// console.warn("第九步 视图收到线程管理器发送的数据", event);
		//体育视图处理线程
		if (event.workerName == WorkerName.sportViewProcessWorker) {
			const processData: WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerCommandType> = event as WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerCommandType>;
			// console.log(event, "视图收到线程处理好的数据");
			//体育视图处理线程 eventSource 指令
			if (processData.commandType == SportViewProcessWorkerCommandType.sportEventSource) {
				// if (processData.data.sportPushApi != SportPushApi.GetSports_push) {
				//冠军赋值单独赋值
				// if (processData.data.webToPushApi == WebToPushApi.eventsChampion) {
				viewSportPubSubEventData.setSportData(processData.data.state.viewSportData);
				// }
				// viewSportPubSubEventData.setSportData(processData.data.state.viewSportData);
				// pubsub.publish(pubsub.PubSubEvents.SportEvents.sportsToChildren.eventName, viewSportPubSubEventData);
				// pubsub.publish(pubsub.PubSubEvents.SportEvents.childrenViewChange.eventName, state);
				// }
				//球类赋值
				// 	else {
				// 		console.log("球类赋值");
				// 		viewSportPubSubEventData.setSportData(processData.data.state.viewSportData);
				// 	}
			}
			// 体育视图处理线程 赔率变更 指令
			else if (processData.commandType == SportViewProcessWorkerCommandType.sportOddsChange) {
				console.log("赔率处理");
			}
			//体育视图处理线程 取消loading 指令
			else if (processData.commandType == WorkerCommonCommadnType.stopLoading) {
				stopLoading();
			}
		}
		//体育购物车线程
		else if (event.workerName == WorkerName.sportShopCartProcessWorker) {
			const processData: WorkerTransfer<WorkerToViewSportsShopCart<any>, SportShopCartProcessWorkerCommandType> = event as WorkerTransfer<
				WorkerToViewSportsShopCart<any>,
				SportShopCartProcessWorkerCommandType
			>;
			if (processData.commandType == SportShopCartProcessWorkerCommandType.sportsShopCartViewChanges) {
				/** 联赛-数据推送 */
				sportsBetEvent.shopCartSSEProcess(processData.data?.data?.sportsBetEventData);
			}
			if (processData.commandType == SportShopCartProcessWorkerCommandType.outrightShopCartViewChanges) {
				/** 冠军-数据推送 */
				ChampionShopCart.outrightShopCartSSEProcess(processData.data.data?.outrightBetData);
			}
		}
	};

	/**
	 * @description  收到子路由视图数据变化事件处理
	 * @param data
	 */
	// const childrenViewChangeProcess = (data: SportViewModels) => {
	// 	//由于滚球 早盘 今日 需要操作盘口，在这里更新盘口数据  每次赋值影响不大 不做额外判断
	// 	viewSportPubSubEventData.viewSportData.childrenViewData = data.viewSportData.childrenViewData;
	// };

	/**
	 * @description 收到子路由初始化视图数据事件
	 */
	// const initChildrenViewProcess = () => {
	// 	// console.log("收到子路由初始化视图数据事件,===========================");
	// 	pubsub.publish(pubsub.PubSubEvents.SportEvents.sportsToChildren.eventName, viewSportPubSubEventData);
	// };

	return { initSportPubsub, unSubSport, clearState, sportsLogin, clearSportsOddsChange };
}
