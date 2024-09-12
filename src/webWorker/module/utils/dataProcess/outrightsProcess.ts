// 体育静态文件
import sportsMap from "/@/views/sports/utils/sportsMap/sportsMap";
import { formattingChildrenViewData } from "/@/webWorker/module/utils/formattingChildrenViewData";
import _ from "lodash";
import { SportEventSourceResponse } from "/@/views/sports/models/sportEventSourceModel";

// 每个运动项目的赛事数量及串关赛事数量  数据线程处理 GetSports
export default (function () {
	/**
	 * @description sportsProcess数据处理
	 * @params sportServerData 数据源数据
	 * @params viewSportData 视图数据
	 * @returns processData 处理好的数据
	 */
	const sportsProcess = (sportServerData: SportEventSourceResponse, viewSportData) => {
		type ProcessDataType = {
			sportServerData: typeof sportServerData;
			viewSportData: typeof viewSportData;
		};
		let processData = {} as ProcessDataType;
		if (sportServerData.payload.outrights && sportServerData.payload.outrights.add.length > 0) {
			processData = Object.assign({}, processData, sportsProcessAdd(sportServerData, viewSportData));
		}
		if (sportServerData.payload.outrights && sportServerData.payload.outrights.change.length > 0) {
			processData = Object.assign({}, processData, sportsProcessChange(sportServerData, viewSportData));
		}
		if (sportServerData.payload.outrights && sportServerData.payload.outrights.remove.length > 0) {
			processData = Object.assign({}, processData, sportsProcessRemove(sportServerData, viewSportData));
		}
		processData.viewSportData.childrenViewData = formattingChildrenViewData(viewSportData, "outrights");

		return processData;
	};

	// 每个运动项目的冠军数量新增
	const sportsProcessAdd = (sportServerData: SportEventSourceResponse, viewSportData: { outrights: any[] }) => {
		// 初始化数据
		viewSportData.outrights = viewSportData.outrights.concat(sportServerData.payload.outrights && sportServerData.payload.outrights.add);
		viewSportData.outrights.forEach((item: { icon: any; sportType: string | number; activeIcon: any; count: any; outrightGame: any }) => {
			item.icon = sportsMap[item.sportType]?.icon;
			item.activeIcon = sportsMap[item.sportType]?.activeIcon;
			/**
			 * @description 设置gameCount 为该体育项目的优胜冠军赛事数量
			 */
			item.count = item.outrightGame;
		});
		return { sportServerData, viewSportData };
	};

	// 每个运动项目的冠军数量发生变化
	const sportsProcessChange = (sportServerData: SportEventSourceResponse, viewSportData: { outrights: any[] }) => {
		sportServerData.payload.outrights &&
			sportServerData.payload.outrights.change.forEach((item: { teams: any; leagueId: any; count: any; outrightGame: any }) => {
				//获取old数据index
				const index = viewSportData.outrights.findIndex((i) => i.leagueId === item.leagueId);
				const oldOutright = viewSportData.outrights[index];
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
				//设置冠军赛事数量
				item.count = item.outrightGame;
				//将新老数据合并 赋值
				const newOutright = _.merge({}, oldOutright, item);
				viewSportData.outrights[index] = newOutright;
			});
		// console.log("处理好的change数据", viewSportData);
		return { sportServerData, viewSportData };
	};

	// 每个运动项目的冠军数量删除
	const sportsProcessRemove = (sportServerData: SportEventSourceResponse, viewSportData: { outrights: any[] }) => {
		// console.log("sportsProcessRemove", sportServerData, viewSportData);
		//从后向前删除 不会导致索引出错
		sportServerData.payload.outrights &&
			sportServerData.payload.outrights.remove.forEach((item) => {
				// leagueId
				const index = viewSportData.outrights.findIndex((i) => i.leagueId === item);
				viewSportData.outrights.splice(index, 1);
			});
		return { sportServerData, viewSportData };
	};

	return sportsProcess;
})();
