import { ref, reactive } from "vue";
import _ from "lodash-es";
import { SportViewModels } from "/@/views/sports/models/sportViewModels";
import Common from "/@/views/sports/utils/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { SportViewData, SportsRootObject } from "/@/views/sports/models/interface";
import { formatDateToTimeStamp } from "/@/webWorker/module/utils/formattingChildrenViewData";

export default (function () {
	class viewSportPubSubEventData implements SportViewModels {
		// 单例实例变量
		private static instance: viewSportPubSubEventData;
		// 私有构造函数，确保单例模式
		private constructor() {
			// 初始化视图数据实体
			this.viewSportData = reactive({
				sports: [], // 头部信息存储中心
				leagues: [],
				events: [],
				markets: [],
				outrights: [],
				results: [],
				childrenViewData: [], // 赛事列表存储中心
			}) as unknown as SportViewData;

			this.sidebarData = reactive({
				event: [],
				promotionsViewData: [], // 热门存储中心
			} as unknown as SportViewData);
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
		public sidebarData: SportViewData;

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
				childrenViewData: [],
			});
		}

		/**
		 * 清空赛事数据保留sports
		 */
		public clearEventsState() {
			Object.assign(this.viewSportData, {
				childrenViewData: [],
				markets: [],
			});
		}

		/**
		 * 设置数据
		 */
		public setSportData(viewSportData: SportViewData) {
			// 收到数据推送派发 使用Object.assign来确保响应式数据的正确更新
			// console.log("收到数据推送派发 viewSportData", viewSportData);
			Object.assign(this.viewSportData, viewSportData);
		}

		public setSidebarData(sidebarData: SportViewData) {
			Object.assign(this.sidebarData, sidebarData);
		}
		public clearSidebarData() {
			Object.assign(this.sidebarData, {
				event: [],
				promotionsViewData: [], // 热门存储中心
			});
		}
		/**
		 * @description 关注直接给出所有的events 不区分sportType
		 */
		public getEvents() {
			const leagues = Object.values(this.viewSportData.childrenViewData);
			return [].concat(...leagues);
		}

		/**
		 * 处理数据
		 */
		public getSportData(dataType: "viewSportData" | "sidebarData" = "viewSportData") {
			const sportsBetEvent = useSportsBetEventStore();
			const leagueSelect = sportsBetEvent.getLeagueSelect;
			let data;
			if (dataType === "viewSportData") {
				data = this.viewSportData.childrenViewData;
			} else if (dataType === "sidebarData") {
				data = this.sidebarData.childrenViewData;
			}
			// 如果有筛选 则处理数据，只给出筛选的联赛列表。
			if (data && data.length && leagueSelect.length > 0) {
				// console.log('=======有筛选数据')
				return data.filter((item) => leagueSelect.includes(item.leagueId));
			}
			// 如果有热门赛事，则处理数据给出热门赛事。
			const hotLeagueList = JSON.parse(JSON.stringify(sportsBetEvent.hotLeagueList));
			if (data && data.length && hotLeagueList) {
				// console.log('=========有热门数据')
				const hotEventId = hotLeagueList.map((item) => item.eventId);
				return data.filter((item) => {
					item.event = item.events.filter((eventItem) => hotEventId.includes(eventItem.eventId));
					item.event.sort((a, b) => {
						return formatDateToTimeStamp(a.globalShowTime) - formatDateToTimeStamp(b.globalShowTime);
					});
					return item.event.length;
				});
			}
			// console.log(data, "===data", hotLeagueList);

			return data;
		}
	}

	return viewSportPubSubEventData.getInstance();
})();
