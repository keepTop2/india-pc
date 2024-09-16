import { ref, watch } from "vue";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
export function useToolsHooks() {
	const SidebarStore = useSidebarStore();

	// 切换计分板功能
	const toggleEventScoreboard = (eventInfo: any) => {
		// 切换的时候获取当前赛事信息
		if (eventInfo) {
			console.log("更新 eventInfo 赛事数据", eventInfo);
			SidebarStore.setEventsInfo(eventInfo);
		}
	};

	// 切换视频源功能
	const switchEventVideoSource = async (matchId: string) => {};

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
