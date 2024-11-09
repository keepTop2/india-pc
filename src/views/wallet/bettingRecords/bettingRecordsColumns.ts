export interface columnsType {
	[key: string]: columnType[];
}
export interface columnType {
	label: string;
	props: string;
	type: string;
}
interface fieldMapType {
	[key: string]: string;
}

export const fieldMap: fieldMapType = {
	"1": "sabOrderList",
	"2": "sabOrderList",
	"3": "basicOrderPage",
	"4": "basicOrderPage",
	"5": "ltOrderPage",
	"6": "eventOrderPage",
	"7": "eventOrderPage",
};

export const colmuns = {
	体育: [
		{ type: "select" },
		{ label: "订单号", props: "orderId" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	真人: [
		{ type: "select" },
		{ label: "订单号", props: "orderId" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	电子: [
		{ label: "订单号", props: "orderId" },
		{ label: "游戏名称", props: "gameName" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	棋牌: [
		{ label: "订单号", props: "orderId" },
		{ label: "游戏名称", props: "gameName" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	电竞: [
		{ type: "select" },
		{ label: "订单号", props: "orderId" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	彩票: [
		{ type: "select" },
		{ label: "订单号", props: "orderId" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	斗鸡: [
		{ type: "select" },
		{ label: "订单号", props: "orderId" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
	视讯: [
		{ type: "select" },
		{ label: "订单号", props: "orderId" },
		{ label: "投注时间", props: "betTime" },
		{ label: "投注金额", props: "betAmount" },
		{ label: "输赢金额", props: "winLossAmount" },
		{ label: "注单状态", props: "orderClassifyText" },
	],
};
