// 投注项
export interface OddsListItem {
	id: string;
	title: string;
	desc: string;
	itemOdds: number;
	actived: boolean;
	optionCode: string;
}
export type OddsList = OddsListItem[];

// 玩法的大类
export interface BasePlaysConfig {
	id: string;
	gamePlayName: string;
	desc: string;
	actived: boolean;
	oddsList: OddsList;
}

export interface PlaysConfig extends BasePlaysConfig {
	gamePlayCodes: string[];
}

export interface DynamicPlaysConfig extends BasePlaysConfig {
	gamePlayCode: string;
}

export type PlaysConfigList = PlaysConfig[]; // 本地返回的玩法
export type DynamicPlaysConfigList = DynamicPlaysConfig[]; // 接口返回的玩法
