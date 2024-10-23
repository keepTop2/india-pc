import { Market, SportsRootObject } from "/@/views/sports/models/interface";

/**
 * @description 处理markets数据
 * @param data 列表数据里的markets数据
 * @param betType 对应betType
 * @param selectionsLength 对应selections的长度（用于设置空数据量）
 */
export const marketsMatchData = (data: Market[], betType: number, selectionsLength: number = 1): { marketId: string; selections: any[]; marketStatus: string } => {
	let filterMarketData: Market | undefined;
	try {
		filterMarketData = data.find((v) => v.betType === betType);
	} catch (error) {
		filterMarketData = data[betType];
	}
	// 获取 selections, marketId
	if (filterMarketData && filterMarketData.marketId) {
		let { selections, marketId, marketStatus } = filterMarketData;
		if (selections.length > 0) {
			// market不为空直接返回对应的selections 玩法信息
			return { marketId: marketId.toString(), selections, marketStatus };
		}
	}
	// 如果market为空，则返回默认数量的空数组用于填充页面
	let selectionsInitArr: null[] = [];
	if ([5, 15].includes(betType)) {
		selectionsInitArr = Array(3).fill(null);
	} else if ([1, 3, 7, 8].includes(betType)) {
		selectionsInitArr = Array(2).fill(null);
	} else {
		selectionsInitArr = Array(selectionsLength).fill(null);
	}
	return { marketId: "", marketStatus: "", selections: selectionsInitArr };
};

/**
 * @description 获取体育数据并格式化为联赛
 */
export const formatEvent2League = (events: SportsRootObject[]): { leagueId: string; leagueName: string; leagueIconUrl: string; events: SportsRootObject[] }[] => {
	const leagueList: { [key: string]: { leagueId: string; leagueName: string; leagueIconUrl: string; events: SportsRootObject[] } } = {};

	events.forEach((item) => {
		const { leagueId, leagueName, leagueIconUrl } = item;
		if (leagueList[leagueId]) {
			leagueList[leagueId].events.push(item);
		} else {
			leagueList[leagueId] = {
				leagueId: leagueId.toString(),
				leagueName,
				leagueIconUrl,
				events: [item],
			};
		}
	});
	return Object.values(leagueList);
};
