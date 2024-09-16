import { computed } from "vue";
import Layout from "/@/views/sports/layout/layout.vue";
import sportsRouterLeft from "../sports/sportsRouterLeft";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";

// 封装处理 sportType 的通用函数
const handleSportTypeRedirect = async (to, from, next) => {
	const sportsData = computed(() => viewSportPubSubEventData.viewSportData.sports);
	if (sportsData.value.length > 0) {
		if (from.query.sportType) {
			// 从来源路由中获取 sportType
			const sportType = from.query.sportType;
			if (to.query.sportType !== sportType) {
				next({
					...to,
					query: { ...to.query, sportType },
				});
			} else {
				next();
			}
		}
	} else {
		if (!to.query.sportType || to.query.sportType !== "1") {
			if (to.query.sportType !== "1") {
				next({
					...to,
					query: { ...to.query, sportType: "1" },
				});
			} else {
				next();
			}
		} else {
			next();
		}
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
				meta: { title: "今日", name: "todayContest" },
				redirect: "/sports/todayContest/rollingBall",
				children: [
					{
						path: "/sports/todayContest/rollingBall",
						name: "todayContestRollingBall",
						component: () => import("/@/views/sports/views/todayContest/rollingBall/rollingBall.vue"),
						meta: { title: "滚球比赛" },
						beforeEnter: (to, from, next) => handleSportTypeRedirect(to, from, next),
					},
					{
						path: "/sports/todayContest/notStarted",
						name: "todayContestNotStarted",
						component: () => import("/@/views/sports/views/todayContest/notStarted/notStarted.vue"),
						meta: { title: "未开赛比赛" },
						beforeEnter: (to, from, next) => handleSportTypeRedirect(to, from, next),
					},
				],
			},
			{
				path: "/sports/morningTrading",
				name: "morningTradingList",
				meta: { name: "morningTrading", title: "早盘" },
				component: () => import("/@/views/sports/views/morningTrading/morningTrading.vue"),
				beforeEnter: (to, from, next) => handleSportTypeRedirect(to, from, next),
			},
			{
				path: "/sports/champion",
				name: "championList",
				meta: { name: "champion", title: "冠军" },
				component: () => import("/@/views/sports/views/champion/champion.vue"),
				beforeEnter: (to, from, next) => handleSportTypeRedirect(to, from, next),
			},
			{
				path: "/sports/:sportType/detail",
				name: "event_detail",
				component: () => import("/@/views/sports/views/eventDetail/eventDetail.vue"),
				meta: {
					title: "赛事详细",
				},
			},
			{
				path: "/sports/:sportType/detail",
				name: "event_detail",
				component: () => import("/@/views/sports/views/eventDetail/eventDetail.vue"),
				meta: {
					title: "赛事详细",
				},
			},
		],
	},
];

export default Sports;
