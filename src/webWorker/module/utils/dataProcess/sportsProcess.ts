// 体育静态文件
import sportsMap from "/@/views/sports/utils/sportsMap/sportsMap";

// 每个运动项目的赛事数量及串关赛事数量  数据线程处理 GetSports
export default (function () {
	/**
	 * @description sportsProcess数据处理
	 * @params sportServerData 数据源数据
	 * @params viewSportData 视图数据
	 * @returns processData 处理好的数据
	 */
	const sportsProcess = (
		sportServerData: { payload: { sports: { add: string | any[]; change: string | any[]; remove: string | any[] } } },
		viewSportData: any,
		webToPushApi: any
	): any => {
		let processData = {};
		if (sportServerData.payload.sports.add.length > 0) {
			processData = Object.assign({}, processData, sportsProcessAdd(sportServerData, viewSportData, webToPushApi));
		}
		if (sportServerData.payload.sports.change.length > 0) {
			processData = Object.assign({}, processData, sportsProcessChange(sportServerData, viewSportData, webToPushApi));
		}
		if (sportServerData.payload.sports.remove.length > 0) {
			processData = Object.assign({}, processData, sportsProcessRemove(sportServerData, viewSportData));
		}
		return processData;
	};

	// 每个运动项目的赛事数量及串关赛事数量的数据源新增 GetSports
	const sportsProcessAdd = (sportServerData: { payload: { sports: { add: any } } }, viewSportData: { sports: any[] }, webToPushApi: any) => {
		// 初始化数据
		viewSportData.sports = viewSportData.sports.concat(sportServerData.payload.sports.add).sort((a: { sportType: number }, b: { sportType: number }) => {
			return a.sportType - b.sportType; // 按照sportType 从小到大排序
		});
		viewSportData.sports.forEach((item: { icon: any; sportType: string | number; activeIcon: any; count: any; outrightGame: any; liveGameCount: any; gameCount: any }) => {
			item.icon = sportsMap[item.sportType]?.icon;
			item.activeIcon = sportsMap[item.sportType]?.activeIcon;
			switch (webToPushApi) {
				case "champion":
					item.count = item.outrightGame;
					break;
				case "rollingBall":
					item.count = item.liveGameCount;
					break;
				case "todayContest":
					item.count = item.liveGameCount + item.gameCount;
					break;
				case "morningTrading":
					item.count = item.gameCount;
					break;
				default:
					break;
			}
		});
		return { sportServerData, viewSportData };
	};

	// 每个运动项目的赛事数量及串关赛事数量的数据源数据变化 GetSports
	const sportsProcessChange = (sportServerData: { payload: { sports: { change: any[] } } }, viewSportData: { sports: any[] }, webToPushApi: any) => {
		sportServerData.payload.sports.change.forEach((item: { sportType: any; count: any; outrightGame: any; liveGameCount: any; gameCount: any }) => {
			viewSportData.sports = viewSportData.sports
				.map((i: any) => {
					let sport = i;
					if (item.sportType == sport.sportType) {
						switch (webToPushApi) {
							case "champion":
								item.count = item.outrightGame;
								break;
							case "rollingBall":
								item.count = item.liveGameCount;
								break;
							case "todayContest":
								item.count = item.liveGameCount + item.gameCount;
								break;
							case "morningTrading":
								item.count = item.gameCount;
								break;
							default:
								break;
						}
						sport = Object.assign({}, i, item);
					}
					return sport;
				})
				.sort((a: { sportType: number }, b: { sportType: number }) => {
					return a.sportType - b.sportType; // 按照sportType 从小到大排序
				});
		});
		// console.log("处理好的change数据", viewSportData);
		return { sportServerData, viewSportData };
	};

	// 每个运动项目的赛事数量及串关赛事数量的数据源数据删除 GetSports
	const sportsProcessRemove = (sportServerData: { payload: { sports: { remove: any[] } } }, viewSportData: { sports: any[] }) => {
		//从后向前删除 不会导致索引出错
		sportServerData.payload.sports.remove.forEach((item: any) => {
			console.error(item);
			for (let i = viewSportData.sports.length - 1; i >= 0; i--) {
				if (viewSportData.sports[i].sportType == item) {
					viewSportData.sports.splice(1, 1);
				}
			}
		});
		return { sportServerData, viewSportData };
	};
	return sportsProcess;
})();
