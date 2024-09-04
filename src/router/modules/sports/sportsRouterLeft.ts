/*
 * @Author: WangMingxin
 * @Description: 体育-顶部-功能左侧菜单
 */
const BaseEventDetailMate = {
	title: "赛事详细",
	isServer: false,
	iconCode: "ty_icon_zq",
	isSportSort: false,
	isHide: false,
};

const sportsRouterLeft = [
	{
		path: "/sports/collect",
		name: "sportsCollect",
		component: () => import("/@/views/sports/views/collect/collect.vue"),
		meta: {
			title: "关注",
			isServer: false,
			iconCode: "ty_icon_sc",
		},
		children: [
			{
				path: "/sports/collect/1",
				name: "collect_football_detail",
				component: () => import("/@/views/sports/views/football/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/2",
				name: "collect_basketball_detail",
				component: () => import("/@/views/sports/views/basketball/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/3",
				name: "collect_americanSoccer_detail",
				component: () => import("/@/views/sports/views/americanSoccer/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/4",
				name: "collect_iceHockey_detail",
				component: () => import("/@/views/sports/views/iceHockey/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/5",
				name: "collect_tennis_detail",
				component: () => import("/@/views/sports/views/tennis/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/6",
				name: "collect_volleyball_detail",
				component: () => import("/@/views/sports/views/volleyball/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/7",
				name: "collect_billiards_detail",
				component: () => import("/@/views/sports/views/billiards/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/8",
				name: "collect_baseball_detail",
				component: () => import("/@/views/sports/views/baseball/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/9",
				name: "collect_badminton_detail",
				component: () => import("/@/views/sports/views/badminton/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
			{
				path: "/sports/collect/43",
				name: "collect_eSports_detail",
				component: () => import("/@/views/sports/views/eSports/detail/detail.vue"),
				meta: BaseEventDetailMate,
			},
		],
	},
	{
		path: "/sports/betRecord",
		name: "sportsBetRecord",
		component: () => import("/@/views/sports/views/betRecord/betRecord.vue"),
		meta: {
			title: "注单记录",
			isServer: false,
			iconCode: "ty_icon_jl",
		},
	},
	{
		path: "/sports/results",
		name: "sportsResults",
		component: () => import("/@/views/sports/views/results/results.vue"),
		meta: {
			title: "赛果",
			isServer: false,
			iconCode: "ty_icon_bf",
		},
	},
	{
		path: "/sports/bettingRules",
		name: "sportsBettingRules",
		component: () => import("/@/views/sports/views/bettingRules/bettingRules.vue"),
		meta: {
			title: "竞猜规则",
			isServer: false,
			iconCode: "ty_icon_gz",
		},
		redirect: "/sports/bettingRules/generalSportsInstructions",
		children: [
			{
				path: "/sports/bettingRules/generalSportsInstructions",
				name: "generalSportsInstructions",
				component: () => import("/@/views/sports/views/bettingRules/generalSportsInstructions/generalSportsInstructions.vue"),
				meta: { title: "一般体育说明" },
			},
			{
				path: "/sports/bettingRules/championDescription",
				name: "championDescription",
				component: () => import("/@/views/sports/views/bettingRules/championDescription/championDescription.vue"),
				meta: { title: "冠军说明" },
			},
			{
				path: "/sports/bettingRules/pass",
				name: "pass",
				component: () => import("/@/views/sports/views/bettingRules/pass/pass.vue"),
				meta: {
					title: "连串过关/复式过关/组合过关",
				},
			},
			{
				path: "/sports/bettingRules/winAndRules",
				name: "winAndRules",
				component: () => import("/@/views/sports/views/bettingRules/winAndRules/winAndRules.vue"),
				meta: { title: "独赢及规则" },
			},
			{
				path: "/sports/bettingRules/advanceSettlementRules",
				name: "advanceSettlementRules",
				component: () => import("/@/views/sports/views/bettingRules/advanceSettlementRules/advanceSettlementRules.vue"),
				meta: { title: "提前结算规则" },
			},
			// {
			// 	path: "/sports/bettingRules/bookingBettingRules",
			// 	name: "bookingBettingRules",
			// 	component: () => import("/@/views/sports/views/bettingRules/bookingBettingRules/bookingBettingRules.vue"),
			// 	meta: { title: "预约投注规则" },
			// },
			{
				path: "/sports/bettingRules/football",
				name: "bettingRulesFootball",
				component: () => import("/@/views/sports/views/bettingRules/ball/football.vue"),
				meta: { title: "足球" },
			},
			{
				path: "/sports/bettingRules/basketball",
				name: "bettingRulesBasketball",
				component: () => import("/@/views/sports/views/bettingRules/ball/basketball.vue"),
				meta: { title: "篮球" },
			},
			{
				path: "/sports/bettingRules/americanSoccer",
				name: "bettingRulesAmericanSoccer",
				component: () => import("/@/views/sports/views/bettingRules/ball/americanSoccer.vue"),
				meta: { title: "美式足球" },
			},
			{
				path: "/sports/bettingRules/iceHockey",
				name: "bettingRulesIceHockey",
				component: () => import("/@/views/sports/views/bettingRules/ball/iceHockey.vue"),
				meta: { title: "冰球" },
			},
			{
				path: "/sports/bettingRules/tennis",
				name: "bettingRulesTennis",
				component: () => import("/@/views/sports/views/bettingRules/ball/tennis.vue"),
				meta: { title: "网球" },
			},
			{
				path: "/sports/bettingRules/volleyball",
				name: "bettingRulesVolleyball",
				component: () => import("/@/views/sports/views/bettingRules/ball/volleyball.vue"),
				meta: { title: "排球" },
			},
			{
				path: "/sports/bettingRules/billiards",
				name: "bettingRulesBilliardsr",
				component: () => import("/@/views/sports/views/bettingRules/ball/billiards.vue"),
				meta: { title: "斯诺克" },
			},
			{
				path: "/sports/bettingRules/baseball",
				name: "bettingRulesTableBaseball",
				component: () => import("/@/views/sports/views/bettingRules/ball/baseball.vue"),
				meta: { title: "棒球" },
			},
			{
				path: "/sports/bettingRules/badminton",
				name: "bettingRulesBadminton",
				component: () => import("/@/views/sports/views/bettingRules/ball/badminton.vue"),
				meta: { title: "羽毛球" },
			},
			{
				path: "/sports/bettingRules/eSports",
				name: "bettingRulesESports",
				component: () => import("/@/views/sports/views/bettingRules/ball/eSports.vue"),
				meta: { title: "电子竞技" },
			},
		],
	},
];

export default sportsRouterLeft;
