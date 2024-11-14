import { LangType, EnableStatus, GameAreaType } from "./base";

/**
 * @description 彩票基础选项类型
 * @property {string} id - 选项ID
 * @property {string} merchantCode - 商户代码
 * @property {number} itemIndex - 选项索引
 * @property {string} gamePlayCode - 玩法代码
 * @property {string} gamePlayName - 玩法名称
 * @property {string} optionCode - 选项代码
 * @property {string} optionName - 选项名称
 * @property {string} itemOdds - 赔率
 * @property {number} multiCheck - 是否可多选
 * @property {string | null} mutualGroup - 互斥组
 * @property {string} gameCode - 游戏代码
 * @property {string} categoryCode - 分类代码
 * @property {number | null} itemType - 选项类型
 * @property {number} isEnabled - 是否启用
 * @property {string} lang - 语言
 * @property {string} optionGroup - 选项组
 * @property {boolean} isSpecialPlay - 是否为特殊玩法
 */
export interface LotteryOption {
	id: string;
	merchantCode: string;
	itemIndex: number;
	gamePlayCode: string;
	gamePlayName: string;
	optionCode: string;
	optionName: string;
	itemOdds: string;
	multiCheck: number;
	mutualGroup: string | null;
	gameCode: string;
	categoryCode: string;
	itemType: number | null;
	isEnabled: number;
	lang: string;
	optionGroup: string;
	// 额外增加的类型项，用于展示投注项列表
	title?: string;
	desc?: string;
	actived?: boolean;
	isSpecialPlay?: boolean;
}

/**
 * @description 彩票玩法类型
 * @property {string} id - 玩法ID
 * @property {string} structCode - 结构代码
 * @property {string} merchantCode - 商户代码
 * @property {number} itemIndex - 玩法索引
 * @property {string} categoryCode - 分类代码
 * @property {string} categoryName - 分类名称
 * @property {string} gameCode - 游戏代码
 * @property {string} gameName - 游戏名称
 * @property {string} gamePlayCode - 玩法代码
 * @property {string} gamePlayName - 玩法名称
 * @property {number} itemType - 玩法类型
 * @property {number} isEnabled - 是否启用
 * @property {number} hotFlag - 热门标记
 * @property {number} maxBonus - 最大奖金
 * @property {number} totalBet - 总投注
 * @property {number | null} maxBet - 最大投注
 * @property {number} minLimit - 最小限额
 * @property {number} maxLimit - 最大限额
 * @property {string} lang - 语言
 * @property {string | null} gamePlayGroup - 玩法组
 * @property {string} oddsPosition - 赔率位置
 * @property {LotteryOption[]} oddsList - 赔率列表
 * @property {any[] | null} multiList - 多选列表
 */
export interface LotteryPlay {
	id: string;
	structCode: string;
	merchantCode: string;
	itemIndex: number;
	categoryCode: string;
	categoryName: string;
	gameCode: string;
	gameName: string;
	gamePlayCode: string;
	gamePlayName: string;
	itemType: number;
	isEnabled: number;
	hotFlag: number;
	maxBonus: number;
	totalBet: number;
	maxBet: number | null;
	minLimit: number;
	maxLimit: number;
	lang: string;
	gamePlayGroup: string | null;
	oddsPosition: string;
	oddsList: LotteryOption[];
	multiList: any[] | null;
}

/**
 * @description 彩票玩法组类型
 * @property {string} id - 玩法组ID
 * @property {string} title - 玩法组标题
 * @property {string} gamePlayName - 玩法组名称
 * @property {string[]} gamePlayCodes - 玩法组包含的玩法代码
 * @property {string} desc - 玩法组描述
 * @property {boolean} actived - 是否激活
 * @property {LotteryOption[]} oddsList - 玩法组包含的赔率列表
 */
export interface LotteryPlayGroup {
	id: string;
	gamePlayName: string;
	gamePlayCodes: string[];
	desc: string;
	actived: boolean;
	oddsList: LotteryOption[];
}

/**
 * @description 彩票接口返回数据类型
 * @property {number} code - 响应代码
 * @property {string} msg - 响应消息
 * @property {LotteryPlay[]} data - 玩法数据
 */
export interface LotteryResponse {
	code: number;
	msg: string;
	data: LotteryPlay[];
}

/**
 * @description 彩种分类代码
 * @enum {string}
 * @property {string} LUCKY28 - 幸运28
 * @property {string} K3 - 快三
 * @property {string} PK10 - PK10
 * @property {string} SSC - 时时彩
 * @property {string} LHC - 六合彩
 * @property {string} D3 - 3D
 * @property {string} SYXW - 11选5
 * @property {string} SSQ - 双色球
 * @property {string} NVN - 北部越南彩
 * @property {string} CVN - 中部越南彩
 * @property {string} SVN - 南部越南彩
 * @property {string} W4D - 万字4D
 */
export enum LotteryCategoryCode {
	LUCKY28 = "_28", // 幸运28
	K3 = "K3", // 快三
	PK10 = "PK10", // PK10
	SSC = "SSC", // 时时彩
	LHC = "LHC", // 六合彩
	D3 = "_3D", // 3D
	SYXW = "SYXW", // 11选5
	SSQ = "SSQ", // 双色球
	NVN = "NVN", // 北部越南彩
	CVN = "CVN", // 中部越南彩
	SVN = "SVN", // 南部越南彩
	W4D = "W4D", // 万字4D
}

/**
 * @description 彩种编号
 * @enum {string}
 * @property {string} SPEED_SYXW - 极速11选5
 * @property {string} SPEED_28 - 极速幸运28
 * @property {string} SPEED_K3 - 极速快三
 * @property {string} SPEED_LHC - 极速六合彩
 * @property {string} SPEED_PK10 - 极速赛车
 * @property {string} SPEED_SSC - 分分彩
 * @property {string} SPEED_SSQ - 极速双色球
 * @property {string} SPEED_3D - 极速3D
 * @property {string} SPEED_W4D - 极速万字
 * @property {string} LUCKY_K3 - 幸运快三
 * @property {string} LUCKY_LHC - 六合3分彩
 * @property {string} LUCKY_PK10 - 幸运飞艇
 * @property {string} LUCKY_SSC - 三分彩
 * @property {string} LUCKY_SSQ - 幸运双色球
 * @property {string} LUCKY_SYXW - 幸运11选5
 * @property {string} LUCKY_28 - 竞速幸运28
 * @property {string} LUCKY_3D - 幸运3D
 * @property {string} LUCKY_W4D - 竞速万字
 * @property {string} STANDARD_K3 - 快三
 * @property {string} STANDARD_LHC - 六合5分彩
 * @property {string} STANDARD_PK10 - PK10
 * @property {string} STANDARD_SSC - 五分彩
 * @property {string} STANDARD_SSQ - 双色球
 * @property {string} STANDARD_SYXW - 11选5
 * @property {string} STANDARD_28 - 幸运28
 * @property {string} STANDARD_3D - 5分3D
 * @property {string} STANDARD_W4D - 幸运万字
 * @property {string} FC_SSQ - 福彩双色球
 * @property {string} FC_3D - 福彩3D
 * @property {string} HK_LHC - 香港六合彩
 * @property {string} LUCKY_PK10_168 - 168飞艇
 * @property {string} MARK_LHC - 澳门六合彩
 * @property {string} NEW_MARK_LHC - 新澳门六合彩
 * @property {string} PL3_3D - 体彩排列3
 */
export enum LotteryCode {
	// 极速系列
	SPEED_SYXW = "1FSYXW", // 极速11选5
	SPEED_28 = "1F_28", // 极速幸运28
	SPEED_K3 = "MYK3", // 极速快三
	SPEED_LHC = "MYLHC", // 极速六合彩
	SPEED_PK10 = "MYPK10", // 极速赛车
	SPEED_SSC = "MYSSC", // 分分彩
	SPEED_SSQ = "HTSSQ", // 极速双色球
	SPEED_3D = "HT_3D", // 极速3D
	SPEED_W4D = "1FW4D", // 极速万字

	// 幸运系列
	LUCKY_K3 = "3FK3", // 幸运快三
	LUCKY_LHC = "3FLHC", // 六合3分彩
	LUCKY_PK10 = "3FPK10", // 幸运飞艇
	LUCKY_SSC = "3FSSC", // 三分彩
	LUCKY_SSQ = "3FSSQ", // 幸运双色球
	LUCKY_SYXW = "3FSYXW", // 幸运11选5
	LUCKY_28 = "3F_28", // 竞速幸运28
	LUCKY_3D = "3F_3D", // 幸运3D
	LUCKY_W4D = "3FW4D", // 竞速万字

	// 标准系列
	STANDARD_K3 = "5FK3", // 快三
	STANDARD_LHC = "5FLHC", // 六合5分彩
	STANDARD_PK10 = "5FPK10", // PK10
	STANDARD_SSC = "5FSSC", // 五分彩
	STANDARD_SSQ = "5FSSQ", // 双色球
	STANDARD_SYXW = "5FSYXW", // 11选5
	STANDARD_28 = "5F_28", // 幸运28
	STANDARD_3D = "5F_3D", // 5分3D
	STANDARD_W4D = "5FW4D", // 幸运万字

	// 福彩系列
	FC_SSQ = "FCSSQ", // 福彩双色球
	FC_3D = "FC_3D", // 福彩3D

	// 特殊彩种
	HK_LHC = "HKLHC", // 香港六合彩
	LUCKY_PK10_168 = "LUCKYPK10", // 168飞艇
	MARK_LHC = "MARKLHC", // 澳门六合彩
	NEW_MARK_LHC = "NEWMARKLHC", // 新澳门六合彩
	PL3_3D = "PL3_3D", // 体彩排列3
}
