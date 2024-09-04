/**
 * @description 体育 eventSource 枚举类文件
 */

/**
 * @description 体育推送api路径字典
 */
export enum SportPushApi {
	/**
	 * @description 此API用于获取每个运动项目的赛事数量及串关赛事数量
	 */
	GetSports_push = "GetSports",

	/**
	 * @description 此API用于获取每个联赛中的赛事数量
	 */
	GetLeagues_push = "GetLeagues",

	/**
	 * @description 此API用于获取赛事相关信息包含部分盘口信息
	 */
	GetEvents_push = "GetEvents",

	/**
	 * @description 此API用于获取盘口相关信息
	 */
	GetMarkets_push = "GetMarkets",

	/**
	 * @description 此API用于获取优胜冠军赛事信息
	 */
	GetOutrights_push = "GetOutrights",

	/**
	 * @description 此API用于获取指定时间区间内运动的赛果信息
	 */
	GetSportResults_push = "GetSportResults",
}

/**
 * @description SSE前端业务 字典
 */
export enum WebToPushApi {
	/**
	 * 前端业务名称
	 */
	demo = "demo",

	/**
	 * @description 获取滚球下的体育项目及赛事数量 前端业务
	 */
	rollingBall = "rollingBall",

	/**
	 * @description 获取今日下的体育项目及赛事数量 前端业务
	 */
	todayContest = "todayContest",

	/**
	 * @description 获取早盘下的体育项目及赛事数量 前端业务
	 */
	morningTrading = "morningTrading",
	/**
	 * @description 获取关注下的赛事信息
	 */
	eventsAttention = "eventsAttention",
	/**
	 * @description 获取冠军下的球类 前端业务
	 */
	champion = "champion",
	/**
	 * @description 获取冠军下的赛事信息
	 */
	eventsChampion = "eventsChampion",
	/**
	 * @description 获取赛果数据 前端业务
	 */
	matchResult = "matchResult",

	/**
	 * @description 获取滚球下的某个球类的所有比赛(联赛)
	 */
	getLiveGameCountLeague = "getLiveGameCountLeague",

	/**
	 * @description 获取滚球下赛事信息
	 */
	eventsRollingBall = "eventsRollingBall",

	/**
	 * @description 获取今日下赛事信息
	 */
	eventsTodayContest = "eventsTodayContest",

	/**
	 * @description 获取早盘下赛事信息
	 */
	eventsMorningTrading = "eventsMorningTrading",

	/**
	 * @description 获取购物车中赛事信息
	 */
	sportsShopCart = "sportsShopCart",
	/**
	 * @description 获取赛事详情推送
	 */
	sportsEventDetail = "sportsEventDetail",
	/**
	 * @description 更新体育数据
	 */
	updateOddsChange = "updateOddsChange",
}
