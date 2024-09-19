import { SportControlEnum } from "/@/views/sports/enum/sportEnum/sportEnum";

/**
 * 赛果表单数据
 */
export type QueryFormType = {
	ballType: number | string;
	date: Date[];
	league: string;
	competition: string;
	isLive: boolean;
};

/**
 * 赛果select配置
 */
export type QueryOptionItemType = {
	label: string;
	value: string;
	[s: string]: string;
};

export type ControlListType = {
	type: SportControlEnum; // 类型
	url: string; // 播放地址
};
