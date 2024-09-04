/*
 * @Author: WangMingxin
 * @Description: 体育-关注功能
 */
import { defineStore } from "pinia";

import SportsCommonFn from "/@/views/sports/utils/common";

interface sportsBetEvent {
	/** 关注列表与赛事联赛id存储 */
	attentionList: [];
	/** 关注的赛事列表 */
	attentionEventIdList: number[];
	/** 关注的冠军id列表*/
	attentionLeagueIdList: number[];
	/** 判断当前关注的列表是赛事还是联赛 event:联赛 */
	attentionType: string;
	/*热门联赛的展示和隐藏flag*/
	hotLeague_visible: boolean;
	//存储折叠状态
	isFold: boolean;
}

export const useSportAttentionStore = defineStore("SportAttention", {
	state: (): sportsBetEvent => {
		return {
			attentionList: [], //关注的赛事列表
			attentionEventIdList: [], //关注的赛事id列表
			attentionLeagueIdList: [], //关注的冠军id列表
			attentionType: "event", //当前显示的关注列表为冠军联赛还是赛事
			/*热门联赛的展示和隐藏flag*/
			hotLeague_visible: true,
			isFold: false, //是否折叠
		};
	},
	getters: {
		/**
		 * @description: 关注的赛事列表
		 * @return {*}
		 */
		getAttentionList(): number[] {
			return this.attentionList;
		},
		/**
		 * @description: 关注的赛事id列表
		 * @return {*}
		 */
		getAttentionEventIdList(): number[] {
			return this.attentionEventIdList;
		},
		/**
		 * @description: 获取 关注的冠军id列表
		 * @return {*}
		 */
		getAttentionLeagueIdList(): number[] {
			return this.attentionLeagueIdList;
		},
		/**
		 * @description: 获取关注选中类型
		 * @return {*}
		 */
		getAttentionType(): any {
			return this.attentionType;
		},
	},
	actions: {
		/**
		 * @description: 存储关注数据
		 * @param {*} data
		 * @return {*}
		 */
		setAttentionList(data: any) {
			console.log("data------------>>>>", data);

			this.attentionList = data;
			this.clearAttentionList();
			//筛选出对应的关注列表 赛事或冠军
			data.forEach((item) => {
				const { eventIds } = SportsCommonFn.formatAttention(item.list);
				console.info(" 筛选出对应的关注列表 赛事或冠军");
				if (item.type == 2) {
					// console.log(eventIds, "======eventIds");
					this.attentionEventIdList = eventIds;
				} else {
					this.attentionLeagueIdList = eventIds;
				}
			});
		},
		/**
		 * @description: 	清理关注列表
		 * @return {*}
		 */
		clearAttentionList() {
			this.attentionEventIdList = [];
			this.attentionLeagueIdList = [];
		},
		/**
		 * @description: 	设置当前展示的是冠军关注还是赛事关注
		 * @param {*} type
		 * @return {*}
		 */
		setAttentionType(type) {
			this.attentionType = type;
		},
		/**
		 * @description:隐藏热门热门联赛
		 * @return {*}
		 */
		hintHotLeague() {
			this.hotLeague_visible = false;
		},
		/**
		 * @description: 显示热门热门联赛
		 * @return {*}
		 */
		showHotLeague() {
			this.hotLeague_visible = true;
		},

		setIsFold(isFold: boolean) {
			this.isFold = isFold;
		},
	},
});
