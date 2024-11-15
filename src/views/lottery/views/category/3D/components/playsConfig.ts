import { SELECT_BALL } from "/@/views/lottery/constant/index";
import { type GameplayList } from "/@/views/lottery/types/index";

export const gameplayList: GameplayList = [
	{
		gamePlayName: "百位",
		gamePlayCodes: ["smp_bw_dxdszh", "smp_yzdwbw"],
		desc: `选择一个号码位置，并投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥5为“大”，≤4为“小”<br>单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”`,
		id: "1",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", desc: "开奖号码之和≥5为“大”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "1-1", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码之和≤4为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "1-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码之和的个位数为1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "1-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码之和的个位数为0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "1-4", actived: false },
			{ title: "选择球", optionCode: "0", desc: "", minBet: 10, maxBet: 1000, itemOdds: "7.995", id: "1-5", actived: false, type: "selectBall", ballNum: 10 },
		],
	},
	{
		gamePlayName: "十位",
		gamePlayCodes: ["smp_sw_dxdszh", "smp_yzdwsw"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥5为“大”，≤4为“小”<br>单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”`,
		id: "2",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", minBet: 10, maxBet: 1000, itemOdds: "9.775", id: "2-1", desc: "开奖号码≥5为“大”", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码≤4为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "2-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "2-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "2-4", actived: false },
			{ title: "选择球", optionCode: "0", desc: "", minBet: 10, maxBet: 1000, itemOdds: "7.995", id: "2-5", actived: false, type: "selectBall", ballNum: 10 },
		],
	},
	{
		gamePlayName: "个位",
		gamePlayCodes: ["smp_gw_dxdszh", "smp_yzdwgw"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥5为“大”，≤4为“小”<br>单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”`,
		id: "3",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", minBet: 10, maxBet: 1000, itemOdds: "9.775", id: "3-1", desc: "开奖号码≥5为“大”", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码≤4为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "3-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "3-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "3-4", actived: false },
			{ title: "选择球", optionCode: "0", desc: "", minBet: 10, maxBet: 1000, itemOdds: "7.995", id: "3-5", actived: false, type: "selectBall", ballNum: 10 },
		],
	},
	{
		gamePlayName: "百十位",
		gamePlayCodes: ["smp_bs_hdswdxzh"],
		desc: `和数单双：开奖号码中对应2个位置的号码之和的个位数是1、3、5、7、9为“和单”，0、2、4、6、8为“和双”<br>和数尾数大小：开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”，≤4为“和尾小”`,
		id: "4",
		actived: false,
		oddsList: [
			{
				title: "和单",
				optionCode: "和单",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "9.775",
				id: "4-1",
				desc: "开奖号码中对应2个位置的号码之和的个位数是1、3、5、7、9为“和单”",
				actived: false,
			},
			{
				title: "和双",
				optionCode: "和双",
				desc: "开奖号码中对应2个位置的号码之和的个位数是0、2、4、6、8为“和双”",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "2.395",
				id: "4-2",
				actived: false,
			},
			{ title: "和尾大", optionCode: "和尾大", desc: "开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "4-3", actived: false },
			{
				title: "和尾小",
				optionCode: "和尾小",
				desc: "开奖号码中对应2个位置的号码之和的个位数≤4为“和尾小”",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "1.995",
				id: "4-4",
				actived: false,
			},
		],
	},
	{
		gamePlayName: "百个位",
		gamePlayCodes: ["smp_bg_hdswdxzh"],
		desc: `和数单双：开奖号码中对应2个位置的号码之和的个位数是1、3、5、7、9为“和单”，0、2、4、6、8为“和双”<br>和数尾数大小：开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”，≤4为“和尾小”`,
		id: "5",
		actived: false,
		oddsList: [
			{
				title: "和单",
				optionCode: "和单",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "9.775",
				id: "5-1",
				desc: "开奖号码中对应2个位置的号码之和的个位数是1、3、5、7、9为“和单”",
				actived: false,
			},
			{
				title: "和双",
				optionCode: "和双",
				desc: "开奖号码中对应2个位置的号码之和的个位数是0、2、4、6、8为“和双”",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "2.395",
				id: "5-2",
				actived: false,
			},
			{ title: "和尾大", optionCode: "和尾大", desc: "开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "5-3", actived: false },
			{
				title: "和尾小",
				optionCode: "和尾小",
				desc: "开奖号码中对应2个位置的号码之和的个位数≤4为“和尾小”",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "1.995",
				id: "5-4",
				actived: false,
			},
		],
	},
	{
		gamePlayName: "十个位",
		gamePlayCodes: ["smp_sg_hdswdxzh"],
		desc: `和数单双：开奖号码中对应2个位置的号码之和的个位数是1、3、5、7、9为“和单”，0、2、4、6、8为“和双”<br>和数尾数大小：开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”，≤4为“和尾小”`,
		id: "6",
		actived: false,
		oddsList: [
			{
				title: "和单",
				optionCode: "和单",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "9.775",
				id: "6-1",
				desc: "开奖号码中对应2个位置的号码之和的个位数是0、2、4、6、8为“和双”",
				actived: false,
			},
			{
				title: "和双",
				optionCode: "和双",
				desc: "开奖号码中对应2个位置的号码之和的个位数是0、2、4、6、8为“和双”",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "2.395",
				id: "6-2",
				actived: false,
			},
			{ title: "和尾大", optionCode: "和尾大", desc: "开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "6-3", actived: false },
			{
				title: "和尾小",
				optionCode: "和尾小",
				desc: "开奖号码中对应2个位置的号码之和的个位数≤4为“和尾小”",
				minBet: 10,
				maxBet: 1000,
				itemOdds: "1.995",
				id: "6-4",
				actived: false,
			},
		],
	},
	{
		gamePlayName: "百十个位",
		gamePlayCodes: ["smp_bsg_hdswdxzh"],
		desc: `和数单双：开奖号码中对应2个位置的号码之和的个位数是1、3、5、7、9为“和单”，0、2、4、6、8为“和双”<br>和数尾数大小：开奖号码中对应2个位置的号码之和的个位数≥5为“和尾大”，≤4为“和尾小”`,
		id: "7",
		actived: false,
		oddsList: [
			{ title: "和大", optionCode: "和大", minBet: 10, maxBet: 1000, itemOdds: "9.775", id: "7-1", desc: "开奖的3个号码之和≥14为“和大”", actived: false },
			{ title: "和小", optionCode: "和小", desc: "开奖的3个号码之和≤13为“和小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "7-2", actived: false },
			{ title: "和单", optionCode: "和单", desc: "开奖的3个号码之和的个位数为1、3、5、7、9为“和单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "7-3", actived: false },
			{ title: "和双", optionCode: "和双", desc: "开奖的3个号码之和的个位数为0、2、4、6、8为“和双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "7-4", actived: false },
			{ title: "和尾大", optionCode: "和尾大", desc: "开奖的3个号码之和的尾数≥5为“和尾大”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "7-5", actived: false },
			{ title: "和尾小", optionCode: "和尾小", desc: "3个个位数字之和≤4为“尾和小”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "7-6", actived: false },
		],
	},
];
