import { defineStore } from "pinia";
import { SportsRootObject } from "/@/views/sports/models/interface";
import { isEmpty } from "lodash-es";
export const useSidebarStore = defineStore("sidebarData", {
	state: () => {
		return {
			// 侧边栏状态
			sidebarStatus: 'scoreboard' as "scoreboard" | "live" | "liveAnimation" | null, // 计分板 直播 动画直播
			// 侧边栏的赛事数据
			eventsInfo: {} as SportsRootObject,
			// 侧边栏直播赛事地址信息
			liveUrl: {} as any,
		};
	},
	getters: {
		// 获取赛事信息
		getEventsInfo: (state) => state.eventsInfo,
		// 获取直播地址
		getLiveUrl(): any {
			return this.liveUrl;
		},
	},
	actions: {
		// 设置侧边栏状态
		getSidebarStatus(type: "scoreboard" | "live" | "liveAnimation") {
			this.sidebarStatus = type;
		},

		// 设置赛事信息
		setEventsInfo(eventInfo: any) {
			// console.log("Store eventInfo ", eventInfo);
			if (!isEmpty(eventInfo) && this.eventsInfo?.eventId !== eventInfo?.eventId) {
				this.eventsInfo = eventInfo;
			}
		},

		// 设置直播地址信息
		setLiveUrl(liveUrl: any) {
			this.liveUrl = liveUrl;
		},

		// 清除暂存的侧边数据信息
		// 每次切换球类时使用先清除数据
		clearEventsInfo() {
			this.eventsInfo = {} as SportsRootObject;
		},
	},
});
