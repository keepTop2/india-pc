export * from "./account";
export * from "./base";
export * from "./betting";
export * from "./game";
export * from "./lottery";
export * from "./playCode";
// 投注项
export interface OddsListItem {
	id: string;
	title: string;
	desc: string;
	itemOdds: string;
	actived: boolean;
	optionCode: string;
	gameCode?: string;
	gamePlayCode?: string;

	type?: string;
	ballNum?: number;
}
export type OddsList = OddsListItem[];

// 玩法的大类，不导出使用，给下面的 LotteryItem 和 DynamicLotteryItem 使用的
interface BaseLotteryItem {
	id: string;
	gamePlayName: string;
	desc: string;
	actived: boolean;
	oddsList: OddsList;
	minLimit?: number;
	maxLimit?: number;
}

export interface LotteryItem extends BaseLotteryItem {
	gamePlayCodes: string[];
}

export interface DynamicLotteryItem extends BaseLotteryItem {
	gamePlayCode: string;
}

export interface MergedLotteryItem extends LotteryItem, DynamicLotteryItem {}

export type LotteryList = LotteryItem[]; // 本地的玩法列表
export type DynamicLotteryList = DynamicLotteryItem[]; // 接口返回的玩法列表
export type MergedLotteryList = MergedLotteryItem[]; // 合并后的玩法列表

export interface LotteryDetail {
	id: string;
	issueNum: string;
	gameName: string;
	gameCode: string;
	iconPc?: string;
}
