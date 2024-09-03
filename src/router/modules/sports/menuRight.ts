/*
 * @Author: WangMingxin
 * @Description: 体育右侧路由路由-静态结构
 */

const menuRight = [
	{
		path: "/sports/1",
		name: "football",
		redirect: "/sports/1/list",
		meta: {
			title: "足球",
			isServer: false,
			iconCode: "ty_icon_zq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/1/list",
				name: "football_list",
				component: () => import("/@/views/football/football.vue"),
				meta: {
					title: "足球",
					iconCode: "ty_icon_zq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/1/detail",
				name: "football_detail",
				component: () => import("/@/views/football/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_zq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/1/sportsLeagueSearch",
				name: "football_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_zq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	/**篮球 */
	{
		path: "/sports/2",
		name: "basketball",
		redirect: "/sports/2/list",
		meta: {
			title: "篮球",
			isServer: false,
			iconCode: "ty_icon_lq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/2/list",
				name: "basketball_list",
				component: () => import("/@/views/basketball/basketball.vue"),
				meta: {
					title: "篮球",
					iconCode: "ty_icon_lq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/2/detail",
				name: "basketball_detail",
				component: () => import("/@/views/basketball/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_lq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/2/sportsLeagueSearch",
				name: "basketball_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_lq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/3",
		name: "americanSoccer",
		redirect: "/sports/3/list",
		meta: {
			title: "美式足球",
			isServer: false,
			iconCode: "ty_icon_mszq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/3/list",
				name: "americanSoccer_list",
				component: () => import("/@/views/americanSoccer/americanSoccer.vue"),
				meta: {
					title: "美式足球",
					iconCode: "ty_icon_mszq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/3/detail",
				name: "americanSoccer_detail",
				component: () => import("/@/views/americanSoccer/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_mszq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/3/sportsLeagueSearch",
				name: "americanSoccer_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_mszq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/4",
		name: "iceHockey",
		redirect: "/sports/4/list",
		meta: {
			title: "冰上曲棍球",
			isServer: false,
			iconCode: "ty_icon_bsqgq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/4/list",
				name: "iceHockey_list",
				component: () => import("/@/views/iceHockey/iceHockey.vue"),
				meta: {
					title: "冰上曲棍球",
					iconCode: "ty_icon_bsqgq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/4/detail",
				name: "iceHockey_detail",
				component: () => import("/@/views/iceHockey/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_bsqgq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/4/sportsLeagueSearch",
				name: "iceHockey_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_bsqgq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/5",
		name: "tennis",
		redirect: "/sports/5/list",
		meta: {
			title: "网球",
			isServer: false,
			iconCode: "ty_icon_wq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/5/list",
				name: "tennis_list",
				component: () => import("/@/views/tennis/tennis.vue"),
				meta: {
					title: "网球",
					iconCode: "ty_icon_wq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/5/detail",
				name: "tennis_detail",
				component: () => import("/@/views/tennis/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_wq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/5/sportsLeagueSearch",
				name: "tennis_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_wq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/6",
		name: "volleyball",
		redirect: "/sports/6/list",
		meta: {
			title: "排球",
			isServer: false,
			iconCode: "ty_icon_pq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/6/list",
				name: "volleyball_list",
				component: () => import("/@/views/volleyball/volleyball.vue"),
				meta: {
					title: "排球",
					iconCode: "ty_icon_pq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/6/detail",
				name: "volleyball_detail",
				component: () => import("/@/views/volleyball/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_pq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/6/sportsLeagueSearch",
				name: "volleyball_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_pq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/7",
		name: "billiards",
		redirect: "/sports/7/list",
		meta: {
			title: "斯诺克/台球",
			isServer: false,
			iconCode: "ty_icon_snk",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/7/list",
				name: "billiards_list",
				component: () => import("/@/views/billiards/billiards.vue"),
				meta: {
					title: "斯诺克/台球",
					iconCode: "ty_icon_snk",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/7/detail",
				name: "billiards_detail",
				component: () => import("/@/views/billiards/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_snk",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/7/sportsLeagueSearch",
				name: "billiards_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_snk",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/8",
		name: "baseball",
		redirect: "/sports/8/list",
		meta: {
			title: "棒球",
			isServer: false,
			iconCode: "ty_icon_bangq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/8/list",
				name: "baseball_list",
				component: () => import("/@/views/baseball/baseball.vue"),
				meta: {
					title: "棒球",
					iconCode: "ty_icon_bangq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/8/detail",
				name: "baseball_detail",
				component: () => import("/@/views/baseball/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_bangq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/8/sportsLeagueSearch",
				name: "baseball_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_bangq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
	{
		path: "/sports/9",
		name: "badminton",
		redirect: "/sports/9/list",
		meta: {
			title: "羽毛球",
			isServer: false,
			iconCode: "ty_icon_ymq",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/9/list",
				name: "badminton_list",
				component: () => import("/@/views/badminton/badminton.vue"),
				meta: {
					title: "羽毛球",
					iconCode: "ty_icon_ymq",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/9/detail",
				name: "badminton_detail",
				component: () => import("/@/views/badminton/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_ymq",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/9/sportsLeagueSearch",
				name: "badminton_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_ymq",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},

	{
		path: "/sports/43",
		name: "eSports",
		redirect: "/sports/43/list",
		meta: {
			title: "电子竞技",
			isServer: false,
			iconCode: "ty_icon_dzjj",
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/43/list",
				name: "eSports_list",
				component: () => import("/@/views/eSports/eSports.vue"),
				meta: {
					title: "电子竞技",
					iconCode: "ty_icon_dzjj",
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/43/detail",
				name: "eSports_detail",
				component: () => import("/@/views/eSports/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					iconCode: "ty_icon_dzjj",
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/43/sportsLeagueSearch",
				name: "eSports_sportsLeagueSearch",
				component: () => import("/@/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					iconCode: "ty_icon_dzjj",
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
];

export default menuRight;
