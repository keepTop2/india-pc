import { computed } from "vue";
import Layout from "/@/views/sports/layout/layout.vue";
import sportsRouterLeft from "../sports/sportsRouterLeft";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { RouteLocationNormalized } from "vue-router";

// 封装处理 sportType 的通用函数
const handleSportTypeRedirect = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
	const sportsData = computed(() => viewSportPubSubEventData.viewSportData.sports);
	const sportType = to.query.sportType || from.query.sportType || "1";
	// console.log(to, "========to", from, "=========from");
	if (!to.query.sportType) {
		next({
			...to,
			query: { ...to.query, sportType },
		});
	} else {
		next();
	}
};
const Sports = [
	{
		path: "/sports",
		name: "sports",
		component: Layout,
		redirect: "/sports/todayContest/rollingBall",
		children: [
			// 大类菜单
			...sportsRouterLeft,
			{
				path: "/sports/todayContest",
				name: "todayContestList",
				meta: { title: "今日", name: "todayContest", type: "list", showHotSwitch: true },
				redirect: "/sports/todayContest/rollingBall",
				children: [
					{
						path: "/sports/todayContest/rollingBall",
						name: "todayContestRollingBall",
						component: () => import("/@/views/sports/views/todayContest/rollingBall/rollingBall.vue"),
						meta: { title: "滚球比赛", type: "list", showHotSwitch: true },
						beforeEnter: handleSportTypeRedirect,
					},
					{
						path: "/sports/todayContest/notStarted",
						name: "todayContestNotStarted",
						component: () => import("/@/views/sports/views/todayContest/notStarted/notStarted.vue"),
						meta: { title: "未开赛比赛", type: "list", showHotSwitch: true },
						beforeEnter: handleSportTypeRedirect,
					},
				],
			},
			{
				path: "/sports/morningTrading",
				name: "morningTradingList",
				meta: { name: "morningTrading", title: "早盘", type: "list", showHotSwitch: true },
				component: () => import("/@/views/sports/views/morningTrading/morningTrading.vue"),
				beforeEnter: handleSportTypeRedirect,
			},
			{
				path: "/sports/champion",
				name: "championList",
				meta: { name: "champion", title: "冠军", type: "list" },
				component: () => import("/@/views/sports/views/champion/champion.vue"),
				beforeEnter: handleSportTypeRedirect,
			},
			{
				path: "/sports/detail",
				name: "eventDetail",
				component: () => import("/@/views/sports/views/eventDetail/eventDetail.vue"),
				meta: {
					title: "赛事详细",
					type: "detail",
				},
			},
		],
	},
];

export default Sports;
