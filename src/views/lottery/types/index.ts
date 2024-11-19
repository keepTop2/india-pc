export * from "./account";
export * from "./base";
export * from "./betting";
export * from "./game";
export * from "./lottery";
export * from "./playCode";
// 投注项
export interface OddsItem {
	id: string;
	title: string;
	desc: string;
	itemOdds: string;
	actived: boolean;
	optionCode: string;
	gameCode?: string;
	gamePlayCode?: string;
	minBet?: number;
	maxBet?: number;
	type?: string;
	ballNum?: number;
	startIndex?: number;
	selectBallDesc?: string;
	oddsList?: OddsItem[];
}

export type OddsList = OddsItem[];

export interface GameplayItem {
	id: string;
	gamePlayName: string;
	desc: string;
	actived: boolean;
	oddsList: OddsList;
	minLimit?: number;
	maxLimit?: number;
	categoryCode?: string;
	gamePlayCode?: string;
	gamePlayCodes: string[];
}

export type GameplayList = GameplayItem[];

export interface LotteryDetail {
	id: string;
	issueNum: string;
	gameName: string;
	gameCode: string;
	iconPc?: string;
	seconds: number;
}
