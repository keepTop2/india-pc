import { computed, ref, watch } from "vue";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import SportsApi from "/@/api/sports/sports";
import Common from "/@/utils/common";
import { SportViewProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
import pubSub from "/@/pubSub/pubSub";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import SportsCommonFn from "/@/views/sports/utils/common";
import { sportsEventDetailPush, promotionsEventsSSEPush } from "/@/views/sports/utils/sportsMap/sportsSSERequestMap";
import workerManage from "/@/webWorker/workerManage";
import { useUserStore } from "/@/stores/modules/user";
import { useHaveToken } from "/@/hooks/useHaveToken";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
export function useToolsHooks() {
	const SidebarStore = useSidebarStore();
	const SportsInfoStore = useSportsInfoStore();
	const UserStore = useUserStore();
	// 切换计分板功能
	const toggleEventScoreboard = (eventInfo: any, isVideo: boolean = false) => {
		// 如果是切换视频，先判断登录状态
		if (isVideo) {
			const haveToken = useHaveToken();
			// 用户未登录，直接返回
			if (!haveToken()) return;
		}

		// 热门数据
		const [pViewData = <any>{}] = viewSportPubSubEventData.sidebarData.promotionsViewData || [];
		// 当前盘口数据
		const [eViewData = <any>{}] = viewSportPubSubEventData.getSportData("sidebarData")?.[0]?.events || [];
		if (Object.keys(eViewData).length || Object.keys(pViewData).length) {
			// 获取params的赛事类型跟赛事id
			const { sportType, eventId } = eventInfo;
			//判断是否在同一场比赛，切换比分跟直播
			if (sportType === (eViewData.sportType || pViewData.sportType) && eventId === (eViewData.eventId || pViewData.eventId)) {
				isVideo && switchEventVideoSource(eventInfo);
				return;
			}
		}

		// 清空状态
		SidebarStore.clearEventsInfo();
		if (eventInfo) {
			if (workerManage.getWorkerList().length) {
				// 关闭侧边栏events线程
				workerManage.stopWorker(workerManage.WorkerMap.sidebarWorker.workerName);
				// 清除暂存的侧边数据信息
				SidebarStore.clearEventsInfo();
			}
			// 开启侧边栏events线程
			workerManage.startWorker(workerManage.WorkerMap.sidebarWorker.workerName);
			// 设置状态
			SidebarStore.setEventsInfo(eventInfo); // 切换的时候获取当前赛事信息
			getSidebarEventSSEPush(); // 侧边赛事推送
			getSidebarMarketSSEPush(); // 每次更新侧边赛事时都需要重新推送对应的盘口详情
			if (isVideo) {
				switchEventVideoSource(eventInfo);
			} else {
				console.log("???");
				// 清除直播地址信息
				SidebarStore.clearLiveUrl();
				SidebarStore.getSidebarStatus("scoreboard");
			}
		}
	};

	// 切换视频源功能
	const switchEventVideoSource = async (eventInfo: any) => {
		// 回调函数，打开视频播放loading
		eventInfo?.callback?.(true);
		// if (eventInfo) {
		// 清除直播地址信息
		SidebarStore.clearLiveUrl();
		// 设置状态
		// SidebarStore.getSidebarStatus("live");
		// 同步更新赛事信息
		// SidebarStore.setEventsInfo(eventInfo);
		const lang = UserStore.getLang;

		const { sportType, channelCode, streamingOption } = eventInfo;
		const params = {
			sportType: sportType,
			streamingOption: streamingOption,
			channelCode: encodeURIComponent(channelCode),
		};

		try {
			// console.log("params", params);
			const res = await SportsApi.GetStreaming(params);
			// console.log("GetStreaming -- res", res);
			if (res.status == 200) {
				// 设置直播数据
				SidebarStore.setLiveUrl(res.data);
				eventInfo?.callback(false);
			} else {
				eventInfo?.callback(new Error("直播视频请求失败！"));
			}
		} catch (error) {
			eventInfo?.callback(new Error("直播视频请求失败！"));
		}
		// }
	};

	// 侧边赛事推送
	const getSidebarEventSSEPush = (id?: number) => {
		const eventInfo = computed(() => {
			return SidebarStore.getEventsInfo;
		});
		const { eventId } = eventInfo.value;
		const params = {
			apiUrl: SportsCommonFn.getSportPushApiUrl(),
			token: SportsInfoStore.getSportsToken,
			language: SportsCommonFn.getSportLanguage(),
		};
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sidebarWorker;
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sidebarEventSource;
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openEvents((eventId as number) || id), params);
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	};

	// 侧边赛事盘口推送
	const getSidebarMarketSSEPush = (id?: number) => {
		const eventInfo = computed(() => {
			return SidebarStore.getEventsInfo;
		});
		const { eventId } = eventInfo.value;
		const params = {
			apiUrl: SportsCommonFn.getSportPushApiUrl(),
			token: SportsInfoStore.getSportsToken,
			language: SportsCommonFn.getSportLanguage(),
		};
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sidebarWorker;
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sidebarEventSource;
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openMarkets((eventId as number) || id), params);
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	};

	// 获取热门赛事
	const getPromotions = async () => {
		console.log("getPromotions -- 获取热门赛事");
		const res = await SportsApi.GetPromotions();
		// 获取 eventId 并集合成逗号分隔的字符串
		if (res) {
			const events = res.data.events?.filter((item: any) => item.sportType === 1);
			// 获取赛事id集合
			const eventIds = events.map((event) => event.eventId).join(",");
			// webToPushApi: WebToPushApi.sportsShopCart,
			// 发起热门赛事推送 promotionsEvent
			const params = {
				apiUrl: SportsCommonFn.getSportPushApiUrl(),
				token: SportsInfoStore.getSportsToken,
				language: SportsCommonFn.getSportLanguage(),
			};
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sidebarWorker;
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sidebarEventSource;
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, promotionsEventsSSEPush.openEvents(eventIds as string), params);
			pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
		}
	};

	// 切换视频全屏功能
	const toggleVideoFullscreen = () => {};

	// 刷新数据功能
	const refreshData = async () => {
		// 实现刷新数据的逻辑
	};

	return {
		toggleEventScoreboard,
		switchEventVideoSource,
		getSidebarEventSSEPush,
		getSidebarMarketSSEPush,
		getPromotions,
		toggleVideoFullscreen,
		refreshData,
	};
}
