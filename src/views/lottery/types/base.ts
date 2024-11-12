/**
 * @description 语言类型
 */
export type LangType = "zh";

/**
 * @description 启用状态
 */
export enum EnableStatus {
	DISABLED = 0, // 禁用
	ENABLED = 1, // 启用
}

/**
 * @description 分页信息
 */
export interface PaginationInfo {
	total: number; // 总条数
	size: number; // 每页大小
	current: number; // 当前页数
	pages: number; // 总页数
}

/**
 * @description 游戏区域类型
 */
export enum GameAreaType {
	DOMESTIC = 2, // 国内彩
	VIETNAM = 3, // 越南彩
	W4D = 4, // W4D
}

/**
 * @description 币种枚举
 */
export enum CurrencyCode {
	CNY = "CNY", // 人民币
	USD = "USD", // 美元
	BRL = "BRL", // 雷亚尔(巴西)
	MYR = "MYR", // 林吉特(马来西亚)
	VND = "VND", // 越南盾(越南)
	PHP = "PHP", // 比索(菲律宾)
	USDT = "USDT", // USDT
}
