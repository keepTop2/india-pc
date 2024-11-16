import { LotteryPlayGroup } from "/@/views/lottery/types/lottery";
import { i18n } from "/@/i18n/index";
import { SELECT_BALL } from "/@/views/lottery/constant";
const $: any = i18n.global;
/**
 * @description 双色球 静态玩法配置
 * @author Hida
 * @description 特殊玩法 需要配置 gamePlayCode 用于匹配玩法，isSpecialPlay走特殊玩法逻辑 对应数据会直接返回不做投注项处理
 */
export const gameplayList: LotteryPlayGroup[] = [
	{
		id: "1",
		gamePlayName: $.t("lottery.红球"),
		gamePlayCodes: ["smp_hq_sm_dxd", "smp_hq_sm_dsd", "smp_hq_rx1"],
		desc: $.t("lottery.红球玩法说明"),
		actived: false,
		oddsList: [
			{
				title: $.t("lottery.大多"),
				desc: $.t("lottery.大多描述"),
				actived: false,
				optionCode: "大多",
			},
			{
				title: $.t("lottery.小多"),
				desc: $.t("lottery.小多描述"),
				actived: false,
				optionCode: "小多",
			},
			{
				title: $.t("lottery.大小和"),
				desc: $.t("lottery.大小和描述"),
				actived: false,
				optionCode: "和",
			},
			{
				title: $.t("lottery.单多"),
				desc: $.t("lottery.单多描述"),
				actived: false,
				optionCode: "单多",
			},
			{
				title: $.t("lottery.双多"),
				desc: $.t("lottery.双多描述"),
				actived: false,
				optionCode: "双多",
			},
			{
				title: $.t("lottery.单双和"),
				desc: $.t("lottery.单双和描述"),
				actived: false,
				optionCode: "和",
			},
			// {
			// 	iconType:'2',
			// 	type: "selectBall",
			// 	title: $.t("lottery.选择球"),
			// 	actived: false,
			// 	gamePlayCode: "smp_hq_rx1",
			// 	isSpecialPlay: true,
			// },
			{
				// type: "selectBall",
				iconType:'2',
				title: $.t("lottery.选择球"),
				actived: false,
				// gamePlayCode: "smp_hq_rx1",
				isSpecialPlay: true,
				ballNum: 33,
				startIndex: 1,
				optionCode: "01",
				type: SELECT_BALL,
			},
		],
	},
	{
		id: "2",
		gamePlayName: "蓝球",
		gamePlayCodes: ["smp_lq_sm", "smp_lq_lqxh"],
		desc: $.t("lottery.蓝球玩法说明"),
		actived: false,
		oddsList: [
			{
				title: $.t("lottery.大"),
				desc: $.t("lottery.大描述"),
				actived: false,
				optionCode: "大",
			},
			{
				title: $.t("lottery.小"),
				desc: $.t("lottery.小描述"),
				actived: false,
				optionCode: "小",
			},
			{
				title: $.t("lottery.单"),
				desc: $.t("lottery.单描述"),
				actived: false,
				optionCode: "单",
			},
			{
				title: $.t("lottery.双"),
				desc: $.t("lottery.双描述"),
				actived: false,
				optionCode: "双",
			},
			// {
			// 	iconType:'1',
			// 	type: "selectBall",
			// 	title: $.t("lottery.蓝球选号"),
			// 	actived: false,
			// 	gamePlayCode: "smp_lq_lqxh",
			// 	isSpecialPlay: true,
			// 	ballNum: 16,
			// },
			{
				// type: "selectBall",
				iconType:'1',
				title: $.t("lottery.选择球"),
				actived: false,
				// gamePlayCode: "smp_lq_lqxh",
				// isSpecialPlay: true,
				ballNum: 16,
				startIndex: 1,
				optionCode: "01",
				type: SELECT_BALL,
			},
		],
	},
] as unknown as LotteryPlayGroup[];
