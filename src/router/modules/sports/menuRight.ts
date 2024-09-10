import football from "/@/assets/zh-CN/sports/football.png";
import football_active from "/@/assets/zh-CN/sports/football_active.png";
import basketball from "/@/assets/zh-CN/sports/basketball.png";
import basketball_active from "/@/assets/zh-CN/sports/basketball_active.png";
import americanSoccer from "/@/assets/zh-CN/sports/americanSoccer.png";
import americanSoccer_active from "/@/assets/zh-CN/sports/americanSoccer_active.png";
import iceHockey from "/@/assets/zh-CN/sports/iceHockey.png";
import iceHockey_active from "/@/assets/zh-CN/sports/iceHockey_active.png";
import tennis from "/@/assets/zh-CN/sports/tennis.png";
import tennis_active from "/@/assets/zh-CN/sports/tennis_active.png";
import volleyball from "/@/assets/zh-CN/sports/volleyball.png";
import volleyball_active from "/@/assets/zh-CN/sports/volleyball_active.png";
import billiards from "/@/assets/zh-CN/sports/billiards.png";
import billiards_active from "/@/assets/zh-CN/sports/billiards_active.png";
import baseball from "/@/assets/zh-CN/sports/baseball.png";
import baseball_active from "/@/assets/zh-CN/sports/baseball_active.png";
import badminton from "/@/assets/zh-CN/sports/badminton.png";
import badminton_active from "/@/assets/zh-CN/sports/badminton_active.png";
import eSports from "/@/assets/zh-CN/sports/eSports.png";
import eSports_active from "/@/assets/zh-CN/sports/eSports_active.png";

const menuRight = [
	{
		path: "/sports/1",
		name: "football",
		redirect: "/sports/1/list",
		meta: {
			title: "足球",
			isServer: false,
			icon: football,
			iconActive: football_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/1/list",
				name: "football_list",
				component: () => import("/@/views/sports/views/football/football.vue"),
				meta: {
					title: "足球",
					icon: football,
					iconActive: football_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/1/detail",
				name: "football_detail",
				component: () => import("/@/views/sports/views/football/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: football,
					iconActive: football_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/1/sportsLeagueSearch",
				name: "football_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: football,
					iconActive: football_active,
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
			icon: basketball,
			iconActive: basketball_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/2/list",
				name: "basketball_list",
				component: () => import("/@/views/sports/views/basketball/basketball.vue"),
				meta: {
					title: "篮球",
					icon: basketball,
					iconActive: basketball_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/2/detail",
				name: "basketball_detail",
				component: () => import("/@/views/sports/views/basketball/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: basketball,
					iconActive: basketball_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/2/sportsLeagueSearch",
				name: "basketball_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: basketball,
					iconActive: basketball_active,
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
			icon: americanSoccer,
			iconActive: americanSoccer_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/3/list",
				name: "americanSoccer_list",
				component: () => import("/@/views/sports/views/americanSoccer/americanSoccer.vue"),
				meta: {
					title: "美式足球",
					icon: americanSoccer,
					iconActive: americanSoccer_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/3/detail",
				name: "americanSoccer_detail",
				component: () => import("/@/views/sports/views/americanSoccer/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: americanSoccer,
					iconActive: americanSoccer_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/3/sportsLeagueSearch",
				name: "americanSoccer_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: americanSoccer,
					iconActive: americanSoccer_active,
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
			icon: iceHockey,
			iconActive: iceHockey_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/4/list",
				name: "iceHockey_list",
				component: () => import("/@/views/sports/views/iceHockey/iceHockey.vue"),
				meta: {
					title: "冰上曲棍球",
					icon: iceHockey,
					iconActive: iceHockey_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/4/detail",
				name: "iceHockey_detail",
				component: () => import("/@/views/sports/views/iceHockey/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: iceHockey,
					iconActive: iceHockey_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/4/sportsLeagueSearch",
				name: "iceHockey_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: iceHockey,
					iconActive: iceHockey_active,
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
			icon: tennis,
			iconActive: tennis_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/5/list",
				name: "tennis_list",
				component: () => import("/@/views/sports/views/tennis/tennis.vue"),
				meta: {
					title: "网球",
					icon: tennis,
					iconActive: tennis_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/5/detail",
				name: "tennis_detail",
				component: () => import("/@/views/sports/views/tennis/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: tennis,
					iconActive: tennis_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/5/sportsLeagueSearch",
				name: "tennis_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: tennis,
					iconActive: tennis_active,
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
			icon: volleyball,
			iconActive: volleyball_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/6/list",
				name: "volleyball_list",
				component: () => import("/@/views/sports/views/volleyball/volleyball.vue"),
				meta: {
					title: "排球",
					icon: volleyball,
					iconActive: volleyball_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/6/detail",
				name: "volleyball_detail",
				component: () => import("/@/views/sports/views/volleyball/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: volleyball,
					iconActive: volleyball_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/6/sportsLeagueSearch",
				name: "volleyball_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: volleyball,
					iconActive: volleyball_active,
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
			icon: billiards,
			iconActive: billiards_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/7/list",
				name: "billiards_list",
				component: () => import("/@/views/sports/views/billiards/billiards.vue"),
				meta: {
					title: "斯诺克/台球",
					icon: billiards,
					iconActive: billiards_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/7/detail",
				name: "billiards_detail",
				component: () => import("/@/views/sports/views/billiards/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: billiards,
					iconActive: billiards_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/7/sportsLeagueSearch",
				name: "billiards_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: billiards,
					iconActive: billiards_active,
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
			icon: baseball,
			iconActive: baseball_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/8/list",
				name: "baseball_list",
				component: () => import("/@/views/sports/views/baseball/baseball.vue"),
				meta: {
					title: "棒球",
					icon: baseball,
					iconActive: baseball_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/8/detail",
				name: "baseball_detail",
				component: () => import("/@/views/sports/views/baseball/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: baseball,
					iconActive: baseball_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/8/sportsLeagueSearch",
				name: "baseball_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: baseball,
					iconActive: baseball_active,
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
			icon: badminton,
			iconActive: badminton_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/9/list",
				name: "badminton_list",
				component: () => import("/@/views/sports/views/badminton/badminton.vue"),
				meta: {
					title: "羽毛球",
					icon: badminton,
					iconActive: badminton_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/9/detail",
				name: "badminton_detail",
				component: () => import("/@/views/sports/views/badminton/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: badminton,
					iconActive: badminton_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/9/sportsLeagueSearch",
				name: "badminton_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: badminton,
					iconActive: badminton_active,
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
			icon: eSports,
			iconActive: eSports_active,
			isSportSort: true,
			isHide: false,
		},
		children: [
			{
				path: "/sports/43/list",
				name: "eSports_list",
				component: () => import("/@/views/sports/views/eSports/eSports.vue"),
				meta: {
					title: "电子竞技",
					icon: eSports,
					iconActive: eSports_active,
					isHide: false,
					isServer: false,
				},
			},
			{
				path: "/sports/43/detail",
				name: "eSports_detail",
				component: () => import("/@/views/sports/views/eSports/detail/detail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					icon: eSports,
					iconActive: eSports_active,
					isSportSort: false,
					isHide: false,
				},
			},
			{
				path: "/sports/43/sportsLeagueSearch",
				name: "eSports_sportsLeagueSearch",
				component: () => import("/@/views/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
				meta: {
					title: "联赛搜索",
					isServer: false,
					icon: eSports,
					iconActive: eSports_active,
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
];

export default menuRight;
