import { createRouter, createWebHashHistory, createWebHistory, onBeforeRouteLeave, Router } from "vue-router";
//引入首页路由
import frontPage from "./modules/frontPage";
// 错误页
import errorPage from "./modules/errorPage";

import layout from "../layout/layout.vue";

import userRoutes from "/@/router/modules/userMenu";
import activityRoutes from "/@/router/modules/activity";
import sportsRoutes from "/@/router/modules/sports/sports";

import walletLayout from "/@/router/modules/wallet";
// 登录注册弹窗
const routes = [
	//首页模块路由
	frontPage,
	// 错误页

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
					idx: 1,
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
});
router.beforeEach(async (to, from) => {
	document.querySelector(".mainArea")?.scrollTo({ top: 0 });
});
export default router;
