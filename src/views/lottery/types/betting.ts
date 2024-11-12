import { GamePlayCode } from "./playCode";

/**
 * @description 投注状态枚举
 */
export enum BetStatus {
	PENDING = 0, // 待开奖
	WIN = 1, // 已中奖
	LOSE = 2, // 未中奖
	CANCELLED = 3, // 已取消
}

/**
 * @description 投注项类型
 */
export interface BetItem {
	playId: string;
	optionId: string;
	amount: number;
	odds: string;
	gamePlayCode: GamePlayCode;
	optionGroup: string;
	optionName: string;
}

/**
 * @description 投注记录类型
 */
export interface BetRecord {
	id: string;
	gameCode: string;
	gameName: string;
	gamePlayName: string;
	optionName: string;
	betAmount: number;
	odds: string;
	winAmount: number;
	status: BetStatus;
	createTime: string;
}

/**
 * @description 投注表单类型
 */
export interface BetForm {
	gameCode: string;
	issueNo: string;
	betItems: BetItem[];
	totalAmount: number;
}

/**
 * @description 投注响应类型
 */
export interface BetResponse {
	success: boolean;
	message: string;
	orderId?: string;
	balance?: number;
}
