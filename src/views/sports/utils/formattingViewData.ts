import { isEmpty } from "lodash-es";
// 体育静态文件
import sportsMap from "./sportsMap/sportsMap";
import { Market, SportsRootObject } from "/@/views/sports/models/interface";

/**
 * @description 格式化赛果体育项目数据
 */

export const formattingResultViewData = (data: any) => {
	// 获取体育字典 球类型
	const sportsType = Object.keys(sportsMap);
	return sportsType.map((item) => {
		//根据sportType筛选出对应的数据
		const result = data.find((bItem) => bItem.sportType == item);
		// 遍历data将字典中的icon等字段添加到赛果体育项目中
		return {
			...sportsMap[item],
			...result,
			count: result.eventResults,
		};
	});
};

/**
 * @description 处理markets数据
 * @param teamData 列表数据里的markets数据
 * @param betType 对应betType
 * @param selectionsLength 对应selections的长度（用于设置空数据量）
 */
export const marketsMatchData = (data: any[], betType: number, selectionsLength: number = 1) => {
	// console.info("列表数据里的markets数据", data, betType);
	let filterMarketData = {};
	try {
		filterMarketData = data.find((v) => v.betType == betType);
	} catch (error) {
		filterMarketData = data[betType];
	}
	// 获取 selections, marketId
	if (filterMarketData && filterMarketData?.marketId) {
		let { selections, marketId, marketStatus } = filterMarketData;
		if (selections.length > 0) {
			// market不为空直接返回对应的selections 玩法信息
			return { marketId, selections, marketStatus };
		}
	} else {
		// 如果market为空，则返回默认数量的空数组用于填充页面
		let selectionsInitArr = [] as any[];
		if ([5, 15].includes(betType)) {
			selectionsInitArr = Array(3).fill(null);
		} else if ([1, 3, 7, 8].includes(betType)) {
			selectionsInitArr = Array(2).fill(null);
		} else {
			selectionsInitArr = Array(selectionsLength).fill(null);
		}
		return { marketId: "", marketStatus: "", selections: selectionsInitArr };
	}
};
/**
 * @description: 数组形式获取markets信息；
 * @param {Market} markets
 * @param {number} betTypes
 * @return {*}
 */
const filterMarkets = (markets: Market[], betTypes: number[]): Market[] => {
	const results: Market[] = [];

	betTypes.forEach((type) => {
		const marketItem = markets[type];
		if (marketItem) {
			results.push(marketItem);
		} else {
			const selectionsCount = DEFAULT_SELECTIONS_MAP[type] || 0;
			results.push({ betType: type, selections: Array(selectionsCount).fill(null) } as Market);
		}
	});

	return results;
};

/**
 * @description 获取体育数据并格式化为联赛
 */
export const formatEvent2League = (events) => {
	const leagueList: any = {};

	events &&
		events.forEach((item) => {
			const league = leagueList[item.leagueId];
			const { leagueId, leagueName, leagueIconUrl } = item;
			if (league) {
				leagueList[leagueId].events.push(item);
			} else {
				leagueList[leagueId] = {
					leagueId,
					leagueName,
					leagueIconUrl,
					events: [item],
				};
			}
		});
	return Object.values(leagueList);
};

/**
 * @description 格式化markets数据为对象 以betType为key
 */
export function formattingMarkets(markets) {
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
 * @description: [{event:{},markets:[]}]；格式数据序列化；
 * @param {*} data 原始数组 [{event:{},markets:[]}]
 * @return {*}
 */
export const formattingSportArrayData = (data) => {
	let arr = [];
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		const params = {
			...item.event,
			markets: formattingMarkets(data[i].markets),
		};
		arr.push(params);
	}
	return arr;
};

/**
 * @description 赛事详情中根据 betType 判断  是否正数添加 +号
 */

export const shouldShowPoint = (betType: number | string) => {
	// 将传入的betType转换为字符串
	const betTypeStr = betType.toString();

	// 查找第一个出现的 "-" 符号的位置
	const dashIndex = betTypeStr.indexOf("-");

	// 如果找到了 "-" 符号，则截取该符号之前的部分，否则使用原始字符串
	const cleanedBetTypeStr = dashIndex !== -1 ? betTypeStr.substring(0, dashIndex) : betTypeStr;

	// 将清理后的字符串转换为数字
	const cleanedBetType = parseInt(cleanedBetTypeStr, 10);

	// 定义需要检查的有效betType列表
	const betTypesToCheck = [1, 28, 124, 125, 7, 17, 219, 453, 477, 478, 609, 637, 646, 701, 704, 708, 3904, 9002, 9008, 9012, 9018, 9024, 9034, 9040, 9046, 9052, 9059, 9076, 9077];

	// 返回检查结果
	return betTypesToCheck.includes(cleanedBetType);
};

/**
 * @description:  对赛事下所有的盘口进行基础排序操作
 * @param {Object} targetEvent 赛事详细
 * @return {*}
 */
export const sortMarks = (targetEvent: Object) => {
	let marketData: any = [];
	if (!isEmpty(targetEvent)) {
		/** betTypeName 名称相同合并 */
		const markets = targetEvent.markets;
		for (const key in markets) {
			const market = markets[key];
			const betTypeName = market.betTypeName;
			// 在 marketData 中查找是否已存在相同 betTypeName 的数据
			const existingMarketData = marketData.find((data) => data.betTypeName === betTypeName);
			if (existingMarketData) {
				// 如果已存在，则将当前市场对象添加到现有数据的 markets 数组中
				existingMarketData.markets[key] = market;
			} else {
				// 如果不存在，则创建新的数据对象并将当前市场对象添加到其 markets 数组中
				const newData: any = {
					betTypeName: betTypeName,
					betType: market.betType,
					markets: {
						[key]: market,
					},
				};
				marketData.push(newData);
			}
		}
	}
	// //第二次排序 betType 顺序排列；
	// marketData.sort((a, b) => a.betType - b.betType);
	/** 第三次排序 */
	marketData.sort((a, b) => {
		if (a.betType == b.betType) {
			const aNum = a.betTypeName.replace(/[^\d]/g, "");
			const bNum = b.betTypeName.replace(/[^\d]/g, "");
			return Number(aNum) - Number(bNum);
		} else {
			return a.betType - b.betType;
		}
	});
	const sortedMarkets = marketData.map((item) => {
		// 将 markets 对象转换为数组
		const marketsArray = Object.values(item.markets);
		// 先按照 betType 排序，然后在 betType 相同的情况下按照 marketId 排序
		marketsArray.sort((a, b) => {
			if (a.betType === b.betType) {
				return a.marketId - b.marketId;
			}
			return a.betType - b.betType;
		});

		return {
			...item,
			markets: marketsArray,
		};
	});

	return sortedMarkets;
};
