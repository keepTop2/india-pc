/*
 * @Author: WangMingxin
 * @Description: 体育-早盘-数据处理；
 */
import { defineStore } from "pinia";
import moment from "moment";
import SportsCommon from "/@/utils/sports/common";
interface timeIntervalType {
	startDate: string;
	endDate: string;
}

interface SportMorningTradingType {
	activeDate: string;
	timeInterval: timeIntervalType;
}

export const useSportMorningTradingStore = defineStore("SportMorningTrading", {
	state(): SportMorningTradingType {
		/** 默认今日时间 */
		const todayDate = moment(SportsCommon.todayDate()).add(1, "day").format("YYYY-MM-DD");
		/** 今日15天的开始结束 */
		const { startDate, endDate } = SportsCommon.getResultDateRange(todayDate, 15);

		return {
			activeDate: "all",
			timeInterval: {
				startDate: startDate,
				endDate: endDate,
			},
		};
	},
	getters: {
		/** 获取选中的时间 */
		getActiveDate(): any {
			return this.activeDate;
		},
		/** 获取时间的关联节点 */
		getTimeInterval(): any {
			return this.timeInterval;
		},
	},
	actions: {
		/**设置选中的时间 */
		setActiveDate(data: string): any {
			this.activeDate = data;
		},
		/**设置选中的时间关联节点 */
		setTimeInterval(data: timeIntervalType): any {
			this.timeInterval = data;
		},
	},
});
