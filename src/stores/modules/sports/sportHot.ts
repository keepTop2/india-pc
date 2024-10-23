import { defineStore } from "pinia";
import { merge, isEmpty } from "lodash-es";
import { SportsRootObject } from "/@/views/sports/models/interface";
import { ControlListType } from "/@/views/sports/models/sportResultModel";
import { SportControlEnum } from "/@/views/sports/enum/sportEnum/sportEnum";

interface SportHotType {
	originHref: string;
	hotEventList: SportsRootObject[];
	currentEventInfo: SportsRootObject;
	formatEvent: any;
	controlType: SportControlEnum; // 控制类型，用于右侧切换 视频/比分板/动画
	useControlList: ControlListType[];
}

export const useSportHotStore = defineStore("SportHot", {
	state: (): SportHotType => {
		return {
			originHref: "",
			controlType: SportControlEnum.Video,
			useControlList: [],
			hotEventList: [], // 存储右侧热门赛事列表
			currentEventInfo: {} as SportsRootObject, // 当前赛事详情点击选中赛事 或 热门赛事
			formatEvent: {},
		};
	},
	getters: {
		/**
		 * @description: 获取热门赛事列表
		 * @return {*}
		 */
		getHotEventList(): SportsRootObject[] {
			return this.hotEventList;
		},
	},
	actions: {
		/**
		 * 更新当前控制类型
		 */
		updateControlType(type: SportControlEnum) {
			this.controlType = type;
		},

		/**
		 * 右侧支持显示的控制列表
		 * @param list
		 */
		updateUseControlList(list: ControlListType[]) {
			this.useControlList = list;
		},

		/**
		 * @description: 设置热门赛事数据
		 * @param {*} data
		 * @return {*}
		 */
		setHotEventList(data: SportsRootObject[]): void {
			this.hotEventList = data;
		},

		/**
		 * @description: 更新当前的赛事信息，如果新的赛事与当前赛事不同。
		 * @param {SportsRootObject} event - 新的赛事信息对象
		 */
		setCurrentEvent(event: SportsRootObject): void {
			// 检查条件 1: 确保 event 对象不为空，避免处理无效数据
			// 检查条件 2: 确保新 event 的 eventId 与当前的 eventId 不同，避免重复设置相同的赛事信息
			if (!isEmpty(event) && this.currentEventInfo?.eventId !== event?.eventId) {
				// 更新当前的赛事信息为新的 event
				this.currentEventInfo = event;
			}
		},

		/**
		 * 初始化当前的赛事信息 (currentEventInfo)。该方法会在满足一定条件时，将新的赛事信息更新到 currentEventInfo 中，并记录当前页面的 URL
		 * @param event 当前赛事数据对象
		 */
		setInitEvent(event: SportsRootObject): void {
			// console.log("初始化的event", event);
			const currentHref = window.location.href;
			// 检查 event 对象是否为空，并且当前页面的 URL 是否与记录的 URL 不同，以及新事件 ID 是否与当前事件 ID 不同
			if (!isEmpty(event) && currentHref !== this.originHref && this.currentEventInfo?.eventId !== event?.eventId) {
				this.currentEventInfo = event; // 更新当前的赛事信息
				this.originHref = currentHref; // 更新记录的 URL
			}
		},

		/**
		 * 更新当前赛事
		 */
		updateCurrentEvent(event: SportsRootObject): void {
			if (!isEmpty(event) && this.currentEventInfo?.eventId === event?.eventId) {
				this.currentEventInfo = merge({}, this.currentEventInfo, event);
			}
		},

		/**
		 * 移除对应赛事
		 */
		removeCurrentEvent(event: SportsRootObject): void {
			if (!isEmpty(event) && this.currentEventInfo?.eventId === event?.eventId) {
				this.updateToHotEvent();
			}
		},

		/**
		 * 更新右侧赛事为热门赛事
		 */
		updateToHotEvent() {
			if (this.hotEventList.length) {
				// 目前拿到的赛事都是足球， 暂时未考虑其他球类时右侧场景
				const [hotEvent] = this.hotEventList;
				if (this.currentEventInfo?.eventId !== hotEvent.eventId) {
					this.currentEventInfo = hotEvent;
				}
			}
		},

		/**
		 * 修改赛事数据
		 */
		setFormatEvent(event: any) {
			this.formatEvent = event;
		},

		/**
		 * @description: 清理热门赛事
		 * @return {*}
		 */
		clearHotEventList(): void {
			this.hotEventList = [];
			this.currentEventInfo = {} as SportsRootObject;
		},
	},
});
