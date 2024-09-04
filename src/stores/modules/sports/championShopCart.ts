/*
 * @Author: WangMingxin
 * @Description: 冠军-购物车-数据；
 */
import { defineStore } from "pinia";
import { SportsRootObject } from "/@/views/sports/models/interface";

import { i18n } from "/@/i18n";

import { sportsOpenSse, sportsCloseSse, getEventIdCollection } from "/@/views/sports/utils/sportsBetTool";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

import { ElMessage, MessageHandler } from "element-plus";
import { useToLogin } from "/@/hooks/toLogin";
const $: any = i18n.global;
interface ChampionShopCart {
	outrightBetShow: boolean;
	/** 冠军购物车数据 */
	outrightBetData: SportsRootObject[];
	/** 冠军购物车数据 */
	outrightBetObj: any;
}
export const useChampionShopCartStore = defineStore("ChampionShopCart", {
	state(): ChampionShopCart {
		return {
			outrightBetShow: false,
			outrightBetData: [], // 冠军购物车数据
			outrightBetObj: {}, // 冠军购物车数据
		};
	},
	getters: {
		/**
		 * @description:获取购物车冠军数组；
		 * @return {*}
		 */
		getOutrightBetData(): any {
			return this.outrightBetData;
		},
		/**
		 * @description 获取储存当前选中的冠军盘口信息
		 */
		getOutrightBetObj(): any {
			return this.outrightBetObj;
		},
	},
	actions: {
		// 开启冠军购物车
		openOutrightShopCart() {
			this.outrightBetShow = true;
		},
		// 关闭冠军购物车
		closeOutrightShopCart() {
			this.outrightBetShow = false;
		},

		// 清空冠军购物车
		clearOutrightShopCart() {
			this.outrightBetData = [];
			this.outrightBetObj = {};
			sportsCloseSse();
			// this.outrightCloseSse();
		},

		// 删除冠军购物车已添加的数据
		removeOutrightTEventCart(data) {
			const index = this.outrightBetData.findIndex((v) => v?.leagueId == data.leagueId);
			this.outrightBetData.splice(index, 1);
			delete this.outrightBetObj[data.leagueId];

			if (this.outrightBetData.length) {
				/**开启sse*/
				sportsOpenSse(this.outrightBetObj);
			} else if (this.outrightBetData.length == 0) {
				// 购物车数据为0停止线程
				sportsCloseSse();
			}
		},
		/**
		 * @description SSE推送的最新冠军购物车数据
		 * @param data SSE推送数据源的数据
		 */
		outrightShopCartSSEProcess(data) {
			this.outrightBetData.forEach((v) => {
				const outrightIndex = data.findIndex((i) => i.leagueId === v.leagueId);
				data[outrightIndex].teams.forEach((t) => {
					if (t.orid == v.orid) {
						v = Object.assign({}, v, t);
					}
				});
			});
		},
		/**
		 * @description 添加冠军赛事到购物车
		 * @param data  赛事信息
		 */
		async addOutrightToCart(data) {
			const { isHaveToken, toLogin } = useToLogin();
			const res = await isHaveToken()
				.then((res) => res)
				.catch((err) => err);
			if (res.code == 500) {
				return false;
			}

			if (this.outrightBetData.length >= 10) {
				ElMessage({
					message: "最多选择10场比赛",
					customClass: "weak-hint",
				});
				return false;
			}

			const ShopCatControlStore = useShopCatControlStore();
			const leagueId = data.leagueId;
			const index = this.outrightBetData.findIndex((item) => item.leagueId === leagueId);
			if (index != -1) {
				this.outrightBetData.splice(index, 1);
			} else {
				if (this.outrightBetData.length >= 10) {
					// showToast($.t('sports["最多选择场比赛"]', { value: 10 }));
					return;
				}
			}
			this.outrightBetObj[data.leagueId] = data;
			this.outrightBetData.push(data);
			/**开启sse*/
			sportsOpenSse(this.outrightBetObj);
			/**如果购物车显示 小于1, 则主动显示一次 */
			if (ShopCatControlStore.getShopCatShowCount < 1) {
				ShopCatControlStore.setShopCatShow(true);
			}
		},
	},
});
