import { defineStore } from "pinia";
import { SportsRootObject } from "/@/views/sports/models/interface";
import { isEmpty } from "lodash-es";
export const useSidebarStore = defineStore("sidebarData", {
	state: () => {
		return {
			// 侧边栏的赛事数据
			eventsInfo: {} as SportsRootObject,
		};
	},
	getters: {},
	actions: {
		// 获取赛事信息
		setEventsInfo(eventInfo: any) {
			console.log("Store eventInfo ", eventInfo);
			if (!isEmpty(eventInfo) && this.eventsInfo?.eventId !== eventInfo?.eventId) {
				this.eventsInfo = eventInfo;
			}
		},
	},
});
