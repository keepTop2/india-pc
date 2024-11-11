import { type LotteryList } from "/@/views/lottery/types/index";

/**
 * @description 接口参数配置
 */
export const beginPageDataParams = {
	gameCode: "HTSSQ", // 极速双色球
	gameCategoryCodes: "UNION_LOTTO", // 联合彩票类型
};

export const queryGamePlayOddsListParams = {
	gameCode: "HTSSQ",
};

/**
 * @description 双色球玩法配置
 */
export const lotteryList: LotteryList = [
	{
		id: "1",
		gamePlayName: "红球",
		gamePlayCodes: ["smp_hq_sm_dsd", "smp_hq_sm_dxd", "smp_hq_rx1"],
		desc: "红球单双多：开奖的6个红球号码中尾数为1、3、5、7、9的号码数量，比尾数为0、2、4、6、8的号码数量多为“单多”，反之为“双多”，分别都是3个为“和” /n 红球大小多：开奖的6个红球号码中≥17的号码数量比≤16的的号码数量多为“大多”，反之为“小多”，分别都是3个为“和”",
		actived: false,
		oddsList: [
			{
				id: "1-1", 
				title: "大",
				desc: "开奖的6个红球号码中≥17的号码数量比≤16的的号码数量多为“大多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "大",
				gamePlayCode: "smp_hq_sm_dxd",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "1-2",
				title: "小",
				desc: "开奖的6个红球号码中≤16的号码数量比≥17的的号码数量多为“小多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "小",
				gamePlayCode: "smp_hq_sm_dxd",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "1-3",
				title: "大小和",
				desc: "开奖的6个红球号码中≥17和≤16的号码数量相等为“和”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "和",
				gamePlayCode: "smp_hq_sm_dxd",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "1-4",
				title: "单",
				desc: "开奖的6个红球号码中尾数为1、3、5、7、9的号码数量比尾数为0、2、4、6、8的号码数量多为“单多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "单",
				gamePlayCode: "smp_hq_sm_dsd",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "1-5",
				title: "双",
				desc: "开奖的6个红球号码中尾数为0、2、4、6、8的号码数量比尾数为1、3、5、7、9的号码数量多为“双多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "双",
				gamePlayCode: "smp_hq_sm_dsd",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "1-6",
				title: "单双和",
				desc: "开奖的6个红球号码中单双数字数量相等为“和”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "和",
				gamePlayCode: "smp_hq_sm_dsd",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "1-7",
				title: "选择红球",
				desc: "选择1个红球号码",
				itemOdds: 1.995,
				actived: false,
				optionCode: "rx1",
				gamePlayCode: "smp_hq_rx1",
				type: "selectBall",
				ballNum: 33,
				maxSelect: 1
			}
		]
	},
	{
		id: "2",
		gamePlayName: "蓝球",
		gamePlayCodes: ["smp_lq_sm", "smp_lq_lqxh"],
		desc: "蓝球玩法，包含双面玩法和蓝球选号",
		actived: false,
		oddsList: [
			{
				id: "2-1",
				title: "大",
				desc: "选择蓝球大数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "大",
				gamePlayCode: "smp_lq_sm",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "2-2",
				title: "小",
				desc: "选择蓝球小数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "小",
				gamePlayCode: "smp_lq_sm",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "2-3",
				title: "单",
				desc: "选择蓝球单数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "单",
				gamePlayCode: "smp_lq_sm",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "2-4",
				title: "双",
				desc: "选择蓝球双数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "双",
				gamePlayCode: "smp_lq_sm",
				minBet: 2,
				maxBet: 10000
			},
			{
				id: "2-5",
				title: "蓝球选号",
				desc: "选择1个蓝球号码",
				itemOdds: 13.97,
				actived: false,
				optionCode: "lqxh",
				gamePlayCode: "smp_lq_lqxh",
				type: "selectBall",
				ballNum: 16,
				maxSelect: 1
			}
		]
	}
];

/**
 * @description 游戏代码类型
 */
export enum GameCode {
	HTSSQ = "HTSSQ", // 极速双色球
	XYSSQ = "3FSSQ", // 幸运双色球
	SSQ = "5FSSQ"    // 双色球
}

/**
 * @description 玩法代码类型
 */
export enum PlayCode {
	RED_DS = "smp_hq_sm_dsd",  // 红球单双多
	RED_DX = "smp_hq_sm_dxd",  // 红球大小多
	RED_RX = "smp_hq_rx1",     // 红球任选一
	BLUE_SM = "smp_lq_sm",     // 蓝球双面
	BLUE_XH = "smp_lq_lqxh"    // 蓝球选号
}
