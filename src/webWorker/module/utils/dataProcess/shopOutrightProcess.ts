// 体育静态文件
import sportsMap from "/@/views/sports/utils/sportsMap/sportsMap";
import { formattingChildrenViewData } from "/@/webWorker/module/utils/formattingChildrenViewData";
import { merge } from "lodash-es";
import { SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";

// 每个运动项目的赛事数量及串关赛事数量  数据线程处理 GetSports
export default (function () {
	/**
	 * @description sportsProcess数据处理
	 * @params sportServerData 数据源数据
	 * @params viewSportData 视图数据
	 * @returns processData 处理好的数据
	 */

	const dataObj = {
		outright: [] as any,
	};

	const sportsProcess = (sportServerData) => {
		let processData = {} as any;
		if (sportServerData.payload.outrights && sportServerData.payload.outrights.add.length > 0) {
			processData = Object.assign({}, processData, sportsProcessAdd(sportServerData));
		}
		if (sportServerData.payload.outrights && sportServerData.payload.outrights.change.length > 0) {
			processData = Object.assign({}, processData, sportsProcessChange(sportServerData));
		}
		if (sportServerData.payload.outrights && sportServerData.payload.outrights.remove.length > 0) {
			processData = Object.assign({}, processData, sportsProcessRemove(sportServerData));
		}

		processData.championBetData = dataObj.outright;
		return processData;
	};

	// 每个运动项目的冠军数量新增
	const sportsProcessAdd = (sportServerData) => {
		// 初始化数据
		dataObj.outright = [];
		dataObj.outright = dataObj.outright.concat(sportServerData.payload.outrights && sportServerData.payload.outrights.add);
		return { sportServerData };
	};

	// 每个运动项目的冠军数量发生变化
	const sportsProcessChange = (sportServerData) => {
		sportServerData.payload.outrights &&
			sportServerData.payload.outrights.change.forEach((item: { teams: any; leagueId: any; count: any; outrightGame: any }) => {
				//获取old数据index
				const index = dataObj.outright.findIndex((i) => i.leagueId === item.leagueId);
				const oldOutright = dataObj.outright[index];
				/**
				 * @description 判断赔率是否发生变化，设置对应的变动状态
				 */
				item.teams.forEach((teamItem) => {
					//获取对应更新的teamItem
					const oldTeamIndex = oldOutright?.teams.findIndex((i) => i.orid === teamItem.orid);
					// 获取oldPrice 用于判断赔率是否发生变化
					/**
					 * @description oddsChange 上升[up] 下降[down]
					 */
					if (oldTeamIndex) {
						const oldPrice = oldOutright.teams[oldTeamIndex].price;
						if (teamItem.price > oldPrice) {
							teamItem.oddsChange = "oddsUp";
						} else if (teamItem.price < oldPrice) {
							teamItem.oddsChange = "oddsDown";
						}
					}
				});
				//将新老数据合并 赋值
				const newOutright = merge({}, oldOutright, item);
				dataObj.outright[index] = newOutright;
			});
		// console.log("处理好的change数据", viewSportData);
		return { sportServerData };
	};

	// 每个运动项目的冠军数量删除
	const sportsProcessRemove = (sportServerData) => {
		return { sportServerData };
	};

	return sportsProcess;
})();
