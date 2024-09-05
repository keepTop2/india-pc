/*
 * @Author: WangMingxin
 * @Description: 菜单管理；
 */
import { defineStore } from "pinia";

export interface GameTwoClassList {
	id: string;
	/**名称 */
	name: string;
	/**图片地址或名称 */
	iconCode: string;
	/**排序 */
	sort: number;
	/**模版标识 */
	modelCode: string;
}
export interface ServerData {
	gameOneClassId: string;
	/**名称 */
	gameOneClassName: string;
	/**排序 */
	iconCode: string;
	/**模版标识 */
	modelCode: string;
	sort: number;
	/**二级数组 */
	gameTwoClassList: GameTwoClassList[];
}
interface StoreMenu {
	/** 左侧菜单是否是缩小*/
	collapse: Boolean;
	/** 左侧菜单 */
	menuList: Array<Object>;
	/** 生成的后台路由 */
	serverMenu: Array<any>;
	/** 后台数据 */
	serverData: Array<ServerData>;
	/** 赌博大厅顶部菜单 */
	hallTopMenu: any;
}

export const useMenuStore = defineStore("Menu", {
	state: (): StoreMenu => {
		return {
			collapse: false,
			menuList: [],
			serverMenu: [],
			serverData: [],
			hallTopMenu: [],
		};
	},
	getters: {
		/**
		 * @description: 左侧菜单是否是缩小
		 * @return {*}
		 */
		getCollapse(): Boolean {
			return this.collapse;
		},
		/**
		 * @description: 获取左侧菜单
		 * @return {*}
		 */
		getMenu(): Object {
			return this.menuList;
		},
		/**
		 * @description: 重组的后端路由
		 * @return {*}
		 */
		getServerMenu(): Array<any> {
			const serverMenu = this.serverMenu;
			return serverMenu;
		},
		/**
		 * @description: 后端菜单数据
		 * @return {*}
		 */
		getServerData(): Array<ServerData> {
			const serverData = this.serverData;
			return serverData;
		},
		/**
		 * @description: 热门顶部菜单
		 * @return {*}
		 */
		getHallTopMenu(): any {
			const hallTopMenu = this.hallTopMenu;
			return hallTopMenu;
		},
	},

	actions: {
		/**
		 * @description: 左侧菜单是否是缩小
		 * @return {*}
		 */
		setCollapse(data?: Boolean) {
			this.collapse = data || false;
		},
		/**
		 * @description: 设置左侧菜单
		 * @return {*}
		 */
		setMenuList(data?: Array<Object>) {
			this.menuList = data || [];
		},
		/**
		 * @description: 重组的后端路由
		 * @return {*}
		 */
		setServeMenu(data?: any) {
			this.serverMenu = data;
		},
		/**
		 * @description: 后端菜单数据
		 * @return {*}
		 */
		setServeData(data?: Array<ServerData>) {
			this.serverData = data || [];
		},
		/**
		 * @description: 热门顶部菜单
		 * @return {*}
		 */
		setHallTopMenu(data?: any) {
			this.hallTopMenu = data;
		},
	},
	/** 根据需求 后端路由数据不做任何缓存  2014/07/20  */
	// persist: {
	// 	key: "useMenuStore",
	// 	storage: sessionStorage,
	// 	paths: ["serverData", "collapse"],
	// },
});
