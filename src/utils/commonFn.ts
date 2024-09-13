import Common from "/@/utils/common";
import CommonApi from "/@/api/common";
import sportsApi from "/@/api/venueHome/sports";
import shopCartPubSub from "/@/views/venueHome/sports/hooks/shopCartPubSub";
import { useSportsBetEventStore } from "/@/store/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/store/modules/sports/sportsBetInfo";
import { useSportsBetChampionStore } from "/@/store/modules/sports/sportsBetChampionData";
import { useLoading } from "/@/directives/loading/hooks";
import dayjs from "dayjs";
import { convertUtcToUtc5AndFormat } from "/@/webWorker/module/utils/formattingChildrenViewData";

// 请求余额信息
export const getIndexInfo = async () => {
	const sportsBetInfo = useSportsBetInfoStore();
	const res = await CommonApi.getIndexInfo().catch((err) => err);
	if (res.code == Common.getInstance().ResCode.SUCCESS) {
		sportsBetInfo.balance = res.data.totalBalance;
	}
};

/**
 * @description 请求注单ID
 */
export const getBetOrderId = async () => {
	const sportsBetInfo = useSportsBetInfoStore();
	const res = await sportsApi.getBetOrderId().catch((err) => err);
	if (res.code === Common.getInstance().ResCode.SUCCESS) {
		sportsBetInfo.vendorTransId = res.data;
	}
};

// 请求接受赔率信息
export const getPublicSetting = async () => {
	const { stopLoading } = useLoading();
	const sportsBetEvent = useSportsBetEventStore();
	const params = {
		type: "sport_odds",
	};
	const res = await sportsApi.getPublicSetting(params).catch((err) => err);
	if (res.code == Common.getInstance().ResCode.SUCCESS) {
		stopLoading();
		if (res.data.length > 0) {
			const data = res.data[0];
			sportsBetEvent.radioStatus = data.value == "0" ? false : true;
		}
	}
};

/**
 * @description 请求单关注单信息
 */
export const getSingleTicket = async () => {
	const sportsBetEvent = useSportsBetEventStore();
	const sportsBetInfo = useSportsBetInfoStore();
	// 取单关赛事盘口投注信息 单关赛事为一条 取购物车数据第一条
	const singleTicketInfo = sportsBetEvent.sportsBetEventData[0];
	// 投注参数
	const params = {
		sportType: singleTicketInfo.sportType,
		marketId: singleTicketInfo.betMarketInfo?.marketId,
		key: singleTicketInfo.betMarketInfo?.key,
	};
	// 请求单关信息
	const res: any = await sportsApi.GetSingleTicket(params, { showLoading: false }).catch((err) => {
		marketClosingError(err.response.data);
	});
	if (res?.status == 200) {
		sportsBetInfo.addSingleTicketInfo(res.data);
		// 获取最新信息之后动态更新输入框金额
		const stake = computed(() => shopCartPubSub.getSingleTicketBetValue());
		// 读取单关投注金额
		if (stake.value) shopCartPubSub.getSingleTicketBetValue();
		// 处理单关赔率
		handlingSingleTicketOdds(res.data);
		// 正常恢复状态
		restoreStatus();
	}
};

/**
 * @description 请求串关信息
 */
export const getParlayTickets = async () => {
	const sportsBetEvent = useSportsBetEventStore();
	const sportsBetInfo = useSportsBetInfoStore();
	const { sportsBetEventData } = sportsBetEvent;
	// 拼接参数
	const newArr = sportsBetEventData.map(({ sportType, betMarketInfo }) => ({
		sportType,
		marketId: betMarketInfo.marketId,
		point: betMarketInfo.point,
		key: betMarketInfo.key,
	}));
	const params = {
		parlayTickets: newArr,
	};
	try {
		const res = await sportsApi.GetParlayTickets(params, { showLoading: false });
		// console.log("res", res);
		if (res?.status === 200) {
			sportsBetInfo.addParlayTicketsInfo(res.data);
			//设置串关投注金额
			const betValueState = computed(() => shopCartPubSub.betValueState);
			const comboTypeData = {};
			res.data.combos.forEach((item) => {
				const { comboType, maxBet } = item;
				// console.log("maxBet", maxBet);
				if (betValueState.value[comboType]) {
					if (!comboTypeData[comboType]) {
						comboTypeData[comboType] = betValueState.value[comboType];
					}
					if (comboTypeData[comboType] > maxBet) {
						betValueState.value[comboType] = maxBet;
					}
				}
			});
			handlingParlayTicketsOdds(res.data);
			restoreStatus();
			const filteredPriceInfo = res.data.priceInfo.filter((price) => price.stateCode != 0);
			console.log("filteredPriceInfo", filteredPriceInfo);
			if (filteredPriceInfo.length > 0) {
				filteredPriceInfo.forEach((i) => {
					const index = sportsBetEvent.sportsBetEventData.findIndex((v) => v.betMarketInfo.marketId == i.marketId);
					if (index !== -1) {
						sportsBetEvent.sportsBetEventData[index].betMarketInfo.stateCode = i.stateCode;
					}
				});
				console.log("sportsBetEventData", sportsBetEvent.sportsBetEventData);
				sportsBetEvent.examineEventsStatus();
			}
			// const data = {
			// 	statusCode: 400,
			// 	errorCode: "B033",
			// 	message: "Parlay Same Event ; MarketIds : 702640183,700115095",
			// 	details: {},
			// 	traceId: "a456305b7586ceee8dc9144c465112a5",
			// };
			// marketClosingErrors(data);
		} else {
			console.log("==", res?.data?.errorCode, res?.data?.message);
		}
	} catch (err: any) {
		// console.log("err", err);
		marketClosingErrors(err.response.data);
	}
};

//  请求冠军单关信息
export const getOutrightTicket = async () => {
	const sportsBetChampion = useSportsBetChampionStore();
	const sportsBetInfo = useSportsBetInfoStore();
	const singleTicketInfo = sportsBetChampion.championBetData[0];
	// 投注参数
	const params = {
		sportType: singleTicketInfo.sportType,
		orid: singleTicketInfo.orid,
	};
	const res = await sportsApi.GetOutrightTicket(params, { showLoading: false }).catch((err) => err);
	if (res.status == 200) {
		sportsBetInfo.addChampionSingleTicketInfo(res.data);
	} else {
		// 异常
	}
};

// 单关轮训注单信息盘口关闭的错误状态
const marketClosingError = (errInfo) => {
	const sportsBetEvent = useSportsBetEventStore();
	const regexes = ["B005", "B015", "B016"];
	if (regexes.includes(errInfo.errorCode)) {
		sportsBetEvent.sportsBetEventData.forEach((v) => {
			v.betMarketInfo.marketStatus = "";
		});
		// 重新获取一下状态
		sportsBetEvent.examineEventsStatus();
	}
};

// 处理注单信息盘口关闭的错误状态
const marketClosingErrors = (errInfo) => {
	const sportsBetEvent = useSportsBetEventStore();
	if (errInfo.errorCode == "B039") {
		const marketIds: any = [];
		// 获取marketId
		errInfo.details?.getParlayTickets.combos.forEach((combo) => {
			combo.abnormalMarketList.forEach((abnormalMarket) => {
				const { marketId } = abnormalMarket;
				if (!marketIds.includes(marketId)) {
					marketIds.push(marketId);
				}
			});
		});
		console.log("B039marketIds", marketIds);
		if (marketIds.length > 0) {
			sportsBetEvent.sportsBetEventData.forEach((v) => {
				if (marketIds.includes(v.betMarketInfo.marketId)) {
					v.betMarketInfo.differentBalls = true;
				}
			});
		}
		// 过滤出stateCode不等于0
		const filteredPriceInfo = errInfo.details.getParlayTickets.priceInfo.filter((price) => price.stateCode != 0);
		console.log("B039filteredPriceInfo", filteredPriceInfo);
		if (filteredPriceInfo.length > 0) {
			filteredPriceInfo.forEach((i) => {
				const index = sportsBetEvent.sportsBetEventData.findIndex((v) => v.betMarketInfo.marketId == i.marketId);
				if (index !== -1) {
					sportsBetEvent.sportsBetEventData[index].betMarketInfo.stateCode = i.stateCode;
				}
			});
		}
		console.log("sportsBetEvent.sportsBetEventData", sportsBetEvent.sportsBetEventData);
	} else {
		const regexes = [
			{ errorCode: "B005", regex: /Event Closed or Invalid Market ; Market ID (.+)/ },
			{ errorCode: "B015", regex: /Market ID (.+?): Close price/ },
			{ errorCode: "B016", regex: /Market ID (.+?): Market closed/ },
			{ errorCode: "B033", regex: /Parlay Same Event ; MarketIds : (.+)/ },
		];
		regexes.forEach(({ errorCode, regex }) => {
			if (errInfo.errorCode == errorCode) {
				const match = errInfo.message.match(regex);
				console.log("匹配ids", match);
				if (match) {
					const ids = match[1].split(/[,\s]+/);
					console.log("组装ids", ids);
					sportsBetEvent.sportsBetEventData.forEach((v) => {
						if (ids.includes(String(v.betMarketInfo.marketId))) {
							if (errorCode == "B033" || errorCode == "B005") {
								v.betMarketInfo.differentBalls = true;
							} else {
								v.betMarketInfo.marketStatus = "";
							}
						}
					});
				}
			}
		});
	}
	sportsBetEvent.examineEventsStatus();
};

// 恢复正常投注状态
export const restoreStatus = () => {
	const sportsBetEvent = useSportsBetEventStore();
	// 恢复投注状态
	const comparedIndex = sportsBetEvent.sportsBetEventData.findIndex((data) => data.eventStatus === "running" && data.isParlay);
	sportsBetEvent.sportsBetEventData.forEach((v) => {
		const { betMarketInfo, sportType } = v;
		betMarketInfo.marketStatus = "running";
		betMarketInfo.stateCode = 0;
		if (comparedIndex !== -1) {
			betMarketInfo.differentBalls = sportType != sportsBetEvent.sportsBetEventData[comparedIndex].sportType;
		}
	});
	sportsBetEvent.examineEventsStatus();
};

// 处理单关赔率变化
const handlingSingleTicketOdds = (data) => {
	const sportsBetEvent = useSportsBetEventStore();
	const index = sportsBetEvent.sportsBetEventData.findIndex((i) => i.betMarketInfo.marketId == data.marketId);
	if (index !== -1) {
		const { betMarketInfo, gameInfo } = sportsBetEvent.sportsBetEventData[index];
		gameInfo.liveHomeScore = data.liveHomeScore;
		gameInfo.liveAwayScore = data.liveAwayScore;
		betMarketInfo.point = data.point;
		if (data.payoutRate !== betMarketInfo.decimalPrice) {
			updateOddsChange(betMarketInfo, data.payoutRate, betMarketInfo.decimalPrice);
		}
	}
};

// 处理串关赔率变化
const handlingParlayTicketsOdds = (data) => {
	const sportsBetEvent = useSportsBetEventStore();
	data.priceInfo.forEach((item) => {
		const index = sportsBetEvent.sportsBetEventData.findIndex((i) => i.betMarketInfo.marketId == item.marketId);
		if (index !== -1) {
			const { betMarketInfo, gameInfo } = sportsBetEvent.sportsBetEventData[index];
			gameInfo.liveHomeScore = item.liveHomeScore;
			gameInfo.liveAwayScore = item.liveAwayScore;
			betMarketInfo.point = item.point;
			if (item.currentPrice !== betMarketInfo.decimalPrice) {
				updateOddsChange(betMarketInfo, item.currentPrice, betMarketInfo.decimalPrice);
			}
		}
	});
};

// 赔率变化
const updateOddsChange = (betMarketInfo, currentPrice, previousPrice) => {
	const sportsBetEvent = useSportsBetEventStore();
	if (currentPrice > previousPrice) {
		betMarketInfo.oddsChange = "oddsUp";
		// 改变按钮投注状态
		if (!sportsBetEvent.radioStatus) {
			sportsBetEvent.bettingStatus = 4;
		}
	} else if (currentPrice < previousPrice) {
		betMarketInfo.oddsChange = "oddsDown";
		// 改变按钮投注状态
		sportsBetEvent.bettingStatus = 4;
	} else {
		betMarketInfo.oddsChange = "";
	}
	betMarketInfo.decimalPrice = currentPrice;
};

// 格式化赛事开始日期，适应设计图格式
export const timeFormate = (globalShowTime) => {
	if (globalShowTime) {
		const date = dayjs(convertUtcToUtc5AndFormat(globalShowTime)).format("MM-DD");
		const time = dayjs(convertUtcToUtc5AndFormat(globalShowTime)).format("HH:mm");
		return {
			date,
			time,
		};
	} else {
		return {
			date: "00-00",
			time: "00:00",
		};
	}
};
