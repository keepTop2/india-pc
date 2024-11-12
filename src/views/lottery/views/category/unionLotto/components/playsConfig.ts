import { type LotteryList } from "/@/views/lottery/types/index";
// 投注项
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
			},
			{
				id: "1-2",
				title: "小",
				desc: "开奖的6个红球号码中≤16的号码数量比≥17的的号码数量多为“小多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "小",
			},
			{
				id: "1-3",
				title: "大小和",
				desc: "开奖的6个红球号码中≥17和≤16的号码数量相等为“和”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "和",
			},
			{
				id: "1-4",
				title: "单",
				desc: "开奖的6个红球号码中尾数为1、3、5、7、9的号码数量比尾数为0、2、4、6、8的号码数量多为“单多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "单",
			},
			{
				id: "1-5",
				title: "双",
				desc: "开奖的6个红球号码中尾数为0、2、4、6、8的号码数量比尾数为1、3、5、7、9的号码数量多为“双多”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "双",
			},
			{
				id: "1-6",
				title: "单双和",
				desc: "开奖的6个红球号码中单双数字数量相等为“和”",
				itemOdds: 1.995,
				actived: false,
				optionCode: "和",
			},
			{
				id: "1-7",
				title: "选择红球",
				desc: "选择1个红球号码",
				itemOdds: 1.995,
				actived: false,
				optionCode: "rx1",
			},
		],
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
			},
			{
				id: "2-2",
				title: "小",
				desc: "选择蓝球小数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "小",
			},
			{
				id: "2-3",
				title: "单",
				desc: "选择蓝球单数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "单",
			},
			{
				id: "2-4",
				title: "双",
				desc: "选择蓝球双数",
				itemOdds: 1.97,
				actived: false,
				optionCode: "双",
			},
			{
				id: "2-5",
				title: "蓝球选号",
				desc: "选择1个蓝球号码",
				itemOdds: 13.97,
				actived: false,
				optionCode: "lqxh",
			},
		],
	},
];
