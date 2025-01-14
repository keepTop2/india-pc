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
// import { ServerData } from "/@/models/commonInterface";
import { Sports, SportData, SportViewData } from "/@/views/sports/models/interface";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import Common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import { useUserStore } from "/@/stores/modules/user";
import { WebToPushApi, SportPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import { OddsChangeParam, SportViewModels, WorkerToviewSport, WorkerToViewSportsShopCart } from "/@/views/sports/models/sportViewModels";
import { SportViewProcessWorkerApi, WorkerName, WorkerCommonCommanApi, SportShopCartProcessWorkerApi } from "../../../enum/webworkerEnum/workerTransferEnum";
import { WebWorkerControllerE } from "/@/enum/webworkerEnum/webworkerControllerE";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import { useLoading } from "/@/directive/loading/hooks";
import viewSportPubSubEventData from "./viewSportPubSubEventData";
import { getSingleTicket, getChampionSingleTicket, getParlayTickets, getOutrightTicket } from "/@/views/sports/utils/commonFn";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

import { useToolsHooks } from "./scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const { stopLoading } = useLoading();
export default function useSportPubSubEvents() {
	// 投注信息状态管理器
	const sportsBetEvent = useSportsBetEventStore();
	// 购物车全局状态管理器
	const ShopCatControlStore = useShopCatControlStore();
	const ChampionShopCartStore = useSportsBetChampionStore();
	const { toggleEventScoreboard, switchEventVideoSource } = useToolsHooks();
	const SidebarStore = useSidebarStore();

	// const sportsBetChampion = useSportsBetChampionStore();
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

	let pollingTimeout: ReturnType<typeof setTimeout> | null = null;

	const executePoll = async () => {
		await sportsLogin({ showLoading: false });
		// 继续轮询
		pollAgain();
	};

	// 五分钟轮询一次
	const pollAgain = () => {
		pollingTimeout = setTimeout(executePoll, 300000);
	};

	// 开启登录接口轮询
	const startPolling = () => {
		if (!pollingTimeout) {
			pollAgain();
		}
	};

	// 关闭登录接口轮询
	const stopPolling = () => {
		if (pollingTimeout) {
			clearTimeout(pollingTimeout);
			pollingTimeout = null;
		}
	};

	// 体育登录
	const sportsLogin = async (showLoadingObject?: object) => {
		const store = useUserStore();
		const sportsInfoStore = useSportsInfoStore();
		const params = {
			userAccount: store.userInfo.userAccount,
			device: "H5",
			venueCode: "SBA",
		};
		let headers = {};
		if (showLoadingObject) {
			headers = showLoadingObject;
		}

		try {
			let res: any;
			if (store.token) {
				console.log("有触发体育登录吗？？？？？ ----- 1");
				res = await sportsApi.sportsLogin(params, headers);
			} else {
				console.log("有触发体育登录吗？？？？？ ----- 2");
				res = await sportsApi.sbaAnonLogin(params);
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
		pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.controllerName = WebWorkerControllerE.SportOddsChangeController;
		//线程指令 更新赔率sportOddsChange 指令
		pubsub.PubSubEvents.WorkerEvents.viewToWorker.params!.apiName = SportViewProcessWorkerApi.sportOddsChange;
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
		console.log("第九步 视图收到线程管理器发送的数据", event);
		//体育视图处理线程
		if (event.workerName == WorkerName.sportViewProcessWorker) {
			const processData: WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerApi> = event as WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerApi>;
			//体育视图处理线程 eventSource 指令
			if (processData.apiName == SportViewProcessWorkerApi.sportEventSource) {
				// 派发到 viewSportPubSubEventData 数据中心
				// console.log(processData.data.webToPushApi, processData.data.state.viewSportData);
				viewSportPubSubEventData.setSportData(processData.data.state.viewSportData);
				//在没有info数据时 存储赛事第一条到侧边栏
				if (Object.keys(SidebarStore.getEventsInfo).length === 0) {
					const childrenViewData = viewSportPubSubEventData.getSportData();
					// console.log(childrenViewData, "childrenViewData")
					if (childrenViewData && childrenViewData.length > 0 && childrenViewData[0]?.events && childrenViewData[0]?.events.length > 0) {
						toggleEventScoreboard(childrenViewData[0]?.events[0]);
					}
				}
			}
			// 体育视图处理线程 赔率变更 指令
			else if (processData.apiName == SportViewProcessWorkerApi.sportOddsChange) {
				console.log("赔率处理");
			}
			//体育视图处理线程 取消loading 指令
			else if (processData.apiName == WorkerCommonCommanApi.stopLoading) {
				// stopLoading();
			}
		}
		// 侧边栏推回的数据
		else if (event.workerName == WorkerName.sidebarWorker) {
			const processData: WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerApi> = event as WorkerTransfer<WorkerToviewSport, SportViewProcessWorkerApi>;
			if (processData.apiName == SportViewProcessWorkerApi.sidebarEventSource) {
				console.log("收到侧边数据执行了", processData.data.state);
				viewSportPubSubEventData.setSidebarData(processData.data.state.viewSportData);
			}
		}

		//体育购物车线程
		else if (event.workerName == WorkerName.sportShopCartProcessWorker) {
			const processData: WorkerTransfer<WorkerToViewSportsShopCart<any>, SportShopCartProcessWorkerApi> = event as WorkerTransfer<
				WorkerToViewSportsShopCart<any>,
				SportShopCartProcessWorkerApi
			>;
			console.log("processData", processData);
			if (processData.apiName == SportShopCartProcessWorkerApi.sportsShopCartViewChanges) {
				if (!ShopCatControlStore.getShopCatShow) return; // 弹窗关闭停止对应任务

				if (sportsBetEvent.sportsBetEventData.length == 1) {
					// 接受赛事购物车数据
					// 单关注单请求
					console.log("请求单关信息");
					getSingleTicket();
				}
				if (sportsBetEvent.sportsBetEventData.length > 1) {
					// 串关注单请求
					console.log("请求串关信息");
					getParlayTickets();
				}
			}
			// 先屏蔽冠军购物车推送的判断
			if (processData.apiName == SportShopCartProcessWorkerApi.championShopCartViewChanges) {
				if (!ShopCatControlStore.getShopCatShow) return; // 弹窗关闭停止对应任务

				if (processData.data.cartType === "0") {
					getChampionSingleTicket();
				} else if (processData.data.cartType === "1") {
					if (processData.data.data && processData.data.data.length > 0) {
						// 冠军购物车数据
						ChampionShopCartStore.championShopCartSSEProcess(processData.data.data);
					}
					if (ChampionShopCartStore.championBetData.length == 1) {
						// 冠军单关注单请求
						getOutrightTicket();
					}
				}
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

	return { startPolling, stopPolling, initSportPubsub, unSubSport, clearState, sportsLogin, clearSportsOddsChange };
}
