import { LangType, GameAreaType } from "./base";
import { LotteryCategoryCode, LotteryCode } from "./lottery";

/**
 * @description 游戏状态枚举
 */
export enum GameState {
	NOT_OPENED = 1, // 未开盘
	OPENING = 2, // 开盘中
	CLOSED = 3, // 已封盘
	SETTLED = 4, // 已结算
}

/**
 * @description 游戏状态枚举
 */
export enum GameStateEnum {
	BETTING = "betting", // 投注中
	LOCKING = "locking", // 封盘中
	DRAWING = "drawing", // 开奖中
}

/**
 * @description 游戏基础信息
 */
export interface GameBaseInfo {
	id: string; // 游戏ID
	gameCode: LotteryCode; // 游戏编号
	gameName: string; // 游戏名称
	state: number; // 游戏状态
	gameCategoryCode: LotteryCategoryCode; // 分类编号
	issueCount: number; // 总期数
	timeInterval: number; // 时间间隔
	stopBettingInterval: number; // 停止投注间隔(秒)
	beginTime: string; // 开始时间
	iconPc: string; // PC端图标路径
	iconH5: string; // H5端图标路径
	issueNum: string; // 下期期号
	lotteryNum: string; // 上期开奖号码
	lotteryTime: number; // 上期开奖时间
	lotteryDate: number; // 当期结束时间
	areaType: GameAreaType; // 地区类型
	gameDesc: string; // 游戏描述
	currentTime: number; // 系统当前时间
	maxWin: number; // 最大赢额
}

/**
 * @description 游戏查询请求参数
 */
export interface GameQueryParams {
	operatorId?: string; // 运营商代码
	gameCategoryCodes?: string; // 游戏分类编码集合，多个用逗号隔开
	gameCodes?: string; // 游戏编码集合，多个用逗号隔开
	lang: LangType; // 语言类型
}

/**
 * @description 游戏查询响应
 */
export interface GameQueryResponse {
	code: string; // 操作结果编号，0成功
	msg: string; // 异常消息，成功则为空
	data: GameBaseInfo[]; // 游戏数据列表
}

/**
 * @description 游戏列表项
 */
/**
 * @description 游戏列表项接口定义
 * @property {string} id - 游戏ID
 * @property {string} name - 游戏名称
 * @property {string} icon - 游戏图标
 * @property {string} iconFileUrl - 游戏图标文件URL
 * @property {number} status - 游戏状态
 * @property {string} remark - 游戏备注
 * @property {number} sort - 排序值
 * @property {string} venueCode - 场馆代码
 * @property {string} gameCode - 游戏代码
 * @property {string} gameCategoryCode - 游戏分类代码
 * @property {GameBaseInfo} data - 游戏基础信息
 * @property {number} label - 标签值
 * @property {number} cornerLabels - 角标标签
 * @property {string | null} maintenanceStartTime - 维护开始时间
 * @property {string | null} maintenanceEndTime - 维护结束时间
 * @property {boolean} collect - 是否收藏
 */
export interface GameListItem {
	id: string;
	name: string;
	icon: string;
	iconFileUrl: string;
	status: number;
	remark: string;
	sort: number;
	venueCode: string;
	gameCode: string;
	gameCategoryCode: string;
	data: GameBaseInfo;
	label: number;
	cornerLabels: number;
	maintenanceStartTime: string | null;
	maintenanceEndTime: string | null;
	collect: boolean;
}

/**
 * @description 游戏分类
 */
export interface GameCategory {
	id: string | null;
	name: string | null;
	label: number;
	hasMoreGames: boolean;
	icon: string | null;
	iconFileUrl: string | null;
	gameInfoList: GameListItem[];
}
