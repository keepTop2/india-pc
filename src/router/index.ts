import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";
//引入首页路由
import frontPage from "./modules/frontPage";
// 错误页
import errorPage from "./modules/errorPage";

import layout from "../layout/layout.vue";

import userRoutes from "/@/router/modules/userMenu";
import sportsRoutes from "/@/router/modules/sports/sports";
// 登录注册弹窗
const routes = [
	//首页模块路由
	frontPage,
	// 错误页
	errorPage,
	{
		path: "/",
		component: layout,
		redirect: "/",
		children: [
			{
				path: "/",
				name: "home",
				layout: true,
				component: () => import("/@/views/home/index.vue"),
				meta: {
					title: "home",
					idx: 1,
				},
			},
			{
				path: "/user",
				name: "user",
				layout: true,
				meta: {
					title: "home",
					idx: 1,
				},
				children: [...userRoutes],
			},

			{
				path: "/sports",
				name: "sports",
				layout: true,
				meta: {
					title: "sports",
					idx: 1,
				},
				children: [...sportsRoutes],
			},
			// 用户相关路由页面

			{
				path: "/helpCenter",
				name: "helpCenter",
				layout: true,
				component: () => import("/@/views/helpCenter/index.vue"),
				meta: {
					title: "helpCenter",
					idx: 1,
				},
			},
			{
				path: "/demo",
				name: "demo",
				layout: true,
				component: () => import("/@/views/demo/demo.vue"),
				meta: {
					title: "demo",
					idx: 1,
				},
			},
		],
	},

	{
		path: "/:pathMatch(.*)",
		redirect: "/pageLoss",
	},
];

const router: Router = createRouter({
	history: createWebHashHistory("/"),
	routes: routes as any,
});

export default router;
