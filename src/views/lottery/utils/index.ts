import { OddsList, PlaysConfig, DynamicPlaysConfig, PlaysConfigList, DynamicPlaysConfigList } from "/@/views/lottery/types/index";

/**
 * @description 这个函数是整合 playsConfig 和 dynamicPlaysConfig ，返回可以直接渲染使用的数据
 * @param playsConfig 前端写死的玩法
 * @param dynamicPlaysConfig 接口返回的玩法、赔率
 * @returns
 */
export function integratePlaysConfig(playsConfigList: PlaysConfigList, dynamicPlaysConfigList: DynamicPlaysConfigList) {
	return playsConfigList.map((playsConfig) => mergePlaysConfig(playsConfig, dynamicPlaysConfigList));
}

/**
 * @description 这个函数是根据本地的玩法和接口返回的玩法做一个合并
 * @param playsConfig 本地的玩法
 * @param dynamicPlaysConfigList 接口返回的玩法
 * @returns
 */
function mergePlaysConfig(playsConfig: PlaysConfig, dynamicPlaysConfigList: DynamicPlaysConfigList) {
	const { gamePlayCodes } = playsConfig;
	const filterList = dynamicPlaysConfigList.filter((item) => gamePlayCodes.includes(item.gamePlayCode));
	if (filterList.length === 0) return {};
	const { oddsList: playsConfigOddsList, ...restPlaysConfig } = playsConfig;
	const dynamicPlaysConfig = filterList.reduce((prev, next) => {
		const { oddsList: l1 = [], ...dynamicPlaysConfig1 } = prev;
		const { oddsList: l2 = [], ...dynamicPlaysConfi2 } = next;
		return { ...dynamicPlaysConfig1, ...dynamicPlaysConfi2, oddsList: [...l1, ...l2] };
	}, {} as DynamicPlaysConfig);
	const { oddsList: dynamicPlaysConfigOddsList, ...restDynamicPlaysConfig } = dynamicPlaysConfig;

	return {
		...restDynamicPlaysConfig,
		...restPlaysConfig, // 主要是想覆盖 gamePlayName desc actived
		oddsList: mergeOddsList(playsConfigOddsList, dynamicPlaysConfigOddsList),
	};
}

/**
 * @description 这个函数是根据本地的 oddsList 和接口返回的 oddsList 做一个合并
 * @param playsConfigOddsList 本地的 oddsList
 * @param dynamicPlaysConfigOddsList 接口返回的 oddsList，需要注意的是，三军 总和大小，可以映射到接口返回的两个数据，这两个对应的 oddsList 合并传入
 * @returns 返回一个合并后的 oddsList
 */
function mergeOddsList(playsConfigOddsList: OddsList, dynamicPlaysConfigOddsList: OddsList) {
	return playsConfigOddsList.map((item) => {
		const findItem = dynamicPlaysConfigOddsList.find((v) => v.optionCode === item.optionCode);
		if (!findItem) return {};
		const { itemOdds } = findItem;
		return { ...findItem, ...item, itemOdds }; // 主要是想覆盖 itemOdds
	});
}
