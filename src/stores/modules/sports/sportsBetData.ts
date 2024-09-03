/*
 * @Author: WangMingxin
 * @Description: 购物车数据
 */
import { defineStore } from "pinia";
import { merge } from "lodash-es";
import { SportsRootObject, BetMarketInfo } from "/@/models/interface";
import { processingInfo, sportsOpenSse, sportsCloseSse, getEventIdCollection, examineEventsStatus } from "/@/utils/sports/sportsBetTool";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { ElMessage, MessageHandler } from "element-plus";
import { useToLogin } from "/@/hooks/toLogin";

interface sportsBetEvent {
	/**实时请求 返回关闭的 MarketId */
	closeMarketIds: string[];
	/**实时请求 返回不支持串关的 MarketId */
	unSeriesMarketIds: string[];
	/**实时请求 返回不同球类的 MarketId */
	differentBetTypeMarketIds: string[];
	/**实时请求 返回禁止下注的 MarketId */
	nobetsMarketIds: [];

	/** 购物车接受赔率 默认开启 */
	radioStatus: boolean;
	/** 购物车赛事数据 */
	sportsBetEventData: SportsRootObject[];
	/** 选择的联赛 */
	sportsLeagueSelect: SportsRootObject[];
	/** 储存当前选中的赛事盘口信息 */
	sportsEventInfo: any;
	/** 最少需要的投注赛事 */
	combo: number;
	/** 投注状态 */
	bettingStatus: number;
	/** 用于存储筛选的联赛列表 */
	leagueList: [];
	/** 存储热门联赛列表 */
	hotLeagueList: [];
	/** 单关 下注选项 0：不接受盘口变更(预设) ; 1：只接受更好的赔率; 2：接受任何赔率变更 */
	oddsOption: number;
	/** 单关时任何 赔率弹窗 */
	oddsOptionMassge: number;

	/** 串关 下注选项 0：不接受盘口变更 (预设) ; 1：接受任何赔率  */
	priceOption: number;
	/** 购物车显示次数 */
	sportsBetShowCount?: number;
}
export const useSportsBetEventStore = defineStore("sportsBetEvent", {
	state: (): sportsBetEvent => {
		return {
			/**实时请求 返回关闭的 MarketId */
			closeMarketIds: [],
			/** 返回不同球类的 MarketId   */
			differentBetTypeMarketIds: [],
			/** 返回禁止下注的 MarketId   */
			nobetsMarketIds: [],
			radioStatus: true, // 购物车接受赔率 默认开启
			sportsBetEventData: [], // 购物车赛事数据
			sportsEventInfo: {}, // 储存当前选中的赛事盘口信息
			combo: 0, // 最大需要支持多少场投注赛事
			bettingStatus: 0, // 投注状态

			sportsLeagueSelect: [], // 选择的联赛

			leagueList: [], // 用于存储筛选的联赛列表
			hotLeagueList: [], // 存储热门联赛列表
			oddsOption: 1,
			priceOption: 1,
			oddsOptionMassge: 0,
			/** 购物车显示次数 */
			sportsBetShowCount: 0,
		};
	},
	getters: {
		/**
		 * @description:实时返回 非串关的 MarketId
		 * @return {*}
		 */
		getUnSeriesMarketIds(): string[] {
			return this.nobetsMarketIds;
		},
		/**
		 * @description: 禁止下注的 MarketId
		 * @return {*}
		 */
		getNobetsMarketIds(): any[] {
			return this.nobetsMarketIds;
		},
		/**
		 * @description: 获取不同球类的 MarketId
		 * @return {*}
		 */
		getDifferentBetTypeMarketIds(): string[] {
			return this.differentBetTypeMarketIds;
		},
		/**
		 * @description: 获取关闭的MarketId;
		 * @return {*}
		 */
		getCloseMarketIds(): string[] {
			return this.closeMarketIds;
		},
		/**
		 * @description: 接受任何赔率弹窗 (接受更好赔率取消时第一次弹出)
		 * @return {*}
		 */
		getOddsOptionMassge(): any {
			return this.oddsOptionMassge;
		},
		/**
		 * @description:接受单关 赔率变化 状态
		 * @return {*}
		 */
		getOddsOption(): any {
			return this.oddsOption;
		},
		/**
		 * @description:接受串关 赔率变化 状态
		 * @return {*}
		 */
		getPriceOption(): any {
			return this.priceOption;
		},
		/**
		 * @description:获取投注状态
		 * @return {*}
		 */
		getBettingStatus(): any {
			return this.bettingStatus;
		},
		/**
		 * @description 获取储存当前选中的赛事盘口信息
		 */
		getEventInfo(): any {
			return this.sportsEventInfo;
		},

		/**
		 * @description 获取选中的联赛筛选
		 */
		getLeagueSelect(): SportsRootObject[] {
			return this.sportsLeagueSelect;
		},
		/**
		 * @description 获取联赛列表
		 */
		getLeagueList(): [] {
			return this.leagueList;
		},
	},

	actions: {
		/**
		 * @description:实时返回 非串关的 MarketId
		 * @return {*}
		 */
		setUnSeriesMarketIds(data: []): string[] {
			this.unSeriesMarketIds = data;
			/*处理购物车列表信息*/
			const { EventData, combo } = processingInfo(
				this.sportsBetEventData,
				this.sportsEventInfo,
				this.closeMarketIds,
				this.differentBetTypeMarketIds,
				this.nobetsMarketIds,
				this.unSeriesMarketIds
			);
			// 判断投注状态
			this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
			this.sportsBetEventData = EventData;
			this.combo = combo;
		},
		/**
		 * @description: 设置禁止投注的marketId
		 * @return {*}
		 */
		setNobetsMarketIds(data: []) {
			this.nobetsMarketIds = data;
			/*处理购物车列表信息*/
			const { EventData, combo } = processingInfo(
				this.sportsBetEventData,
				this.sportsEventInfo,
				this.closeMarketIds,
				this.differentBetTypeMarketIds,
				this.nobetsMarketIds,
				this.unSeriesMarketIds
			);
			// 判断投注状态
			this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
			this.sportsBetEventData = EventData;
			this.combo = combo;
		},
		/**
		 * @description: 设置不同球内的marketId
		 * @return {*}
		 */
		setDifferentBetTypeMarketIds(data: string[]) {
			this.differentBetTypeMarketIds = data;
			/*处理购物车列表信息*/
			const { EventData, combo } = processingInfo(
				this.sportsBetEventData,
				this.sportsEventInfo,
				this.closeMarketIds,
				this.differentBetTypeMarketIds,
				this.nobetsMarketIds,
				this.unSeriesMarketIds
			);
			// 判断投注状态
			this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
			this.sportsBetEventData = EventData;
			this.combo = combo;
		},
		/**
		 * @description: 设置关闭的marketId
		 * @return {*}
		 */
		setCloseMarketIds(data: string[]) {
			this.closeMarketIds = data;
			/*处理购物车列表信息*/
			const { EventData, combo } = processingInfo(
				this.sportsBetEventData,
				this.sportsEventInfo,
				this.closeMarketIds,
				this.differentBetTypeMarketIds,
				this.nobetsMarketIds,
				this.unSeriesMarketIds
			);
			// 判断投注状态
			this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
			this.sportsBetEventData = EventData;
			this.combo = combo;
		},
		/**
		 * @description: 接受任何赔率弹窗 (接受更好赔率取消时第一次弹出)
		 * @return {*}
		 */
		setOddsOptionMassge(data?: number | null) {
			if (data) {
				this.oddsOptionMassge = data;
			} else {
				this.oddsOptionMassge += 1;
			}
		},
		/**
		 * @description:设置单关 赔率变化 状态
		 * @return {*}
		 */
		setOddsOption(data: number): any {
			this.oddsOption = data;
		},

		/**
		 * @description:设置串关 赔率变化 状态
		 * @return {*}
		 */
		setPriceOption(data: number) {
			this.priceOption = data;
		},

		/**
		 * @description 添加赛事到购物车
		 * @param data  赛事信息
		 */
		async addEventToCart(data) {
			const { isHaveToken, toLogin } = useToLogin();
			const res = await isHaveToken()
				.then((res) => res)
				.catch((err) => err);
			if (res.code == 500) {
				return false;
			}
			if (this.sportsBetEventData.length >= 10) {
				ElMessage({
					message: "最多选择10场比赛",
					customClass: "weak-hint",
				});
				return false;
			}
			const ShopCatControlStore = useShopCatControlStore();
			const eventId = data.eventId;
			const existingIndex = this.sportsBetEventData.findIndex((item) => item.eventId === eventId);
			if (existingIndex !== -1) {
				// 当前数据对象已存在于数组中，替换它
				this.sportsBetEventData.splice(existingIndex, 1, data);
			} else {
				// 当前数据对象不存在于数组中，新增它
				this.sportsBetEventData.push(data);
			}
			// 赛事添加格式化数据
			sportsOpenSse(this.sportsEventInfo);
			/*处理购物车列表信息*/
			const { EventData, combo } = processingInfo(
				this.sportsBetEventData,
				this.sportsEventInfo,
				this.closeMarketIds,
				this.differentBetTypeMarketIds,
				this.nobetsMarketIds,
				this.unSeriesMarketIds
			);
			// 判断投注状态
			this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
			this.sportsBetEventData = EventData;
			this.combo = combo;
			/**如果购物车显示 小于1, 则主动显示一次 */
			if (ShopCatControlStore.getShopCatShowCount < 1) {
				ShopCatControlStore.setShopCatShow(true);
			}
		},

		/**
		 * @description SSE推送的最新购物车数据
		 * @param data SSE推送数据源的数据
		 */
		shopCartSSEProcess(data) {
			data.forEach((v) => {
				this.sportsBetEventData.forEach((i) => {
					if (v.eventId == i.eventId) {
						// 如果找到匹配项，合并对象  进行深度合并不然嵌套的内容会被覆盖掉
						i = merge(i, v);
					}
				});
			});
			/** 处理购物车列表信息*/
			const { EventData, combo } = processingInfo(
				this.sportsBetEventData,
				this.sportsEventInfo,
				this.closeMarketIds,
				this.differentBetTypeMarketIds,
				this.nobetsMarketIds,
				this.unSeriesMarketIds
			);
			// 判断投注状态
			this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
			this.sportsBetEventData = EventData;
			this.combo = combo;
		},

		// 储存当前选中的赛事盘口信息
		async storeEventInfo(key, data) {
			const { isHaveToken, toLogin } = useToLogin();
			const res = await isHaveToken(false)
				.then((res) => res)
				.catch((err) => err);
			if (res.code == 500) {
				return false;
			}
			if (this.sportsBetEventData.length >= 10) {
				return false;
			}
			if (this.sportsEventInfo) this.sportsEventInfo[key] = data;
			// 拼接唯一标识
			this.sportsEventInfo[key].listKye = `${data.marketId}-${data.selectionKey}`;
			// 处理选中赛事ID
			// getEventIdCollection(this.sportsEventInfo);
		},

		// 删除购物车已添加的数据
		removeEventCart(data) {
			// console.log("data", data);
			// 匹配购物车赛事善书
			const index = this.sportsBetEventData.findIndex((v) => v.eventId == data.eventId);
			this.sportsBetEventData.splice(index, 1);
			// 同时删除高亮选中状态
			delete this.sportsEventInfo[data.eventId];

			if (this.sportsBetEventData.length) {
				/*处理购物车列表信息*/
				const { EventData, combo } = processingInfo(
					this.sportsBetEventData,
					this.sportsEventInfo,
					this.closeMarketIds,
					this.differentBetTypeMarketIds,
					this.nobetsMarketIds,
					this.unSeriesMarketIds
				);
				// 判断投注状态
				this.bettingStatus = examineEventsStatus(this.sportsBetEventData, this.radioStatus, this.combo);
				this.sportsBetEventData = EventData;
				this.combo = combo;
			} else if (this.sportsBetEventData.length == 0) {
				// 购物车数据为空关闭线程
				sportsCloseSse();
			}
		},

		// 清空购物车
		clearShopCart() {
			this.sportsBetEventData = [];
			this.sportsEventInfo = {};
			this.combo = 0;
			sportsCloseSse();
		},

		// ======== 联赛⬇

		//存储选中的联赛
		setSportsLeagueSelect(data) {
			this.sportsLeagueSelect = data;
		},
		//清除选中的联赛
		clearLeagueSelect() {
			this.sportsLeagueSelect = [];
		},

		// 联赛列表，直接由赛事列表存储起来用于筛选
		setSelectLeaguesList(data) {
			this.leagueList = data;
		},
	},
	persist: {
		key: "useSportsBetEventStore",
		storage: sessionStorage,
		paths: ["leagueList"],
	},
});
