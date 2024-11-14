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
	selectBallDesc?: string;
	oddsList?: OddsListItem[];
}
export type OddsList = OddsListItem[];

// 玩法的大类，不导出使用，给下面的 GameplayItem 和 DynamicGameplayItem 使用的
interface BaseGameplayItem {
	id: string;
	gamePlayName: string;
	desc: string;
	actived: boolean;
	oddsList: OddsList;
	minLimit?: number;
	maxLimit?: number;
}

export interface GameplayItem extends BaseGameplayItem {
	gamePlayCodes: string[];
}

export interface DynamicGameplayItem extends BaseGameplayItem {
	gamePlayCode: string;
}

export interface MergedGameplayItem extends GameplayItem, DynamicGameplayItem {}

export type GameplayList = GameplayItem[]; // 本地的玩法列表
export type DynamicGameplayList = DynamicGameplayItem[]; // 接口返回的玩法列表
export type MergedGameplayList = MergedGameplayItem[]; // 合并后的玩法列表

export interface LotteryDetail {
	id: string;
	issueNum: string;
	gameName: string;
	gameCode: string;
	iconPc?: string;
	seconds: number;
}
