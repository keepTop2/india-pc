import { createRouter, createWebHashHistory, Router } from "vue-router";
//引入首页路由
import frontPage from "./modules/frontPage";
// 错误页
import errorPage from "./modules/errorPage";

import layout from "../layout/layout.vue";

import userRoutes from "/@/router/modules/userMenu";
import activityRoutes from "/@/router/modules/activity";
import sportsRoutes from "/@/router/modules/sports/sports";

import walletLayout from "/@/router/modules/wallet";
import lotteryRoutes from "/@/router/modules/lottery";

const routes = [
	{
		path: "/",
		component: layout,
		name: "layout",
		children: [
			{
				path: "/",
				name: "home",
				component: () => import("/@/views/home/index.vue"),
				meta: {
					title: "home",
					showFooter: true,
				},
			},
			{
				path: "/user",
				name: "user",
				meta: {
					title: "user",
				},
				children: [
					...userRoutes,
					{
						path: "vipBenefits",
						name: "vipBenefits",
						component: () => import("/@/views/user/vip/vipBenefits/index.vue"),
						meta: {
							title: "vipBenefits",
							showFooter: true,
						},
					},
					{
						path: "/user/feedback/feedbackList",
						name: "feedbackList",
						component: () => import("/@/views/user/feedback/feedbackList.vue"),
						meta: {
							title: "feedbackList",
						},
					},
					{
						path: "/user/feedback/feedbackDetails",
						name: "feedbackDetails",
						component: () => import("/@/views/user/feedback/feedbackDetails.vue"),
						meta: {
							title: "feedbackDetails",
						},
					},
				],
			},
			{
				path: "/activity",
				name: "activity",
				meta: {
					title: "activity",
				},
				component: () => import("/@/views/activity/index.vue"),
			},
			{
				path: "/game",
				name: "game",
				redirect: "/game/gamepage",
				meta: {
					title: "game",
				},

				children: [
					{
						path: "gamepage",
						name: "gamepage",
						component: () => import("/@/views/game/gamePage.vue"),
						meta: {
							title: "gamepage",
						},
					},
					{
						path: "venue",
						name: "venue",
						component: () => import("/@/views/game/venue.vue"),
						meta: {
							title: "venue",
							showFooter: true,
						},
					},
				],
			},
			...sportsRoutes,
			// 用户相关路由页面

			{
				path: "/helpCenter",
				name: "helpCenter",
				component: () => import("/@/views/helpCenter/index.vue"),
				meta: {
					title: "helpCenter",
				},
			},
			{
				path: "/userAgreement",
				name: "userAgreement",
				component: () => import("/@/views/userAgreement/index.vue"),
				meta: {
					title: "userAgreement",
				},
			},
			{
				path: "/demo",
				name: "demo",
				component: () => import("/@/views/demo/demo.vue"),
				meta: {
					title: "demo",
					idx: 1,
				},
			},
			//钱包路由
			walletLayout,
			// 彩票
			lotteryRoutes,
		],
	},

	...errorPage,
	{
		path: "/:pathMatch(.*)",
		redirect: "/404",
	},
];

const router: Router = createRouter({
	history: createWebHashHistory(),
	routes: routes as any,
	scrollBehavior(to, from, savedPosition) {
		// 如果有保存的滚动位置（比如返回前进浏览器时）
		if (savedPosition) {
			return savedPosition;
		} else if (from.meta.scrollTop !== undefined) {
			// 在体育模块导航栏headerMenuNav、headerMenuCondition组件中记录了scrollTop
			const scrollDom = document.querySelector(".mainArea");
			if (scrollDom) {
				scrollDom.scrollTop = from.meta.scrollTop as number;
				delete from.meta.scrollTop;
			}
		} else {
			// 记录自定义的滚动行为，跳转到指定位置
			return { top: 0 };
		}
	},
});
router.beforeEach(async (to, from) => {
	document.querySelector(".mainArea")?.scrollTo({ top: 0 });
});
export default router;
