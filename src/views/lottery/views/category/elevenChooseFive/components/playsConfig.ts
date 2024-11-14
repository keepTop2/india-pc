import { SELECT_BALL } from "/@/views/lottery/constant/index";
import { type GameplayList } from "/@/views/lottery/types/index";
// 投注项

export const gameplayList: GameplayList = [
	{
		id: "1",
		gamePlayName: "总和",
		gamePlayCodes: ["smp_zh_hdxdslhwdwx"],
		desc: `总和大小:开奖号码之和>30为大，<30为小，30为和，退还本金<br>总和单双:开奖号码之和的个位数是1、3、5、7、9为单，尾数是0、2、4、6、8，为双<br>总和尾数大小:开奖号码之和的个位数≥5为大，≤4为小`,
		actived: false,
		oddsList: [
			{
				id: "1-1",
				title: "大",
				desc: `开奖号码之和>30为"大", 30为"和"，退还本金`,
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "1-2",
				title: "小",
				desc: `开奖号码之和<30为"小", 30为"和"，退还本金`,
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "1-3",
				title: "单",
				desc: `开奖号码之和的个位数是1、3、5、7、9为"单"`,
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "1-4",
				title: "双",
				desc: `开奖号码之和的个位数是0、2、4、6、8为"双"`,
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "1-5",
				title: "尾大",
				desc: `开奖号码之和的个位数≥5为"大"`,
				itemOdds: "1.995",
				actived: false,
				optionCode: "尾大",
			},
			{
				id: "1-6",
				title: "尾小",
				desc: `开奖号码之和的个位数≤4为"小"`,
				itemOdds: "1.995",
				actived: false,
				optionCode: "尾小",
			},
		],
	},
	{
		id: "2",
		gamePlayName: "第一球",
		gamePlayCodes: ["smp_d1q"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥6为“大”，≤5为“小”，开出11为和(退还本金)<br>单双：开奖号码的个位数为1、3、5、7、9为“单”，0，2，4，6，8为“双”。开出11为和(退还本金)`,
		actived: false,
		oddsList: [
			{
				id: "2-1",
				title: "大",
				desc: "开奖号码≥6为“大”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "2-2",
				title: "小",
				desc: "开奖号码≤5为“小”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "2-3",
				title: "单",
				desc: "开奖号码的个位数为1、3、5、7、9为“单”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "2-4",
				title: "双",
				desc: "开奖号码的个位数为0，2，4，6，8为“双”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "2-5",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "01",
				type: SELECT_BALL,
				ballNum: 11,
			},
		],
	},
	{
		id: "3",
		gamePlayName: "第二球",
		gamePlayCodes: ["smp_d2q"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥6为“大”，≤5为“小”，开出11为和(退还本金)<br>单双：开奖号码的个位数为1、3、5、7、9为“单”，0，2，4，6，8为“双”。开出11为和(退还本金)`,
		actived: false,
		oddsList: [
			{
				id: "3-1",
				title: "大",
				desc: "开奖号码≥6为“大”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "3-2",
				title: "小",
				desc: "开奖号码≤5为“小”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "3-3",
				title: "单",
				desc: "开奖号码的个位数为1、3、5、7、9为“单”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "3-4",
				title: "双",
				desc: "开奖号码的个位数为0，2，4，6，8为“双”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "3-5",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "01",
				type: SELECT_BALL,
				ballNum: 11,
			},
		],
	},
	{
		id: "4",
		gamePlayName: "第三球",
		gamePlayCodes: ["smp_d3q"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥6为“大”，≤5为“小”，开出11为和(退还本金)<br>单双：开奖号码的个位数为1、3、5、7、9为“单”，0，2，4，6，8为“双”。开出11为和(退还本金)`,
		actived: false,
		oddsList: [
			{
				id: "4-1",
				title: "大",
				desc: "开奖号码≥6为“大”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "4-2",
				title: "小",
				desc: "开奖号码≤5为“小”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "4-3",
				title: "单",
				desc: "开奖号码的个位数为1、3、5、7、9为“单”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "4-4",
				title: "双",
				desc: "开奖号码的个位数为0，2，4，6，8为“双”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "4-5",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "01",
				type: SELECT_BALL,
				ballNum: 11,
			},
		],
	},
	{
		id: "5",
		gamePlayName: "第四球",
		gamePlayCodes: ["smp_d4q"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥6为“大”，≤5为“小”，开出11为和(退还本金)<br>单双：开奖号码的个位数为1、3、5、7、9为“单”，0，2，4，6，8为“双”。开出11为和(退还本金)`,
		actived: false,
		oddsList: [
			{
				id: "5-1",
				title: "大",
				desc: "开奖号码≥6为“大”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "5-2",
				title: "小",
				desc: "开奖号码≤5为“小”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "5-3",
				title: "单",
				desc: "开奖号码的个位数为1、3、5、7、9为“单”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "5-4",
				title: "双",
				desc: "开奖号码的个位数为0，2，4，6，8为“双”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "5-5",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "01",
				type: SELECT_BALL,
				ballNum: 11,
			},
		],
	},
	{
		id: "6",
		gamePlayName: "第五球",
		gamePlayCodes: ["smp_d5q"],
		desc: `投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>大小：开奖号码≥6为“大”，≤5为“小”，开出11为和(退还本金)<br>单双：开奖号码的个位数为1、3、5、7、9为“单”，0，2，4，6，8为“双”。开出11为和(退还本金)`,
		actived: false,
		oddsList: [
			{
				id: "5-1",
				title: "大",
				desc: "开奖号码≥6为“大”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "5-2",
				title: "小",
				desc: "开奖号码≤5为“小”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "5-3",
				title: "单",
				desc: "开奖号码的个位数为1、3、5、7、9为“单”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "5-4",
				title: "双",
				desc: "开奖号码的个位数为0，2，4，6，8为“双”，开出11为和，退还本金",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "5-5",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "01",
				type: SELECT_BALL,
				ballNum: 11,
			},
		],
	},
];