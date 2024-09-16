import _ from "lodash";
import { formattingChildrenViewData } from "/@/webWorker/module/utils/formattingChildrenViewData";
import { SportViewModels } from "/@/views/sports/models/sportViewModels";
import { SportViewData, SportsRootObject } from "/@/views/sports/models/interface";
import { SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";
// 每个赛事联系数量 数据线程处理 GetEvents
export default (function () {
	/**
	 * @description sportsProcess数据处理
	 * @params sportServerData 数据源数据
	 * @params viewSportData 视图数据
	 * @returns processData 处理好的数据
	 */

	const eventsProcess = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		let processData = {} as SportViewModels;
		const { add, change, remove } = sportServerData.payload.events || { add: [], change: [], remove: [] };
		if (add.length > 0) {
			processData = Object.assign({}, processData, eventsProcessAdd(sportServerData, viewSportData));
		}

		if (change.length > 0) {
			processData = Object.assign({}, processData, eventsProcessChange(sportServerData, viewSportData));
		}

		if (remove.length > 0) {
			processData = Object.assign({}, processData, eventsProcessRemove(sportServerData, viewSportData));
		}
		if (sportServerData.payload.markets && sportServerData.payload.markets.add.length > 0) {
			processData = Object.assign({}, processData, marketsProcessAdd(sportServerData, viewSportData));
		}
		if (sportServerData.payload.markets && sportServerData.payload.markets.change.length > 0) {
			processData = Object.assign({}, processData, marketsProcessChange(sportServerData, viewSportData));
		}
		if (sportServerData.payload.markets && sportServerData.payload.markets.remove.length > 0) {
			processData = Object.assign({}, processData, marketsProcessRemove(sportServerData, viewSportData));
		}
		processData.viewSportData = processData.viewSportData || {};
		// console.log("processData.viewSportData===================>", processData.viewSportData);

		processData.viewSportData["childrenViewData"] = formattingChildrenViewData(viewSportData, "events");
		// console.log(JSON.parse(JSON.stringify(processData)), "==events===processData");
		return processData;
	};

	// 赛事相关信息数据源新增 GetEvents
	const eventsProcessAdd = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		viewSportData.events = viewSportData.events.concat(sportServerData.payload.events?.add || []);
		return { sportServerData, viewSportData };
	};
	// 盘口信息数据源新增 GetEvents
	const marketsProcessAdd = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		viewSportData.markets = viewSportData.markets.concat(sportServerData.payload.markets?.add || []);
		return { sportServerData, viewSportData };
	};

	// 赛事相关信息数据源变化 GetEvents
	const eventsProcessChange = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		/**
		 * @description 处理events数据源
		 */
		// 根据eventsId 匹配被修改的数据
		sportServerData.payload.events?.change.forEach((item) => {
			const index = viewSportData.events.findIndex((i) => i.eventId === item.eventId);
			if (index !== -1) {
				// 如果找到匹配项，合并对象  进行深度合并不然嵌套的内容会被覆盖掉
				viewSportData.events[index] = _.merge(viewSportData.events[index], item);
			}
		});
		return { sportServerData, viewSportData };
	};
	// 盘口相关信息数据源变化 GetEvents
	const marketsProcessChange = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		/**
		 * @description 处理markets数据源
		 */

		sportServerData.payload.markets?.change.forEach((item) => {
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
				item.selections.forEach((selectionsItem: any) => {
					const oldSelectionsIndex = oldMarkets?.selections.findIndex((i: any) => i.key === selectionsItem.key);
					if (oldSelectionsIndex !== -1 && oldSelectionsIndex !== undefined) {
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
				viewSportData.markets[index] = _.merge(viewSportData.markets[index], item);
			}
		});
		return { sportServerData, viewSportData };
	};

	// 赛事相关信息数据源删除 GetEvents
	const eventsProcessRemove = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		/**
		 * 删除events数据
		 */
		sportServerData.payload.events?.remove.forEach((item) => {
			const index = viewSportData.events.findIndex((event) => event.eventId === item);

			if (index !== -1) {
				viewSportData.events.splice(index, 1);
			}
		});
		return { sportServerData, viewSportData };
	};

	//盘口信息数据源删除 GetEvents
	const marketsProcessRemove = (sportServerData: SportEventSourceResponse, viewSportData: SportViewData) => {
		/**
		 * 删除markets数据
		 */
		sportServerData.payload.markets?.remove.forEach((item) => {
			const index = viewSportData.markets.findIndex((event) => event.marketId === item);

			if (index !== -1) {
				viewSportData.markets.splice(index, 1);
			}
		});
		return { sportServerData, viewSportData };
	};
	return eventsProcess;
})();
