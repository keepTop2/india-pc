import { SELECT_BALL } from "/@/views/lottery/constant/index";
import { type GameplayList } from "/@/views/lottery/types/index";

export const gameplayList: GameplayList = [
	{
		gamePlayName: "总和",
		gamePlayCodes: ["smp_zh_dxdslhh"],
		desc: `总和大小：开奖号码之和≥23为“大”，≤22为“小”。<br> 总和单双：开奖号码之和的个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		id: "1",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", desc: "开奖号码之和≥23为“大”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "1-1", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码之和≤22为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "1-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码之和的个位数为1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "1-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码之和的个位数为0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "1-4", actived: false },
		],
	},
	{
		gamePlayName: "第一球",
		gamePlayCodes: ["smp_dxdszh_d1q", "smp_sz_d1q"],
		desc: `大小：开奖号码≥5为“大”，≤4为“小”。<br> 单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
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
		gamePlayName: "第二球",
		gamePlayCodes: ["smp_dxdszh_d2q", "smp_sz_d2q"],
		desc: `大小：开奖号码≥5为“大”，≤4为“小”。<br> 单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
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
		gamePlayName: "第三球",
		gamePlayCodes: ["smp_dxdszh_d3q", "smp_sz_d3q"],
		desc: `大小：开奖号码≥5为“大”，≤4为“小”。<br> 单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		id: "4",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", minBet: 10, maxBet: 1000, itemOdds: "9.775", id: "4-1", desc: "开奖号码≥5为“大”", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码≤4为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "4-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "4-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "4-4", actived: false },
			{ title: "选择球", optionCode: "0", desc: "", minBet: 10, maxBet: 1000, itemOdds: "7.995", id: "4-5", actived: false, type: "selectBall", ballNum: 10 },
		],
	},
	{
		gamePlayName: "第四球",
		gamePlayCodes: ["smp_dxdszh_d4q", "smp_sz_d4q"],
		desc: `大小：开奖号码≥5为“大”，≤4为“小”。<br> 单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		id: "5",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", minBet: 10, maxBet: 1000, itemOdds: "9.775", id: "5-1", desc: "开奖号码≥5为“大”", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码≤4为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "5-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "5-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "5-4", actived: false },
			{ title: "选择球", optionCode: "0", desc: "", minBet: 10, maxBet: 1000, itemOdds: "7.995", id: "5-5", actived: false, type: "selectBall", ballNum: 10 },
		],
	},
	{
		gamePlayName: "第五球",
		gamePlayCodes: ["smp_dxdszh_d5q", "smp_sz_d5q"],
		desc: `大小：开奖号码≥5为“大”，≤4为“小”。<br> 单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”。`,
		id: "6",
		actived: false,
		oddsList: [
			{ title: "大", optionCode: "大", minBet: 10, maxBet: 1000, itemOdds: "9.775", id: "6-1", desc: "开奖号码≥5为“大”", actived: false },
			{ title: "小", optionCode: "小", desc: "开奖号码≤4为“小”", minBet: 10, maxBet: 1000, itemOdds: "2.395", id: "6-2", actived: false },
			{ title: "单", optionCode: "单", desc: "开奖号码1、3、5、7、9为“单”", minBet: 10, maxBet: 1000, itemOdds: "1.05", id: "6-3", actived: false },
			{ title: "双", optionCode: "双", desc: "开奖号码0、2、4、6、8为“双”", minBet: 10, maxBet: 1000, itemOdds: "1.995", id: "6-4", actived: false },
			{ title: "选择球", optionCode: "0", desc: "", minBet: 10, maxBet: 1000, itemOdds: "7.995", id: "6-5", actived: false, type: "selectBall", ballNum: 10 },
		],
	},
];
