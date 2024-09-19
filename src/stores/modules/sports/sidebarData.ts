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
	getters: {
		getEventsInfo(): SportsRootObject {
			return this.eventsInfo;
		},
	},
	actions: {
		// 获取赛事信息
		setEventsInfo(eventInfo: any) {
			console.log("Store eventInfo ", eventInfo);
			if (!isEmpty(eventInfo) && this.eventsInfo?.eventId !== eventInfo?.eventId) {
				this.eventsInfo = eventInfo;
			}
		},

		// 清除暂存的侧边数据信息
		// 每次切换球类时使用先清除数据
		clearEventsInfo() {
			this.eventsInfo = {} as SportsRootObject;
		},
	},
});
