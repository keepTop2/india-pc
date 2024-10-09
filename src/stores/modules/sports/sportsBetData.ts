import { defineStore } from "pinia";
// import { showToast } from "vant";
import { i18n } from "/@/i18n/index";
import _ from "lodash";
import workerManage from "/@/webWorker/workerManage";
import { SportShopCartProcessWorkerCommandType, WorkerName } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { SportPushApi, WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { WorkerTransfer } from "/@/models/webWorkerModel";
import pubsub from "/@/pubSub/pubSub";
import { SportsRootObject, BetMarketInfo } from "/@/views/sports/models/interface";
import { useHaveToken } from "/@/hooks/useHaveToken";
const $: any = i18n.global;
interface sportsBetEvent {
	sportsBetShow: boolean;
	radioStatus: boolean;
	sportsBetEventData: SportsRootObject[];
	sportsLeagueSelect: SportsRootObject[];
	sportsEventInfo: any;
	combo: number;
	bettingStatus: number;

	/**实时请求 返回禁止下注的 MarketId */
	nobetsMarketIds: [];

	//联赛筛选与热门排序
	leagueList: [];
	hotLeagueList: null | [];

	//关注列表与赛事联赛id存储
	attentionList: [];
	attentionEventIdList: number[];
	attentionLeagueIdList: number[];
	// 判断当前关注的列表是赛事还是联赛
	attentionType: string;

	//存储折叠状态
	isFold: boolean;
	foldCount: number;
}

export const useSportsBetEventStore = defineStore("sportsBetEvent", {
	state: (): sportsBetEvent => {
		return {
			sportsBetShow: false, // 购物车关闭开启状态
			radioStatus: false, // 购物车接受赔率 默认不开启
			sportsBetEventData: [], // 购物车赛事数据
			sportsEventInfo: {}, // 储存当前选中的赛事盘口信息
			combo: 0, // 最大需要支持多少场投注赛事
			bettingStatus: 0, // 投注状态
			/** 返回禁止下注的 MarketId   */
			nobetsMarketIds: [],

			sportsLeagueSelect: [], // 选择的联赛
			leagueList: [], // 用于存储筛选的联赛列表
			hotLeagueList: null, // 存储热门联赛列表

			attentionList: [], //关注的赛事列表
			attentionEventIdList: [], //关注的赛事id列表
			attentionLeagueIdList: [], //关注的冠军id列表
			attentionType: "event", //当前显示的关注列表为冠军联赛还是赛事

			isFold: false, //是否折叠
			foldCount: 0,
		};
	},
	getters: {
		/**
		 * @description 获取储存当前选中的赛事盘口信息
		 */
		getEventInfo(): any {
			return this.sportsEventInfo;
		},
		/**
		 * @description: 禁止下注的 MarketId
		 * @return {*}
		 */
		getNobetsMarketIds(): any[] {
			return this.nobetsMarketIds;
		},
		/**
		 * @description 获取选中的联赛筛选
		 */
		getLeagueSelect(): SportsRootObject[] {
			return this.sportsLeagueSelect;
		},

		getMinCombo(): number {
			return this.combo;
		},

		/**
		 * @description 获取联赛列表
		 */
		getLeagueList(): [] {
			return this.leagueList;
		},
		getAttentionLeagueIdList(): number[] {
			return this.attentionLeagueIdList;
		},
		getAttentionEventIdList(): number[] {
			return this.attentionEventIdList;
		},
	},

	actions: {
		/**
		 * @description 添加赛事到购物车
		 * @param data  赛事信息
		 */
		async addEventToCart(data) {
			const haveToken = useHaveToken();
			// 用户未登录，直接返回
			if (!haveToken()) return;
			const eventId = data.eventId;
			const existingIndex = this.sportsBetEventData.findIndex((item) => item.eventId === eventId);
			if (existingIndex !== -1) {
				// 当前数据对象已存在于数组中，替换它
				this.sportsBetEventData.splice(existingIndex, 1, data);
			} else if (this.sportsBetEventData.length >= 10) {
				// showToast($.t('sports["最多选择场比赛"]', { value: 10 }));
				return;
			} else {
				// 当前数据对象不存在于数组中，新增它
				this.sportsBetEventData.push(data);
			}

			// 赛事添加格式化数据
			this.processingInfo();
		},

		processingInfo() {
			// 提取共同的处理逻辑
			const processEvent = (v) => {
				const eventInfo = this.sportsEventInfo[v.eventId];
				const { betType, marketId, selectionKey } = eventInfo;
				const market: any = Object.values(v.markets).find((item: any) => item.betType == betType && item.marketId == marketId) || {};
				v.betMarketInfo = {
					betType: betType,
					betTypeName: market.betTypeName,
					marketId: marketId,
					marketStatus: market.marketStatus,
					combo: market.combo || 0,
				};
				const selection = market.selections ? market.selections.find((s) => s.key == selectionKey) : null;
				if (selection) {
					v.betMarketInfo = {
						...v.betMarketInfo,
						key: selection.key,
						keyName: selection.keyName,
						point: selection.point,
						decimalPrice: selection.oddsPrice.decimalPrice,
					};
				}
			};
			if (this.sportsBetEventData.length === 1) {
				this.combo = 0;
				const [v] = this.sportsBetEventData;
				processEvent(v);
			} else if (this.sportsBetEventData.length > 1) {
				const comparedIndex = this.sportsBetEventData.findIndex((data) => data.eventStatus === "running" && data.isParlay);
				this.sportsBetEventData.forEach((v) => {
					processEvent(v);
					if (comparedIndex !== -1) {
						v.betMarketInfo.differentBalls = v.sportType !== this.sportsBetEventData[comparedIndex].sportType;
					}
					if (v.betMarketInfo.combo) {
						if (v.betMarketInfo.combo > this.combo) {
							this.combo = v.betMarketInfo.combo;
						}
					}
				});
			}
			console.log("处理完之后的购物车数据", this.sportsBetEventData);

			// 判断投注状态
			this.examineEventsStatus();
		},

		/**
		 * @description 判断盘口状态是否异常；
		 * 0 正常下注
		 * 1 盘口关闭
		 * 2 不支持串关
		 * 3 未达到赛事数量要求
		 * 4 赔率变化
		 * 5 暂不支持下注
		 */
		examineEventsStatus() {
			if (this.sportsBetEventData.some((v) => v.eventStatus !== "running" || v.betMarketInfo?.marketStatus !== "running")) {
				this.bettingStatus = 1;
				console.log("==>>>>>>>盘口关闭", 1);
				return 1;
			}
			// 进行串关状态判断
			if (this.sportsBetEventData.length > 1 && this.sportsBetEventData.some((v) => v.betMarketInfo?.differentBalls || v.betMarketInfo?.combo === 0 || !v.isParlay)) {
				this.bettingStatus = 2;
				console.log("==>>>>>>>不支持串关", 2);
				return 2;
			}
			// 判断选择赛事的combo达到没 如未到提示
			if (this.sportsBetEventData.length < this.combo) {
				this.bettingStatus = 3;
				console.log("==>>>>>>>未达到赛事数量要求", 3, "串关要求:", this.combo);
				return 3;
			}
			// 判断支不支持投注
			if (this.sportsBetEventData.some((v) => v.betMarketInfo?.stateCode && v.betMarketInfo?.stateCode !== 0)) {
				this.bettingStatus = 5;
				console.log("==>>>>>>>暂不支持下注", 5);
				return 5;
			}
			// 如果赔率变化则推出
			if (this.bettingStatus === 4) {
				console.log("==>>>>>>>赔率变化", 4);
				return 4;
			}
			// 都支持则返回true
			this.bettingStatus = 0;
			return 0;
		},

		// 储存当前选中的赛事盘口信息
		async storeEventInfo(key, data) {
			const haveToken = useHaveToken();
			// 用户未登录，直接返回
			if (!haveToken()) return;
			if (!this.sportsEventInfo[key] && this.sportsBetEventData.length >= 10) {
				return;
			} else {
				this.sportsEventInfo[key] = data;
				// 拼接唯一标识
				this.sportsEventInfo[key].listKye = `${data.marketId}-${data.selectionKey}`;
				// 处理选中赛事ID
				this.getEventIdCollection();
			}
			console.log("this.sportsEventInfo", this.sportsEventInfo);
		},

		/**
		 * @returns 处理选中赛事ID
		 */
		getEventIdCollection() {
			let requestStr = "";
			const eventIdCollectionList = Object.keys(this.sportsEventInfo);
			eventIdCollectionList.forEach((key, index) => {
				if (index != eventIdCollectionList.length - 1) {
					requestStr += key + ",";
				} else {
					requestStr += key;
				}
			});
			return requestStr;
		},

		// 开启体育购物车sse线程
		sportsOpenSse() {
			// 先关闭购物车线程
			workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
			// 开启购物车线程
			workerManage.startWorker(WorkerName.sportShopCartProcessWorker);
			const sportsInfoStore = useSportsInfoStore();
			const params: OpenSportEventSourceParams = {
				apiUrl: SportsCommonFn.getSportPushApiUrl(),
				token: sportsInfoStore.getSportsToken,
				language: SportsCommonFn.getSportLanguage(),
				sportPushApi: SportPushApi.GetEvents_push,
				webToPushApi: WebToPushApi.sportsShopCart,
				params: {
					query: `$filter=eventId in (${this.getEventIdCollection()})`,
				},
			};
			const viewsToWorkData: WorkerTransfer<OpenSportEventSourceParams, SportShopCartProcessWorkerCommandType> = {
				workerName: WorkerName.sportShopCartProcessWorker,
				commandType: SportShopCartProcessWorkerCommandType.sportsShopCartViewChanges,
				data: params,
			};
			//发送SSE指令到线程管理器
			pubsub.publish(pubsub.PubSubEvents.WorkerEvents.viewToWorker.eventName, viewsToWorkData);
		},

		// 关闭体育购物车sse线程
		sportsCloseSse() {
			workerManage.stopWorker(WorkerName.sportShopCartProcessWorker);
		},

		// 删除购物车已添加的数据
		removeEventCart(data) {
			// 匹配购物车赛事善书
			const index = this.sportsBetEventData.findIndex((v) => v.eventId == data.eventId);
			this.sportsBetEventData.splice(index, 1);
			// 同时删除高亮选中状态
			delete this.sportsEventInfo[data.eventId];
			this.bettingStatus = 0; // 先恢复初始值，重新判断投注状态
			this.processingInfo();
			// 购物车数据为空关闭线程
			if (this.sportsBetEventData.length == 0) {
				console.log("购物车赛事清空时");
				this.closeShopCart(); // 关闭购物车弹窗
				this.sportsCloseSse(); // 关闭线程
			}
		},

		// 开启购物车
		openShopCart() {
			this.sportsBetShow = true;
			// 执行开启购物车线程
			this.sportsOpenSse();
		},

		// 关闭购物车
		closeShopCart() {
			this.sportsBetShow = false;
			this.sportsCloseSse(); // 关闭线程
		},

		// 清空购物车
		clearShopCart() {
			this.sportsBetEventData = [];
			this.sportsEventInfo = {};
			this.combo = 0;
			this.sportsCloseSse(); // 关闭线程
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

		// ----- 设置热门赛事 -------
		setHotLeagueList(list) {
			this.hotLeagueList = list;
		},
		// 清理热门赛事
		clearHotLeagueList() {
			this.hotLeagueList = null;
		},
		//存储关注数据
		setAttentionList(data) {
			this.attentionList = data;
			this.clearAttentionList();
			//筛选出对应的关注列表 赛事或冠军
			data.forEach((item) => {
				const { eventIds } = SportsCommonFn.formatAttention(item.list);
				if (item.type == 2) {
					// console.log(eventIds, "======eventIds");
					this.attentionEventIdList = eventIds;
				}
				if (item.type == 1) {
					this.attentionLeagueIdList = eventIds;
				}
			});
		},
		//清理关注列表
		clearAttentionList() {
			this.attentionEventIdList = [];
			this.attentionLeagueIdList = [];
		},
		//设置当前展示的是冠军关注还是赛事关注
		setAttentionType(type) {
			this.attentionType = type;
		},
		setIsFold(isFold) {
			this.isFold = isFold;
		},
		setFoldCount(count) {
			this.foldCount = count;
		},
	},
	persist: {
		key: "useSportsBetEventStore",
		storage: sessionStorage,
		paths: ["leagueList"],
	},
});
