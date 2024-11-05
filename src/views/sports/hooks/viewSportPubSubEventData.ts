import { ref, reactive } from "vue";
import _ from "lodash-es";
import { SportViewModels } from "/@/views/sports/models/sportViewModels";
import Common from "/@/views/sports/utils/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { SportViewData, SportsRootObject } from "/@/views/sports/models/interface";
import { formatDateToTimeStamp } from "/@/webWorker/module/utils/formattingChildrenViewData";
import pubSub from "/@/pubSub/pubSub";

export default (function () {
	class ViewSportPubSubEventData implements SportViewModels {
		// 单例实例变量
		private static instance: ViewSportPubSubEventData;

		public viewSportData: SportViewData;
		public sidebarData: SportViewData;

		// 私有构造函数，确保单例模式
		private constructor() {
			// 初始化视图数据实体
			this.viewSportData = reactive<SportViewData>({
				sports: [], // 头部信息存储中心
				leagues: [],
				events: [],
				hotEvents: [],
				markets: [],
				outrights: [],
				results: [],
				childrenViewData: [], // 赛事列表存储中心
			});

			this.sidebarData = reactive({
				events: [],
				promotionsViewData: [], // 热门存储中心
			}) as unknown as SportViewData;
		}

		// 获取单例实例的静态方法
		public static getInstance(): ViewSportPubSubEventData {
			if (!ViewSportPubSubEventData.instance) {
				// 如果实例不存在，则创建
				ViewSportPubSubEventData.instance = new ViewSportPubSubEventData();
			}
			// 返回单例实例
			return ViewSportPubSubEventData.instance;
		}

		/**
		 * 清空数据
		 */
		public clearState(): void {
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
		public clearEventsState(): void {
			Object.assign(this.viewSportData, {
				childrenViewData: [],
				markets: [],
			});
		}

		/**
		 * 设置数据
		 */
		public setSportData(viewSportData: SportViewData): void {
			console.log(viewSportData, "viewSportData=====");

			// 收到数据推送派发 使用Object.assign来确保响应式数据的正确更新
			Object.assign(this.viewSportData, viewSportData);
			setTimeout(() => {
				pubSub.publish("SkeletonLoading", false);
			}, 1000);
		}

		public setSidebarData(sidebarData: SportViewData): void {
			Object.assign(this.sidebarData, sidebarData);
			// pubSub.publish("SkeletonLoading", false);
		}

		public clearSidebarData(): void {
			Object.assign(this.sidebarData, {
				event: [],
				promotionsViewData: [], // 热门存储中心
			});
		}

		/**
		 * @description 关注直接给出所有的events 不区分sportType
		 */
		public getEvents(): any[] {
			const leagues = Object.values(this.viewSportData.childrenViewData);
			return ([] as any[]).concat(...leagues);
		}

		/**
		 * 处理数据
		 */
		public getSportData(dataType: "viewSportData" | "sidebarData" = "viewSportData"): any[] {
			const sportsBetEvent = useSportsBetEventStore();
			const leagueSelect = sportsBetEvent.getLeagueSelect;
			const data = dataType === "viewSportData" ? this.viewSportData.childrenViewData : this.sidebarData.childrenViewData;

			// 如果有筛选 则处理数据，只给出筛选的联赛列表。
			if (data && data.length && leagueSelect.length > 0) {
				return data.filter((item: any) => leagueSelect.includes(item.leagueId));
			}

			// 如果有热门赛事，则处理数据给出热门赛事。
			const hotLeagueList = JSON.parse(JSON.stringify(sportsBetEvent.hotLeagueList));
			if (data && data.length && hotLeagueList) {
				const hotEventId = hotLeagueList.map((item: any) => item.eventId);
				return data.filter((item: any) => {
					item.event = item.events.filter((eventItem: any) => hotEventId.includes(eventItem.eventId));
					item.event.sort((a: any, b: any) => {
						return formatDateToTimeStamp(a.globalShowTime) - formatDateToTimeStamp(b.globalShowTime);
					});
					return item.event.length;
				});
			}

			return data;
		}
	}

	return ViewSportPubSubEventData.getInstance();
})();
