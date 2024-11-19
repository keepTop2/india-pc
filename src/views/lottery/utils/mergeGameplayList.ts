import { type GameplayItem, type GameplayList, type OddsList } from "/@/views/lottery/types/index";

/**
 * @description 这个函数是合并本地的玩法列表 l1 和接口返回的玩法列表 l2 ，返回的列表可以直接用于渲染页面。1 都是本地的，2 都是接口返回的
 * @param l1 本地的玩法列表
 * @param l2 接口返回的玩法列表
 * @returns 返回的列表可以直接用于渲染页面 gameplayList
 */
export function mergeGameplayList(l1: GameplayList, l2: GameplayList) {
	return l1.map((v) => mergeGameplayItem(v, l2));
}

/**
 * @description 功能函数，不导出。这个函数是合并单个玩法
 * @param g1 本地的一个玩法
 * @param l2 接口返回的玩法列表
 * @returns
 */
function mergeGameplayItem(g1: GameplayItem, l2: GameplayList) {
	const { gamePlayCodes } = g1;
	const filterList = l2.filter((v) => gamePlayCodes.includes(v.gamePlayCode as string));
	if (filterList.length === 0) return {} as GameplayItem;
	const { oddsList: o1, ...restGameplayItem } = g1;

	// 合并两个 gameplayItem 为一个
	const mergedDynamicGameplayItem = filterList.reduce((prev, next) => {
		const { oddsList: o1 = [], ...dynamicGameplayItem1 } = prev;
		const { oddsList: o2 = [], ...dynamicGameplayItem2 } = next;
		return { ...dynamicGameplayItem1, ...dynamicGameplayItem2, oddsList: [...o1, ...o2] };
	}, {} as GameplayItem);

	const { oddsList: o2, ...restDynamicGameplayItem } = mergedDynamicGameplayItem;

	return {
		...restDynamicGameplayItem,
		...restGameplayItem, // 主要是想覆盖 gamePlayName desc actived
		oddsList: mergeOddsList(o1, o2),
	};
}

/**
 * @description 功能函数，不导出。这个函数是合并单个玩法里面的 oddsList
 * @param o1 本地的 oddsList
 * @param o2 接口返回的 oddsList，需要注意的是，三军 总和大小，可以映射到接口返回的两个数据，这两个对应的 oddsList 合并传入
 * @returns 返回一个合并后的 oddsList
 */
function mergeOddsList(o1: OddsList, o2: OddsList) {
	return o1.map((item) => {
		const findItem = o2.find((v) => v.optionCode === item.optionCode);
		if (!findItem) return {};
		const { itemOdds } = findItem;
		return { ...findItem, ...item, itemOdds }; // 主要是想覆盖 itemOdds
	});
}
