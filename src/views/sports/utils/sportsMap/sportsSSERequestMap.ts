// import sportEventSource from "/@/eventSource/sportEventSource/sportEventSource";
import SportsCommonFn from "../common";
import moment from "moment";
import { WebToPushApi, SportPushApi } from "/@/enum/sportEnum/sportEventSourceEnum";
import { OpenSportEventSourceParams } from "/@/models/sportEventSourceModel";
import { betTypes } from "./sportsBetType";

interface SportPushAction {
	name?: string;

	/**
	 * @description 打开sports SSE推送
	 */
	openSport?: OpenSportEventSourceParams;

	/**
	 * @description 打开Outrights SSE推送
	 */
	openOutrights?: OpenSportEventSourceParams;

	/**
	 * @description 打开events SSE推送
	 */
	openEvents?: OpenSportEventSourceParams;
}

/**
 * @description 体育SSE 推送字典 同时用于tab渲染 滚球 今日 早盘 关注 赛果 冠军
 */
const sportTabPushActions = {
	/**
	 * @description 滚球SSE字典
	 */
	rollingBall: {
		name: "滚球",
		/**
		 * @description 滚球 获取体育项目及赛事数量推送 开启SSE sports推送
		 */
		openSport: {
			sportPushApi: SportPushApi.GetSports_push,
			webToPushApi: WebToPushApi.rollingBall,
			params: {
				query: `$filter=liveGameCount gt 0 and sportType in (${SportsCommonFn.getRequestSportsType()})`,
			},
		} as OpenSportEventSourceParams,

		/**
		 * @description 滚球下的球类赛事信息推送 开启SSE events推送
		 */
		openEvents: {
			sportPushApi: SportPushApi.GetEvents_push,
			webToPushApi: WebToPushApi.eventsRollingBall,
			params: {
				// query: `$filter=sportType in (${SportsCommonFn.getRequestSportsType()}) and isLive eq true & $orderby=globalShowTime desc`,
				query: `$filter=sportType in (${SportsCommonFn.getRequestSportsType()}) and isLive eq true &$orderby=globalShowTime asc`,
				includeMarkets: `$filter=bettype in (${betTypes})`,
			},
			isMultiple: true,
		},
	} as SportPushAction,

	/**
	 * @description 今日SSE字典
	 */
	todayContest: {
		name: "今日",
		/**
		 * @description 今日获取体育项目及赛事数量推送 开启 SSE sports推送
		 */
		openSport: {
			sportPushApi: SportPushApi.GetSports_push,
			webToPushApi: WebToPushApi.todayContest,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
				from: moment.utc().subtract(5, "hour").startOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
				until: moment.utc().subtract(5, "hour").endOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
			},
		},

		/**
		 * @description 今日下的球类赛事信息 开七SSE events 推送
		 */
		openEvents: {
			sportPushApi: SportPushApi.GetEvents_push,
			webToPushApi: WebToPushApi.eventsTodayContest,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()}) and islive eq false &$orderby=globalShowTime asc `,
				from: moment.utc().subtract(5, "hour").startOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
				until: moment.utc().subtract(5, "hour").endOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
				includeMarkets: `$filter=bettype in (${betTypes})`,
			},
			isMultiple: true,
		},
	} as SportPushAction,

	/**
	 * @description 早盘SSE字典
	 */
	morningTrading: {
		name: "早盘",
		/**
		 * @description 早盘获取体育项目及赛事数量推送 开启SSE sports推送
		 */
		openSport: {
			sportPushApi: SportPushApi.GetSports_push,
			webToPushApi: WebToPushApi.morningTrading,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
				from: moment.utc().subtract(5, "hour").endOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
			},
		},

		/**
		 * @description 早盘下的球类赛事信息 开启SSE events推送
		 */
		openEvents: {
			sportPushApi: SportPushApi.GetEvents_push,
			webToPushApi: WebToPushApi.eventsMorningTrading,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})&$orderby=globalShowTime asc `,
				from: moment.utc().subtract(5, "hour").endOf("day").add(5, "hour").format("YYYY-MM-DDTHH:mm:ss"),
				includeMarkets: `$filter=bettype in (${betTypes})`,
			},
			isMultiple: true,
		},
	} as SportPushAction,

	/**
	 * @description 冠军SSE字典
	 */
	champion: {
		name: "冠军",

		/**
		 * @description 开启冠军获取体育项目及赛事数量推送 开启SSE sports推送
		 */
		openSport: {
			sportPushApi: SportPushApi.GetSports_push,
			webToPushApi: WebToPushApi.champion,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
			},
		},
		/**
		 * @description 冠军下的球类赛事信息 开启SSE outrights推送
		 */
		openEvents: {
			sportPushApi: SportPushApi.GetOutrights_push,
			webToPushApi: WebToPushApi.eventsChampion,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})&$orderby=eventDate asc `,
				includeMarkets: `$filter=bettype in (${betTypes})`,
			},
		},
	} as SportPushAction,
	/**
	 * @description 关注
	 */
	attention: {
		name: "关注",
		openEvents: {
			sportPushApi: SportPushApi.GetEvents_push,
			webToPushApi: WebToPushApi.eventsAttention,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
				includeMarkets: `$filter=bettype in (${betTypes})`,
			},
			isMultiple: false,
		},
		openOutright: {
			sportPushApi: SportPushApi.GetOutrights_push,
			webToPushApi: WebToPushApi.eventsChampion,
			params: {
				query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
			},
			isMultiple: false,
		},
	},
	/**
	 * @description 赛果
	 */
	matchResult: {
		name: "赛果",
	},
};

/**
 * @description 购物车sse字典
 */
const sportsShopCart = {
	/**
	 * @description 购物车赛事信息推送 开启SSE
	 * @params 购物车赛事id集合
	 */
	openEvents: async (params) => {
		// 	return sportEventSource.openSportEventSource({
		// 		sportPushApi: sportEventSource.sportPushApi.GetEvents_push,
		// 		webToPushApi: sportEventSource.webToPushApi["sportsShopCart"],
		// 		params: {
		// 			query: `$filter=eventId in (${params})`,
		// 		},
		// 	});
		// },
		// /**
		//  * @description 购物车赛事信息推送 关闭SSE
		//  */
		// closeEvents: async () => {
		// 	return sportEventSource.closeSportEventSource(sportEventSource.webToPushApi["sportsShopCart"]);
	},
};
/**
 * @description 联赛详情 sse 推送
 */
const sportsEventDetailPush = {
	/**
	 * @description 联赛详情推送 传入 leagueId
	 */
	openEvents: (eventId) => {
		return {
			sportPushApi: SportPushApi.GetEvents_push,
			webToPushApi: WebToPushApi.sportsEventDetail,
			params: {
				// query: `$filter=leagueid eq ${leagueid} &includeMarkets=none`,
				query: `$filter=eventId eq ${eventId} &includeMarkets=none`,
				// query: `$filter=eventId in (${eventId}) &includeMarkets=none`,
			},
		};
	},
	openMarkets: (eventId) => {
		return {
			sportPushApi: SportPushApi.GetMarkets_push,
			webToPushApi: WebToPushApi.sportsEventDetail,
			params: {
				query: `$filter=eventId eq ${eventId}`,
			},
		};
	},
	/**
	 * @description 购物车赛事信息推送 关闭SSE
	 */
	closeEvents: () => {
		// return sportEventSource.closeSportEventSource(sportEventSource.webToPushApi["sportsEventDetail"]);
	},
};

export { sportTabPushActions, sportsShopCart, sportsEventDetailPush };
