import moment from "moment";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { formatEvent2League } from "/@/views/sports/utils/formattingViewData";

/**
 * @description 格式化markets数据为对象 以betType为key
 */
function formattingMarkets(markets: any[]) {
	const obj: any = {};
	const uniqueMarkets = Array.from(new Set(markets.map((market) => market.marketId))).map((marketId) => {
		return markets.find((market) => market.marketId === marketId);
	});
	uniqueMarkets.forEach((item: { sort: number; betType: string | number; marketId: any }) => {
		if (item.sort == 1 || item.sort == 0) {
			if (obj[item.betType]) {
				obj[`${item.betType}-${item.marketId}`] = item;
			} else {
				obj[item.betType.toString()] = item;
			}
		} else {
			obj[`${item.betType}-${item.marketId}`] = item;
		}
	});
	return obj;
}

/**
 * @description 格式化赛事数据，格式化后的数据结构为：
 * {
 *   sportType:[]
 * }
 * 在球类路由组件中 直接 state.childrenViewData[sportType] 即可取到对应的球类数据
 *
 * @param data： viewSportData
 * @param sportKey events | outrights
 * @param webToPushApi 目前仅用于格式化markets时判断是处理详情的还是列表的
 */
export const formattingChildrenViewData = (data: any, sportKey: string, webToPushApi?: string) => {
	// console.log(webToPushApi, "======webToPushApi");
	// 遍历data将体育类型提取为一级分类，对应的冠军列表配置在children
	let childrenViewData = {};

	// sportsType.forEach((type) => {
	let arr;
	if (sportKey == "events" || sportKey == "hotEvents") {
		// 除电子竞技 其他都取等于0的数据
		arr = data[sportKey];
		// 电子竞技单独处理，其他类型统一处理
		arr.forEach((item: { eventId: any; markets: any }) => {
			const markets = data.markets.filter((market: { eventId: any }) => market.eventId == item.eventId);
			item.markets = formattingMarkets(markets);
		});
		// 判断如果不是热门赛事sse推送标识，则就正常格式化为联赛
		if (webToPushApi !== WebToPushApi.promotionsEvent) {
			//格式化为联赛
			arr = formatEvent2League(arr);
		}
	}
	if (sportKey == "outrights") {
		// 冠军赛事排序：
		// 赛事开始时间＞赛事ID，若同开始时间，赛事ID小的放前面
		// 盘口排序：
		// 玩法序号＞盘口ID，同玩法序号，盘口ID小的放前面；
		// 超过投注截止时间赛事 将不显示在列表中

		/**
		 * @description 获取scopeType相匹配的冠军数据
		 */
		arr = data[sportKey].filter((sport: { sportType: string; teams: any[] }) => {
			// if (sport.sportType == sportKey) {
			// 对冠军下的队伍信息 按照 orid（优胜冠军赔率ID）进行排序
			sport.teams.sort((a: { orid: number }, b: { orid: number }) => {
				return a.orid - b.orid;
			});
			return sport;
			// }
		});
	}
	// console.log(JSON.parse(JSON.stringify(arr)), "=========arr");
	childrenViewData = arr;
	// });
	return childrenViewData;
};

/**
 * @description 格式化日期为时间戳用于排序
 */
export const formatDateToTimeStamp = (date: string): number => {
	return moment(date).valueOf();
};

// 将UTC时间转换为本地时区时间
export const convertUtcToUtc5AndFormat = (date: moment.MomentInput) => {
	return moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss");
};

// 将UTC时间转换为本地时区时间，并按指定格式输出
export const convertUtcToUtc5AndFormatMD = (date: string, format = "MM-DD HH:mm") => {
	return moment.utc(date).local().format(format);
};
