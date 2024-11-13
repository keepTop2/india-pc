import { type DynamicLotteryItem, type DynamicLotteryList, type LotteryItem, type LotteryList, type OddsList } from "/@/views/lottery/types/index";

/**
 * @description 这个函数是合并本地的玩法列表 LotteryList 和接口返回的玩法列表 DynamicLotteryList ，返回的列表可以直接用于渲染页面
 * @param lotteryList 本地的玩法列表
 * @param dynamicLotteryList 接口返回的玩法列表
 * @returns
 */
export function mergeLotteryList(lotteryList: LotteryList, dynamicLotteryList: DynamicLotteryList) {
	return lotteryList.map((v) => mergeLotteryItem(v, dynamicLotteryList));
}

/**
 * @description 这个函数是合并单个玩法
 * @param lotteryItem 本地的玩法
 * @param dynamicLotteryList 接口返回的玩法
 * @returns
 */
function mergeLotteryItem(lotteryItem: LotteryItem, dynamicLotteryList: DynamicLotteryList) {
	const { gamePlayCodes } = lotteryItem;
	// 过滤出接口返回的玩法列表中，gamePlayCodes 包含的玩法
	const filterList = dynamicLotteryList.filter((v) => gamePlayCodes.includes(v.gamePlayCode));
	if (filterList.length === 0) return {};
	const { oddsList, ...restLotteryItem } = lotteryItem;
	const mergedDynamicLotteryItem = filterList.reduce((prev, next) => {
		const { oddsList: l1 = [], ...dynamicLotteryItem1 } = prev;
		const { oddsList: l2 = [], ...dynamicLotteryItem2 } = next;
		return { ...dynamicLotteryItem1, ...dynamicLotteryItem2, oddsList: [...l1, ...l2] };
	}, {} as DynamicLotteryItem);
	const { oddsList: dynamicOddsList, ...restDynamicLotteryItem } = mergedDynamicLotteryItem;

	return {
		...restDynamicLotteryItem,
		...restLotteryItem, // 主要是想覆盖 gamePlayName desc actived
		oddsList: mergeOddsList(oddsList, dynamicOddsList),
	};
}

/**
 * @description 这个函数是合并单个玩法里面的 oddsList
 * @param oddsList 本地的 oddsList
 * @param dynamicOddsList 接口返回的 oddsList，需要注意的是，三军 总和大小，可以映射到接口返回的两个数据，这两个对应的 oddsList 合并传入
 * @returns 返回一个合并后的 oddsList
 */
function mergeOddsList(oddsList: OddsList, dynamicOddsList: OddsList) {
	return oddsList.map((item) => {
		const findItem = dynamicOddsList.find((v) => v.optionCode === item.optionCode);
		if (!findItem) return {};
		const { itemOdds } = findItem;
		return { ...findItem, ...item, itemOdds }; // 主要是想覆盖 itemOdds
	});
}
