import { merge } from "lodash-es";
// 购物车赛事信息处理
export default (function () {
	/**
	 * @description shopCartProcess数据处理
	 * @params sportServerData 数据源数据
	 * @params sportsBetEventData 购物车数据
	 * @returns processData 处理好的数据
	 */

	const dataObj = {
		events: [] as any,
		markets: [] as any,
	};

	const shopCartProcess = (sportServerData) => {
		// console.log("购物车数据处理收到推送数据", sportServerData);

		let processData = {} as any;
		// 处理 payload.events 数据
		if (sportServerData.payload.events.add.length > 0) {
			processData = Object.assign({}, processData, shopCartProcessAdd(sportServerData));
		}
		if (sportServerData.payload.events.change.length > 0) {
			processData = Object.assign({}, processData, shopCartProcessChange(sportServerData));
		}
		if (sportServerData.payload.events.remove.length > 0) {
			processData = Object.assign({}, processData, shopCartProcessRemove(sportServerData));
		}

		// 处理 payload.markets 数据
		if (sportServerData.payload.markets && sportServerData.payload.markets.add.length > 0) {
			processData = Object.assign({}, processData, marketsProcessAdd(sportServerData));
		}
		if (sportServerData.payload.markets && sportServerData.payload.markets.change.length > 0) {
			processData = Object.assign({}, processData, marketsProcessChange(sportServerData));
		}
		if (sportServerData.payload.markets && sportServerData.payload.markets.remove.length > 0) {
			processData = Object.assign({}, processData, marketsProcessRemove(sportServerData));
		}
		processData.sportsBetEventData = formattingShopCartData(dataObj);

		return processData;
	};

	// events 新增
	const shopCartProcessAdd = (sportServerData) => {
		dataObj.events = [];
		dataObj.events = dataObj.events.concat(sportServerData.payload.events.add);
		return { sportServerData };
	};

	// markets 新增
	const marketsProcessAdd = (sportServerData) => {
		dataObj.markets = [];
		dataObj.markets = dataObj.markets.concat(sportServerData.payload.markets.add);
		return { sportServerData };
	};

	// events 数据变化
	const shopCartProcessChange = (sportServerData) => {
		// 根据eventsId 匹配被修改的数据
		sportServerData.payload.events.change.forEach((item) => {
			const index = dataObj.events.findIndex((i) => i.eventId === item.eventId);
			if (index !== -1) {
				// 如果找到匹配项，合并对象  进行深度合并不然嵌套的内容会被覆盖掉
				dataObj.events[index] = merge(dataObj.events[index], item);
			}
		});
		return { sportServerData };
	};

	// markets 数据变化
	const marketsProcessChange = (sportServerData) => {
		sportServerData.payload.markets.change.forEach((item) => {
			const index = dataObj.markets.findIndex((i) => i.marketId === item.marketId);
			// 如果找到匹配项，合并对象
			if (index !== -1) {
				/**
				 * @description 判断赔率是否发生变化
				 * @description 上升 rise
				 * @description 下降 descend
				 */
				// 获取old数据index
				const oldMarkets = dataObj.markets[index];
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
				dataObj.markets[index] = merge(dataObj.markets[index], item);
			}
		});
		return { sportServerData };
	};

	// events 数据删除
	const shopCartProcessRemove = (sportServerData) => {
		return { sportServerData };
	};

	// markets 数据删除
	const marketsProcessRemove = (sportServerData) => {
		return { sportServerData };
	};

	/**
	 * @description 格式化markets数据为对象 以betType为key
	 */
	function formattingMarkets(markets) {
		const obj = {};
		markets.forEach((item) => {
			obj[item.betType] = item;
		});
		return obj;
	}

	// 格式话购物车需要的数据格式
	const formattingShopCartData = (data) => {
		data.events.forEach((item) => {
			const sortValue = item.sportType === "43" ? 0 : 1;
			const markets = data.markets.filter((market) => market.eventId === item.eventId && market.sort === sortValue);
			item.markets = formattingMarkets(markets);
		});
		return data.events;
	};

	return shopCartProcess;
})();
