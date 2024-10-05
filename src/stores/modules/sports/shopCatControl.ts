import { defineStore } from "pinia";
interface ShopCatControlType {
	/** 购物车全关（不保留激活区域）  */
	shopCatClose: boolean;
	/** 购物车关闭开启状态 */
	shopCatShow: boolean;
	/** 购物车类型  league｜champion */
	shopCartType: string;
}

export const useShopCatControlStore = defineStore("ShopCatControl", {
	state: (): ShopCatControlType => {
		return {
			shopCatClose: false, // 购物车全关（不保留激活区域）
			shopCatShow: false, // 购物车关闭开启状态
			shopCartType: "league", // 购物车类型
		};
	},
	getters: {
		/**
		 * @description: 获取购物车是否全关
		 * @return {*}
		 */
		getShopCatClose(): any {
			return this.shopCatClose;
		},

		/**
		 * @description: 获取购物车类型
		 * @return {*}
		 */
		getShopCartType(): any {
			return this.shopCartType;
		},

		/**
		 * @description: 获取购物车赛事列表显示状态
		 * @return {*}
		 */
		getShopCatShow(): any {
			return this.shopCatShow;
		},
	},
	actions: {
		/**
		 * @description: 设置购物车是否全关
		 * @param {boolean} data
		 * @return {*}
		 */
		setShopCatClose(data: boolean) {
			this.shopCatClose = data;
		},

		/**
		 * @description: 更改购物车类型；
		 * @param {string} data
		 * @return {*}
		 */
		setShopCartType(data: string) {
			this.shopCartType = data;
		},

		/**
		 * @description: 设置购物车显示
		 * @param {boolean} data
		 * @return {*}
		 */
		setShopCatShow(data: boolean) {
			this.shopCatShow = data;
		},
	},
});
