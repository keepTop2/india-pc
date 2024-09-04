// 体育静态文件
import sportsMap from "/@/views/sports/utils/sportsMap/sportsMap";
import moment from "moment";

import { formatEvent2League } from "/@/views/sports/utils/formattingViewData";

/**
 * @description 格式化markets数据为对象 以betType为key
 */
function formattingMarkets(markets) {
	const obj: any = {};
	markets.forEach((item) => {
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
 */
export const formattingChildrenViewData = (data: any, sportKey: string) => {
	// 获取体育字典 球类型
	const sportsType = Object.keys(sportsMap);
	// 遍历data将体育类型提取为一级分类，对应的冠军列表配置在children
	const childrenViewData = {};

	sportsType.forEach((type) => {
		let arr;
		if (sportKey == "events") {
			// 除电子竞技 其他都取等于0的数据
			arr = data[sportKey].filter((sport) => sport.sportType == type);
			// 电子竞技单独处理，其他类型统一处理
			arr.forEach((item) => {
				const markets = data.markets.filter((market) => market.eventId == item.eventId);
				item.markets = formattingMarkets(markets);
			});
			//格式化为联赛
			arr = formatEvent2League(arr);
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
			arr = data[sportKey].filter((sport) => {
				if (sport.sportType == type) {
					// 对冠军下的队伍信息 按照 orid（优胜冠军赔率ID）进行排序
					sport.teams.sort((a, b) => {
						return a.orid - b.orid;
					});
					return sport;
				}
			});
		}
		childrenViewData[type] = arr;
	});
	return childrenViewData;
};

/**
 * @description 格式化日期为时间戳用于排序
 */
export const formatDateToTimeStamp = (date: string): number => {
	return moment(date).valueOf();
};

// 格式化沙巴日期为utc-5
export const convertUtcToUtc5AndFormat = (date) => {
	return moment(date).subtract(5, "hour").format("YYYY-MM-DD HH:mm:ss");
};

// 格式化沙巴日期为utc-5
export const convertUtcToUtc5AndFormatMD = (date: string, temp = "MM-DD HH:mm") => {
	return moment(date).subtract(5, "hour").format(temp);
};
