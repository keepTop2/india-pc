import { LotteryPlayGroup } from "/@/views/lottery/types/lottery";

/**
 * @description 双色球 静态玩法配置
 * @author Hida
 * @description 特殊玩法 需要配置 gamePlayCode 用于匹配玩法，isSpecialPlay走特殊玩法逻辑 对应数据会直接返回不做投注项处理
 */
export const gameplayList: LotteryPlayGroup[] = [
	{
		id: "1",
		gamePlayName: "红球",
		gamePlayCodes: ["smp_hq_sm_dxd", "smp_hq_sm_dsd", "smp_hq_rx1"],
		desc: "红球单双多：开奖的6个红球号码中尾数为1、3、5、7、9的号码数量，比尾数为0、2、4、6、8的号码数量多为“单多”，反之为“双多”，分别都是3个为“和” <br />红球大小多：开奖的6个红球号码中≥17的号码数量比≤16的的号码数量多为“大多”，反之为“小多”，分别都是3个为“和”",
		actived: false,
		oddsList: [
			{
				title: "大多",
				desc: "开奖的6个红球号码中≥17的号码数量比≤16的的号码数量多为“大多”",
				actived: false,
				optionCode: "大多",
			},
			{
				title: "小多",
				desc: "开奖的6个红球号码中≥17的号码数量比≤16的的号码数量少为“小多”",
				actived: false,
				optionCode: "小多",
			},
			{
				title: "大小 和",
				desc: "开奖的6个红球号码中，大小分别都是3个为“和”",
				actived: false,
				optionCode: "和",
			},
			{
				title: "单多",
				desc: "开奖的6个红球号码中尾数为1、3、5、7、9的号码数量，比尾数为0、2、4、6、8的号码数量多为“单多”",
				actived: false,
				optionCode: "单多",
			},
			{
				title: "双多",
				desc: "开奖的6个红球号码中尾数为1、3、5、7、9的号码数量，比尾数为0、2、4、6、8的号码数量少为“双多”",
				actived: false,
				optionCode: "双多",
			},
			{
				title: "单双 和",
				desc: "开奖的6个红球号码中，单双分别都是3个为“和”",
				actived: false,
				optionCode: "和",
			},
			{
				id: 2,
				type: "selectBall",
				title: "选择球",
				// desc: "请选择一个球号",
				actived: false,
				//特殊玩法标识 需要配置 gamePlayCode 用于匹配玩法，isSpecialPlay走特殊玩法逻辑
				gamePlayCode: "smp_hq_rx1",
				isSpecialPlay: true,
				ballNum: 33,
			},
		],
	},
	{
		id: "2",
		gamePlayName: "蓝球",
		gamePlayCodes: ["smp_lq_sm", "smp_lq_lqxh"],
		desc: "蓝球选号：从16个号码中选择1个号码形成1注，所选号码与开奖的蓝球号码相同即中奖<br />举例：开奖蓝球01，投注「蓝球选号-01」，即中奖<br />蓝球大小：开奖蓝球≥09为“大”，≤08为“小”<br />蓝球单双：开奖蓝球个位数为1、3、5、7、9为“单”，0、2、4、6、8为“双”",
		actived: false,
		oddsList: [
			{
				title: "大",
				desc: "开奖蓝球≥09为“大”",
				actived: false,
				optionCode: "大",
			},
			{
				title: "小",
				desc: "开奖蓝球≤08为“小”",
				actived: false,
				optionCode: "小",
			},
			{
				title: "单",
				desc: "开奖蓝球个位数为1、3、5、7、9为“单”",
				actived: false,
				optionCode: "单",
			},
			{
				title: "双",
				desc: "开奖蓝球个位数为0、2、4、6、8为“双”",
				actived: false,
				optionCode: "双",
			},
			{
				id: 1,
				type: "selectBall",
				title: "蓝球选号",
				// desc: "选择1个蓝球号码",
				actived: false,
				//特殊玩法标识 需要配置 gamePlayCode 用于匹配玩法，isSpecialPlay走特殊玩法逻辑
				gamePlayCode: "smp_lq_lqxh",
				isSpecialPlay: true,
				ballNum: 16,
			},
		],
	},
] as unknown as LotteryPlayGroup[];
