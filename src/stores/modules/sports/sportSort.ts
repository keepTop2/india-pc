/*
 * @Author: WangMingxin
 * @Description: 体育-赛事 热门-时间  排序
 */
import { get } from "http";
import { defineStore } from "pinia";

interface SportSortType {
	/** 菜单赛选一级条件 */
	menuTab: string;
	/** 是否选中滚球(菜单赛选二级条件) */
	menuIsLive: boolean;
	/** 否选中热门 (菜单赛选三级条件) */
	isActiveHot: boolean;
	/** 存储热门联赛列表 */
	hotLeagueList: [];
}

export const useSportSortStore = defineStore("SportSort", {
	state: (): SportSortType => {
		return {
			menuTab: "string",
			menuIsLive: true,
			isActiveHot: false,
			hotLeagueList: [], // 存储热门联赛列表
		};
	},
	getters: {
		/** 获取菜单赛选一级条件  */
		getMenuTab(): any {
			return this.menuTab;
		},
		/** 获取菜单赛选二级条件*/
		getMenuIsLive(): any {
			return this.menuIsLive;
		},
		/**获取选中热门状态 */
		getIsActiveHot(): any {
			return this.isActiveHot;
		},
		/**
		 * @description: 获取热门赛事列表
		 * @return {*}
		 */
		getHotLeagueList(): any {
			return this.hotLeagueList;
		},
	},
	actions: {
		/** 设置菜单赛选一级条件  */
		setMenuTab(data: string): any {
			this.menuTab = data;
		},
		/** 设置菜单赛选二级条件*/
		setMenuIsLive(data: boolean) {
			this.menuIsLive = data;
		},
		/**
		 * @description: 设置是否选中热门；
		 * @param {boolean} data
		 * @return {*}
		 */
		setIsActiveHot(data: boolean) {
			this.isActiveHot = data;
		},
		/**
		 * @description: 设置热门赛事数据
		 * @param {*} data
		 * @return {*}
		 */
		setHotLeagueList(data) {
			this.hotLeagueList = data;
		},
		/**
		 * @description: 清理热门赛事
		 * @return {*}
		 */
		clearHotLeagueList() {
			this.hotLeagueList = [];
		},
	},
});
