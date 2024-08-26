import { ServerData } from "/@/models/commonInterface";

export interface Sports {
	count?: number;
	sportType: number;
	liveGameCount: number;
	icon: string;
	activeIcon: string;
	sportName: string;
}

/**
 * @description 体育视图数据模型
 */
export interface SportViewData {
	/**
	 * @description 外层Sports组件视图数据
	 */
	sports: Sports[];
	leagues: Array<any>;
	events: Array<any>;
	markets: Array<any>;
	outrights: Array<any>;
	results: Array<any>;

	/**
	 * @description 各个子路由视图数据
	 */
	childrenViewData: Array<any> | {};
}

/**
 * @description 线程管理器处理好的数据
 */
export interface SportData extends ServerData {
	sportViewData: SportViewData;
	sportServerData: any;
}

export interface SoccerDetail {
	firstGoal: string;
	lastGoal: string;
	firstHtGoal?: any;
	lastHtGoal?: any;
	goalSequence: string;
	cornerSequence?: any;
	penaltySequence?: any;
	firstGoalMethod?: any;
	specialData: any[];
	deathSuddenPenaltySequence?: any;
	isPenaltyHandicap: boolean;
	isPenaltyOverUnder: boolean;
}

export interface EventResult {
	eventId: number;
	homeId: number;
	homeName: string;
	awayId: number;
	awayName: string;
	htHomeScore: string;
	htAwayScore: string;
	homeScore: string;
	awayScore: string;
	firstHomeScore?: any;
	firstAwayScore?: any;
	secondHomeScore?: any;
	secondAwayScore?: any;
	homeGameScore?: any;
	awayGameScore?: any;
	sessionScores?: any;
	overTimeScores?: any;
	gameStatus: string;
	winDetail?: any;
	eventTime: string;
	soccerDetail: SoccerDetail;
	eSportMapDetail?: any;
}

export interface TeamInfo {
	homeId: number;
	homeName: string;
	homeIconUrl: string;
	awayId: number;
	awayName: string;
	awayIconUrl: string;
}

export interface GameInfo {
	livePeriod: number;
	clockDirection: string;
	seconds: number;
	isNeutral: boolean;
	isHt: boolean;
	isBreak: boolean;
	isClosed: boolean;
	inJuryTime: number;
	gameStatus: number;
	inPlayTime: string;
	delayLive: boolean;
	liveHomeScore: number;
	liveAwayScore: number;
}

/**
 * 足球
 */
export interface SoccerInfo {
	homeRedCard: number; // 主场红牌数
	awayRedCard: number; // 客场红牌数
	homeYellowCard: number; // 主场黄牌数
	awayYellowCard: number; // 客场黄牌数
}

/**
 * 篮球
 */
export interface BasketballInfo {
	homeGameScore: number[]; // 主队目前得分
	awayGameScore: number[]; // 客队目前得分
	latestLivePeriod: number; // 目前进行节数
	homeOverTimeScore: number; // 主隊延長賽得分
	awayOverTimeScore: number; // 客队延长赛得分
}

/**
 * 网球
 */
export interface TennisInfo {
	homeGameScore: number; //主队每盘获得局数
	awayGameScore: number; //客队每盘获得局数
	homePointScore: string; // 主队目前局数比分
	awayPointScore: string; // 客队目前局数比分
	currentSet: number; //	目前盘数
	currentServe: number; //	目前发球方 0=无发球方 1=主队 2=客队
}

/**
 * 沙滩排球
 */
export interface BeachVolleyBallInfo {
	homeGameScore: number[]; //主队每盘获得局数
	awayGameScore: number[]; //客队每盘获得局数
	currentSet: number; //目前盘数
	currentServe: number; //目前发球方 0=无发球方 1=主队 2=客队
	playerInjury: number; // 哪支队伍有人受伤 0=no one(无), 1=home(主队), 2=away(客队), 3=both(两队)
	isRain: boolean; //是否为雨天
}

/**
 * 电子竞技
 */
export interface ESportInfo {
	bestOfMap: number; //Best Of Map标识会打几个地图
	isStartingSoon: boolean; //	是否即将开赛
	moveBO3Down: boolean; //	控制是否显示网页的旗帜
	overTimeSession: number; //游戏名称 1 → Dota2 ; 2 → LOL ; 3 → CS2 ; 4 → KOG ; 5 → LOL:Wild Rift ;99 → Others
	leagueGroup: string; //电子竞技联赛名称
	leagueGroupId: number; //电子竞技联赛ID
}

/**
 * 篮球
 */
export interface BasketballInfo {
	homeGameScore: number[]; //主队目前得分
	awayGameScore: number[]; //客队目前得分
	latestLivePeriod: number; //	目前进行节数
	homeOverTimeScore: number; //	主隊延長賽得分
	awayOverTimeScore: number; //	客队延长赛得分
}

/**
 * 棒球
 */
export interface BaseballInfo {
	homeGameScore: number[]; //	主队目前得分
	awayGameScore: number[]; //	客队目前得分
	homeOverTimeScore: number; //	主隊延長賽比分
	awayOverTimeScore: number; //	客队延长赛比分
	baseHasRunner: boolean[]; //	垒上是否有跑者 第一笔项目为一垒是否有跑者，二、三垒以此类推
	currentInning: number; //	目前局数
	currentBattingTeam: number; //	目前打击队伍 1=主队，2=客队
	currentOuts: number; //	目前出局数
}

/**
 * 排球
 */
export interface VolleyballInfo {
	homeGameScore: number[]; //	主队每盘获得局数
	awayGameScore: number[]; //	客队每盘获得局数
	homePointScore: number; //	主队目前总比分
	awayPointScore: number; //	客队目前总比分
	currentServe: number; //	目前发球方 0=无发球方 1=主队 2=客队
	homeCurrentPoint: number; //	主队目前比分
	awayCurrentPoint: number; //	客队目前比分
	playerInjury: number; //	哪支队伍有人受伤 0=no one(无), 1=home(主队), 2=away(客队), 3=both(两队)
	latestLivePeriod: number; //	目前进行的节数
}

/**
 * 美式足球
 */

export interface FootballInfo {
	homeGameScore: number[]; //	主队每盘获得局数
	awayGameScore: number[]; //	客队每盘获得局数
	homeCurrentPoint: number; //	主队目前比分
	awayCurrentPoint: number; //	客队目前比分
	homeOverTimeScore: number; //	主隊延長賽比分
	awayOverTimeScore: number; //	客隊延長賽比分
}

/**
 * 桌球
 */
export interface TableTennisInfo {
	homeGameScore: number[]; //	主队每盘获得局数
	awayGameScore: number[]; //	客队每盘获得局数
	homeCurrentPoint: number; //	主队目前比分
	awayCurrentPoint: number; //	客队目前比分
	homeSetScore: number; //	主队获得盘数
	awaySetScore: number; //	客队获得盘数 isRain	bool	是否为雨天
	playerInjury: number; //	哪支队伍有人受伤 0=no one(无), 1=home(主队), 2=away(客队), 3=both(两队)
	CurrentSet: number; //	目前盘数
	currentServe: number; //	目前发球方 0=无发球方 1=主队 2=客队
}

/**
 * 羽毛球
 */
export interface BadmintonInfo {
	homeGameScore: number[]; //	主队每盘获得局数
	awayGameScore: number[]; //	客队每盘获得局数
	homeCurrentPoint: number; //	主队目前比分
	awayCurrentPoint: number; //	客队目前比分
	homeSetScore: number; //	主队获得盘数
	awaySetScore: number; //	客队获得盘数
	playerInjury: number; //	哪支队伍有人受伤 0=no one(无), 1=home(主队), 2=away(客队), 3=both(两队)
	CurrentSet: number; //	目前盘数
	currentServe: number; //	目前发球方 0=无发球方 1=主队 2=客队
}

export interface OddsPrice {
	americanPrice: number;
	decimalPrice: number;
	hongKongPrice: number;
	indoPrice: number;
	malayPrice: number;
	parlayPrice: number;
}

export interface Selection {
	key: string;
	keyName: string;
	oddsChange?: string;
	point?: number;
	point2?: number;
	oddsPrice: OddsPrice;
}

export interface Market {
	sportType: number;
	eventId: number;
	betType: number;
	betTypeName: string;
	marketId: number;
	maxBet: number;
	isLive: boolean;
	marketStatus: string;
	resourceId: string;
	category: number;
	showCategory: string;
	sort: number;
	combo: number;
	selections: Selection[];
}

export interface BetMarketInfo {
	betType: number;
	betTypeName?: string;
	marketId?: number;
	key?: string;
	keyName?: string;
	point?: number;
	decimalPrice?: number;
	differentBalls?: boolean;
	marketStatus?: string;
	oddsChange?: string;
	combo?: number;
}

export interface SportsRootObject {
	sportType: number;
	sportName: string;
	leagueId: number;
	leagueName: string;
	leagueIconUrl: string;
	eventId: number;
	eventCode: string;
	eventStatus: string;
	isMainMarket: boolean;
	kickOffTime: string;
	globalShowTime: string;
	countryCode: string;
	gameSession: number;
	parentId: number;
	isTest: boolean;
	isLive: boolean;
	isParlay: boolean;
	isCashout: boolean;
	isVirtualEvent: boolean;
	hasLiveMarket: boolean;
	marketCount: number;
	marketCategories: number[];
	streamingOption: number;
	channelCode: string;
	teamInfo: TeamInfo;
	gameInfo: GameInfo;
	soccerInfo?: SoccerInfo;
	tennisInfo?: TennisInfo;
	beachVolleyBallInfo?: BeachVolleyBallInfo;
	eSportInfo?: ESportInfo;
	basketballInfo?: BasketballInfo;
	baseballInfo?: BaseballInfo;
	volleyballInfo?: VolleyballInfo;
	footballInfo?: FootballInfo;
	tableTennisInfo?: TableTennisInfo;
	badmintonInfo?: BadmintonInfo;
	markets: Market[];
	betMarketInfo: BetMarketInfo;
}
