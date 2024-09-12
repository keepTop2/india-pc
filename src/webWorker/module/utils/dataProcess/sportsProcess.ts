import sportsMap from "/@/views/sports/utils/sportsMap/sportsMap";

// 用于根据webToPushApi设置item的count值
const setItemCount = (item, webToPushApi) => {
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
			// 如果不匹配任何情况，可以设置默认值或保持原有值
			break;
	}
	return item;
};

// 初始化数据并按sportType排序
const initializeAndSortSports = (sports) => {
	return sports.sort((a, b) => a.sportType - b.sportType);
};

export default (function () {
	const sportsProcess = (sportServerData, viewSportData, webToPushApi) => {
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

	const sportsProcessAdd = (sportServerData, viewSportData, webToPushApi) => {
		viewSportData.sports = initializeAndSortSports(viewSportData.sports.concat(sportServerData.payload.sports.add));
		viewSportData.sports.forEach((item) => {
			if (sportsMap[item.sportType]) {
				item.icon = sportsMap[item.sportType]?.icon;
				item.activeIcon = sportsMap[item.sportType]?.activeIcon;
			}
			item = setItemCount(item, webToPushApi);
		});
		return { sportServerData, viewSportData };
	};

	const sportsProcessChange = (sportServerData, viewSportData, webToPushApi) => {
		sportServerData.payload.sports.change.forEach((changeItem) => {
			viewSportData.sports = viewSportData.sports.map((item) => {
				if (changeItem.sportType === item.sportType) {
					item = setItemCount({ ...item, ...changeItem }, webToPushApi);
				}
				return item;
			});
		});
		viewSportData.sports = initializeAndSortSports(viewSportData.sports);
		return { sportServerData, viewSportData };
	};

	const sportsProcessRemove = (sportServerData, viewSportData) => {
		sportServerData.payload.sports.remove.forEach((removeItem) => {
			viewSportData.sports = viewSportData.sports.filter((item) => item.sportType !== removeItem);
		});
		return { sportServerData, viewSportData };
	};

	return sportsProcess;
})();
