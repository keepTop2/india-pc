import { SELECT_BALL } from "/@/views/lottery/constant/index";
import { type GameplayList } from "/@/views/lottery/types/index";
import { generateBalls } from "/@/views/lottery/utils/generateBalls";

// 投注项

export const gameplayList: GameplayList = [
	{
		id: "1",
		gamePlayName: "特码整合",
		gamePlayCodes: ["smp_tmzh_dxds"],
		desc: `特码大小：开奖特码≥14为“大”，≤13为“小”，所选形态与开奖特码形态相同，即中奖<br>特码单双：开奖特码个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”，所选形态与开奖特码形态相同，即中奖`,
		actived: false,
		oddsList: [
			{
				id: "1-1",
				title: "大",
				desc: "开奖特码≥14为“大”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "1-2",
				title: "小",
				desc: "开奖特码≤13为“小”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "1-3",
				title: "单",
				desc: "开奖特码个位数为1、3、5、7、9为“单”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "1-4",
				title: "双",
				desc: "开奖特码个位数为0、2、4、6、8为“双”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
		],
	},
	{
		id: "2",
		gamePlayName: "特码过关",
		gamePlayCodes: ["smp_tmzh_tmgg"],
		desc: `开奖特码≥14为“大”，≤13为“小”，个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”，通过大小和单双组合产生「大单」，「小单」，「大双」和「小双」四种组合，所选形态与开奖特码形态相同，即中奖<br>举例：开奖特码为1，投注「小单」，即中奖`,
		actived: false,
		oddsList: [
			{
				id: "2-1",
				title: "大单",
				desc: "开奖特码≥14为“大”，个位数为1、3、5、7、9为“单”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大单",
			},
			{
				title: "大双",
				desc: "开奖特码≥14为“大”，个位数为0、2、4、6、8为“双”",
				itemOdds: "1.995",
				id: "2-2",
				actived: false,
				optionCode: "大双",
			},
			{
				title: "小单",
				desc: "开奖特码≤13为“小”，个位数为1、3、5、7、9为“单”",
				itemOdds: "1.995",
				id: "2-3",
				actived: false,
				optionCode: "小单",
			},
			{
				title: "小双",
				desc: "开奖特码≤13为“小”，个位数为0、2、4、6、8为“双”",
				itemOdds: "1.995",
				id: "2-4",
				actived: false,
				optionCode: "小双",
			},
		],
	},
	{
		id: "3",
		gamePlayName: "极大小",
		gamePlayCodes: ["smp_tmzh_jdx"],
		desc: `特码极大小：所选形态（22～27为极大，0～5为极小，12～15为中位）与开奖特码的形态相同即中奖`,
		actived: false,
		oddsList: [
			{
				id: "3-1",
				title: "极大",
				desc: "所选形态22～27为极大",
				itemOdds: "1.995",
				actived: false,
				optionCode: "极大",
			},
			{
				id: "3-2",
				title: "极小",
				desc: "所选形态0～5为极小",
				itemOdds: "1.995",
				actived: false,
				optionCode: "极小",
			},
			{
				id: "3-3",
				title: "中位",
				desc: "所选形态12～15为中位",
				itemOdds: "1.995",
				actived: false,
				optionCode: "中位",
			},
		],
	},
	{
		id: "4",
		gamePlayName: "三位形态",
		gamePlayCodes: ["smp_swzh_swxt"],
		desc: `相连定义：0-1-2-3-4-5-6-7-8-9-0之间循环<br>豹子：3个相同的号码<br>举例：开奖号码1,1,1,投注「豹子」，即中奖<br>顺子：3个相连的号码；顺序不限<br>举例：开奖号码9,1,0，投注「顺子」，即中奖<br>对子：3个数字中有1个数字出现2次，另1个数字出现1次，顺序不限<br>举例：开奖号码0,3,0，投注「对子」，即中奖<br>半顺：3个数字各不相同，且其中只有2个数字相连；顺序不限<br>举例：开奖号码0,1,3，投注「半顺」，即中奖<br>杂六：3个数字各不相同且互不相连`,
		actived: false,
		oddsList: [
			{
				id: "4-1",
				title: "豹子",
				desc: "3个相同的号码",
				itemOdds: "1.995",
				actived: false,
				optionCode: "豹子",
			},
			{
				id: "4-2",
				title: "顺子",
				desc: "3个相连的号码；顺序不限",
				itemOdds: "1.995",
				actived: false,
				optionCode: "顺子",
			},
			{
				id: "4-3",
				title: "对子",
				desc: "3个数字中有1个数字出现2次，另1个数字出现1次，顺序不限",
				itemOdds: "1.995",
				actived: false,
				optionCode: "对子",
			},
			{
				id: "4-4",
				title: "杂六",
				desc: "3个数字各不相同且互不相连",
				itemOdds: "1.995",
				actived: false,
				optionCode: "杂六",
			},
			{
				id: "4-5",
				title: "半顺",
				desc: "3个数字各不相同，且其中只有2个数字相连；顺序不限",
				itemOdds: "1.995",
				actived: false,
				optionCode: "半顺",
			},
		],
	},
	{
		id: "5",
		gamePlayName: "第一位",
		gamePlayCodes: ["smp_swzh_dxds_dyw", "smp_xh_d1w"],
		desc: `选择一个位置，并投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>1.大小：开奖号码≥5为“大”，≤4为“小”<br>2.单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”<br>3.质合：开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”`,
		actived: false,
		oddsList: [
			{
				id: "5-1",
				title: "大",
				desc: "开奖号码≥5为“大”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "5-2",
				title: "小",
				desc: "开奖号码≤4为“小”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "5-3",
				title: "单",
				desc: "开奖号码1、3、5、7、9为“单”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "5-4",
				title: "双",
				desc: "开奖号码0、2、4、6、8为“双”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "5-5",
				title: "质",
				desc: "开奖号码1、2、3、5、7为“质”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "质",
			},
			{
				id: "5-6",
				title: "合",
				desc: "开奖号码0、4、6、8、9为“合”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "合",
			},
			{
				id: "5-7",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "0",
				type: SELECT_BALL,
				children: generateBalls({ length: 10, hasZero: false, startIndex: 0 }),
			},
		],
	},
	{
		id: "6",
		gamePlayName: "第二位",
		gamePlayCodes: ["smp_swzh_dxds_dew", "smp_xh_d2w"],
		desc: `选择一个位置，并投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>1.大小：开奖号码≥5为“大”，≤4为“小”<br>2.单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”<br>3.质合：开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”`,
		actived: false,
		oddsList: [
			{
				id: "6-1",
				title: "大",
				desc: "开奖号码≥5为“大”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "6-2",
				title: "小",
				desc: "开奖号码≤4为“小”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "6-3",
				title: "单",
				desc: "开奖号码1、3、5、7、9为“单”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "6-4",
				title: "双",
				desc: "开奖号码0、2、4、6、8为“双”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "6-5",
				title: "质",
				desc: "开奖号码1、2、3、5、7为“质”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "质",
			},
			{
				id: "6-6",
				title: "合",
				desc: "开奖号码0、4、6、8、9为“合”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "合",
			},
			{
				id: "6-7",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "0",
				type: SELECT_BALL,
				children: generateBalls({ length: 10, hasZero: false, startIndex: 0 }),
			},
		],
	},
	{
		id: "7",
		gamePlayName: "第三位",
		gamePlayCodes: ["smp_swzh_dxds_dsw", "smp_xh_d3w"],
		desc: `选择一个位置，并投注一种属性，投注的属性与该位置的开奖号码属性相同时，即中奖<br>1.大小：开奖号码≥5为“大”，≤4为“小”<br>2.单双：开奖号码1、3、5、7、9为“单”，0、2、4、6、8为“双”<br>3.质合：开奖号码1、2、3、5、7为“质”，0、4、6、8、9为“合”`,
		actived: false,
		oddsList: [
			{
				id: "7-1",
				title: "大",
				desc: "开奖号码≥5为“大”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "大",
			},
			{
				id: "7-2",
				title: "小",
				desc: "开奖号码≤4为“小”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "小",
			},
			{
				id: "7-3",
				title: "单",
				desc: "开奖号码1、3、5、7、9为“单”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "单",
			},
			{
				id: "7-4",
				title: "双",
				desc: "开奖号码0、2、4、6、8为“双”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "双",
			},
			{
				id: "7-5",
				title: "质",
				desc: "开奖号码1、2、3、5、7为“质”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "质",
			},
			{
				id: "7-6",
				title: "合",
				desc: "开奖号码0、4、6、8、9为“合”",
				itemOdds: "1.995",
				actived: false,
				optionCode: "合",
			},
			{
				id: "7-7",
				title: "选择球",
				desc: "",
				itemOdds: "1.995",
				actived: false,
				optionCode: "0",
				type: SELECT_BALL,

				children: generateBalls({ length: 10, hasZero: false, startIndex: 0 }),
			},
		],
	},
];
