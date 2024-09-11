import { reactive } from "vue";
import _ from "lodash-es";
import { SportViewModels } from "/@/views/sports/models/sportViewModels";
import Common from "/@/views/sports/utils/common";
import { SportViewData } from "/@/views/sports/models/interface";
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";

export default (function () {
	class viewSportPubSubEventData implements SportViewModels {
		// 单例实例变量
		private static instance: viewSportPubSubEventData;
		// 私有构造函数，确保单例模式
		private constructor() {
			// 初始化视图数据实体
			this.viewSportData = reactive({
				sports: [],
				leagues: [],
				events: [],
				markets: [],
				outrights: [],
				results: [],
				childrenViewData: {},
			}) as SportViewData;
		}
		// 获取单例实例的静态方法
		public static getInstance(): viewSportPubSubEventData {
			if (!viewSportPubSubEventData.instance) {
				// 如果实例不存在，则创建
				viewSportPubSubEventData.instance = new viewSportPubSubEventData();
			}
			// 返回单例实例
			return viewSportPubSubEventData.instance;
		}

		public viewSportData: SportViewData;
		/**
		 * 清空数据
		 */
		public clearState() {
			Object.assign(this.viewSportData, {
				sports: [],
				leagues: [],
				events: [],
				markets: [],
				outrights: [],
				results: [],
				childrenViewData: {},
			});
		}
		/**
		 * 清空赛事数据保留sports
		 */
		public clearEventsState() {
			Object.assign(this.viewSportData, {
				childrenViewData: {},
			});
		}
		/**
		 * 设置数据
		 */
		public setSportData(viewSportData: SportViewData) {
			try {
				// 使用Object.assign来确保响应式数据的正确更新
				// console.log("viewSportData", viewSportData);
				Object.assign(this.viewSportData, viewSportData);
				// console.info("this.viewSportData--------------->", this.viewSportData);
			} catch (error) {
				console.error("Error occurred while setting sport data:", error);
			}
		}

		/**
		 * @description 关注直接给出所有的events 不区分sportType
		 */
		public getEvents() {
			// return Object.values(this.viewSportData.childrenViewData);
			const leagues = Object.values(this.viewSportData.childrenViewData);
			// console.log(leagues, "======leagues");
			return [].concat(...leagues);
		}

		/**
		 * 处理数据
		 */
		public getSportData(sportType) {
			// console.log("this.viewSportData.childrenViewData[sportType]", this.viewSportData.childrenViewData[sportType]);
			const SportSortStore = useSportSortStore();
			let leagues = this.viewSportData.childrenViewData[sportType];
			/** 是否选中热门联赛 */
			const isActiveHot = SportSortStore.getIsActiveHot;
			/**热门赛事 */
			const hotLeagueList = SportSortStore.getHotLeagueList;
			const MenuTab = SportSortStore.getMenuTab;
			if (isActiveHot && MenuTab != "champion") {
				// 如果有热门赛事，则处理数据给出热门赛事。
				if (leagues && hotLeagueList.length > 0) {
					const hotEventId = hotLeagueList.map((item) => item.eventId);
					return leagues.filter((item) => {
						item.events = item.events.filter((eventItem) => {
							/**eventId是否包含在热门中 */
							const isEvent = hotEventId.includes(eventItem.eventId);
							if (isEvent) {
								return true;
							} else {
								return false;
							}
						});
						item.events.sort((a, b) => {
							return Common.formatDateToTimeStamp(a.globalShowTime) - Common.formatDateToTimeStamp(b.globalShowTime);
						});
						return item.events.length;
					});
				} else {
					return [];
				}
			}
			return leagues;
		}
	}

	return viewSportPubSubEventData.getInstance();
})();
