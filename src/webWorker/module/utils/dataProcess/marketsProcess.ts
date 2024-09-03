import { merge } from "lodash-es";
import { formattingChildrenViewData } from "/@/webWorker/module/utils/formattingChildrenViewData";
import { SportViewModels } from "/@/models/sportViewModels";
import { SportEventSourceResponse } from "/@/models/sportEventSourceModel";
// 每个赛事联系数量 数据线程处理 GetEvents
export default (function () {
	/**
	 * @description sportsProcess数据处理
	 * @params sportServerData 数据源数据
	 * @params viewSportData 视图数据
	 * @returns processData 处理好的数据
	 */

	const marketsProcess = (sportServerData: SportEventSourceResponse, viewSportData) => {
		// console.log("marketsProcess 数据处理触发");
		let processData = {} as SportViewModels;
		const { add, change, remove } = sportServerData.payload.markets || { add: [], change: [], remove: [] };
		if (sportServerData.payload.markets && add.length > 0) {
			processData = Object.assign({}, processData, marketsProcessAdd(sportServerData, viewSportData));
		}
		if (sportServerData.payload.markets && change.length > 0) {
			processData = Object.assign({}, processData, marketsProcessChange(sportServerData, viewSportData));
		}
		if (sportServerData.payload.markets && remove.length > 0) {
			processData = Object.assign({}, processData, marketsProcessRemove(sportServerData, viewSportData));
		}
		processData.viewSportData["childrenViewData"] = formattingChildrenViewData(viewSportData, "events");
		return processData;
	};
	// 盘口信息数据源新增 GetEvents
	const marketsProcessAdd = (sportServerData, viewSportData) => {
		viewSportData.markets = viewSportData.markets.concat(sportServerData.payload.markets.add);
		return { sportServerData, viewSportData };
	};
	// 盘口相关信息数据源变化 GetEvents
	const marketsProcessChange = (sportServerData, viewSportData) => {
		/**
		 * @description 处理markets数据源
		 */

		sportServerData.payload.markets.change.forEach((item) => {
			const index = viewSportData.markets.findIndex((i) => i.marketId === item.marketId);
			// 如果找到匹配项，合并对象
			if (index !== -1) {
				/**
				 * @description 判断赔率是否发生变化
				 * @description 上升 rise
				 * @description 下降 descend
				 */
				// 获取old数据index
				const oldMarkets = viewSportData.markets[index];
				item.selections.forEach((selectionsItem) => {
					const oldSelectionsIndex = oldMarkets?.selections.findIndex((i) => i.key === selectionsItem.key);
					if (oldSelectionsIndex != -1) {
						const oldDecimalPrice = oldMarkets.selections[oldSelectionsIndex].oddsPrice.decimalPrice;
						if (selectionsItem.oddsPrice.decimalPrice > oldDecimalPrice) {
							selectionsItem.oddsChange = "oddsUp";
						} else if (selectionsItem.oddsPrice.decimalPrice < oldDecimalPrice) {
							selectionsItem.oddsChange = "oddsDown";
						}
					}
				});
				/**
				 * @description 深度合并 markets
				 */
				viewSportData.markets[index] = merge(viewSportData.markets[index], item);
			}
		});
		return { sportServerData, viewSportData };
	};
	//盘口信息数据源删除 GetEvents
	const marketsProcessRemove = (sportServerData, viewSportData) => {
		/**
		 * 删除markets数据
		 */
		sportServerData.payload.markets.remove.forEach((item) => {
			const index = viewSportData.markets.findIndex((event) => event.marketId === item);

			if (index !== -1) {
				viewSportData.markets.splice(index, 1);
			}
		});
		return { sportServerData, viewSportData };
	};
	return marketsProcess;
})();
