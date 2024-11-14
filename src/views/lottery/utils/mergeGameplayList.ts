import { type DynamicGameplayItem, type DynamicGameplayList, type GameplayItem, type GameplayList, type OddsList } from "/@/views/lottery/types/index";

/**
 * @description 这个函数是合并本地的玩法列表 gameplayList 和接口返回的玩法列表 dynamicGameplayList ，返回的列表可以直接用于渲染页面
 * @param gameplayList 本地的玩法列表
 * @param dynamicGameplayList 接口返回的玩法列表
 * @returns
 */
export function mergeGameplayList(gameplayList: GameplayList, dynamicGameplayList: DynamicGameplayList) {
	return gameplayList.map((v) => mergeGameplayItem(v, dynamicGameplayList));
}

/**
 * @description 这个函数是合并单个玩法
 * @param gameplayItem 本地的玩法
 * @param dynamicGameplayList 接口返回的玩法
 * @returns
 */
function mergeGameplayItem(gameplayItem: GameplayItem, dynamicGameplayList: DynamicGameplayList) {
	const { gamePlayCodes } = gameplayItem;
	const filterList = dynamicGameplayList.filter((v) => gamePlayCodes.includes(v.gamePlayCode));
	if (filterList.length === 0) return {};
	const { oddsList, ...restGameplayItem } = gameplayItem;
	const mergedDynamicGameplayItem = filterList.reduce((prev, next) => {
		const { oddsList: l1 = [], ...dynamicGameplayItem1 } = prev;
		const { oddsList: l2 = [], ...dynamicGameplayItem2 } = next;
		return { ...dynamicGameplayItem1, ...dynamicGameplayItem2, oddsList: [...l1, ...l2] };
	}, {} as DynamicGameplayItem);
	const { oddsList: dynamicOddsList, ...restDynamicGameplayItem } = mergedDynamicGameplayItem;

	return {
		...restDynamicGameplayItem,
		...restGameplayItem, // 主要是想覆盖 gamePlayName desc actived
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
