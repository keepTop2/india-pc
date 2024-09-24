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
export function useToolsHooks() {
	const SidebarStore = useSidebarStore();
	const SportsInfoStore = useSportsInfoStore();

	// 切换计分板功能
	const toggleEventScoreboard = (eventInfo: any) => {
		if (workerManage.getWorkerList().length) {
			// 关闭侧边栏events线程
			workerManage.stopWorker(workerManage.WorkerMap.sidebarWorker.workerName);
			// SidebarStore.clearEventsInfo();
		}
		// 开启侧边栏events线程
		workerManage.startWorker(workerManage.WorkerMap.sidebarWorker.workerName);
		console.log("更新 eventInfo 赛事数据", eventInfo);
		// 设置状态
		SidebarStore.getSidebarStatus("scoreboard");
		// 切换的时候获取当前赛事信息
		if (eventInfo) {
			SidebarStore.setEventsInfo(eventInfo);
			getSidebarEventSSEPush(); // 侧边赛事推送
			getSidebarMarketSSEPush(); // 每次更新侧边赛事时都需要重新推送对应的盘口详情
		}
	};

	// 切换视频源功能
	const switchEventVideoSource = async (eventInfo: any) => {
		// console.log("eventInfo", eventInfo);
		// 设置状态
		SidebarStore.getSidebarStatus("live");
		// 同步更新赛事信息
		SidebarStore.setEventsInfo(eventInfo);
		const { sportType, channelCode, streamingOption } = eventInfo;
		const params = {
			sportType: sportType,
			streamingOption: streamingOption,
			channelCode: encodeURIComponent(channelCode),
		};
		console.log("params", params);
		const res = await SportsApi.GetStreaming(params);
		console.log("GetStreaming -- res", res);
		if (res) {
			// 设置直播地址
			SidebarStore.setLiveUrl(res.data.streamingUrlNonCN);
		}
	};

	// 侧边赛事推送
	const getSidebarEventSSEPush = () => {
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
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openEvents(eventId as number), params);
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	};

	// 侧边赛事盘口推送
	const getSidebarMarketSSEPush = () => {
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
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportsEventDetailPush.openMarkets(eventId as number), params);
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	};

	// 获取热门赛事
	const getPromotions = async () => {
		console.log("getPromotions -- 获取热门赛事");
		const res = await SportsApi.GetPromotions();
		// 获取 eventId 并集合成逗号分隔的字符串
		if (res) {
			const events = res.data.events;
			// 获取赛事id集合
			const eventIds = events.map((event) => event.eventId).join(",");
			// 发起热门赛事推送
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
