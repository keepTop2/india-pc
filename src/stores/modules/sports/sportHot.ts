/*
 * @Author: sun
 * @Description: 体育-右侧热门赛事及当前赛事
 */
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
		 * @description: 设置当前赛事
		 * @param {SportsRootObject} event
		 * @return {void}
		 */
		setCurrentEvent(event: SportsRootObject): void {
			if (!isEmpty(event) && this.currentEventInfo?.eventId !== event?.eventId) {
				console.log("setCurrentEvent", event);
				this.currentEventInfo = event;
			}
		},

		/**
		 * 设置初始化赛事，当前路由不改变，则不修改数据
		 * @param event
		 */
		setInitEvent(event: SportsRootObject): void {
			const currentHref = window.location.href;
			if (!isEmpty(event) && currentHref !== this.originHref && this.currentEventInfo?.eventId !== event?.eventId) {
				console.log("setInitEvent", event);
				this.currentEventInfo = event;
				this.originHref = currentHref;
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
