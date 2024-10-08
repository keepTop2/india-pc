import sportsMap from "/@/views/sports/utils/sportsMap/sportsMap";
import { Sports, SportViewModels } from "/@/views/sports/models/sportViewModels";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";

// 用于根据webToPushApi设置item的count值
const setItemCount = (item: Sports, webToPushApi: WebToPushApi): Sports => {
	switch (webToPushApi) {
		case WebToPushApi.champion:
			item.count = item.outrightGame;
			break;
		case WebToPushApi.rollingBall:
			item.count = item.liveGameCount;
			break;
		case WebToPushApi.todayContest:
			item.count = item.liveGameCount + item.gameCount;
			break;
		case WebToPushApi.morningTrading:
			item.count = item.gameCount;
			break;
		default:
			// 如果不匹配任何情况，可以设置默认值或保持原有值
			break;
	}
	return item;
};

// 初始化数据并按sportType排序
const initializeAndSortSports = (sports: Sports[]): Sports[] => {
	return sports.sort((a, b) => a.sportType - b.sportType);
};

interface SportServerData {
	payload: {
		sports: {
			add: Sports[];
			change: Sports[];
			remove: number[];
		};
	};
}

export default (function () {
	const sportsProcess = (sportServerData: SportServerData, viewSportData: SportViewModels["viewSportData"], webToPushApi: WebToPushApi) => {
		let processData: Partial<{ sportServerData: SportServerData; viewSportData: SportViewModels["viewSportData"] }> = {};

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

	const sportsProcessAdd = (sportServerData: SportServerData, viewSportData: SportViewModels["viewSportData"], webToPushApi: WebToPushApi) => {
		viewSportData.sports = initializeAndSortSports(viewSportData.sports.concat(sportServerData.payload.sports.add));
		viewSportData.sports.forEach((item) => {
			const sport = sportsMap[item.sportType as keyof typeof sportsMap];
			if (sport) {
				item.icon = sport.icon;
				// item.activeIcon = sport.activeIcon;
			}
			item = setItemCount(item, webToPushApi);
		});
		return { sportServerData, viewSportData };
	};

	const sportsProcessChange = (sportServerData: SportServerData, viewSportData: SportViewModels["viewSportData"], webToPushApi: WebToPushApi) => {
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

	const sportsProcessRemove = (sportServerData: SportServerData, viewSportData: SportViewModels["viewSportData"]) => {
		sportServerData.payload.sports.remove.forEach((removeItem) => {
			viewSportData.sports = viewSportData.sports.filter((item) => item.sportType !== removeItem);
		});
		return { sportServerData, viewSportData };
	};

	return sportsProcess;
})();
