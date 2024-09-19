import { ref, watch } from "vue";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import SportsApi from "/@/api/sports/sports";
import Common from "/@/utils/common";
export function useToolsHooks() {
	const SidebarStore = useSidebarStore();

	// 切换计分板功能
	const toggleEventScoreboard = (eventInfo: any) => {
		console.log("更新 eventInfo 赛事数据", eventInfo);
		// 设置状态
		SidebarStore.getSidebarStatus("scoreboard");
		// 切换的时候获取当前赛事信息
		if (eventInfo) {
			SidebarStore.setEventsInfo(eventInfo);
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

	// 切换视频全屏功能
	const toggleVideoFullscreen = () => {};

	// 刷新数据功能
	const refreshData = async () => {
		// 实现刷新数据的逻辑
	};

	return {
		toggleEventScoreboard,
		switchEventVideoSource,
		toggleVideoFullscreen,
		refreshData,
	};
}
