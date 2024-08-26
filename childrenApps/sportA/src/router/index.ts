import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";
import Sports from "./sports/sports";

const routes = [
	// 匹配不到重定向会主页
	{
		// 找不到路由重定向到login页面
		path: "/:",
		redirect: "/sports",
	},
	//默认预加载页面
	{
		path: "/preFetchSportAView",
		name: "preFetchSportAView",
		meta: { title: "预加载页面" },
		component: () => import("/@/views/preFetchSportAView/preFetchSportAView.vue"),
	},
	Sports,
];

const router: Router = createRouter({
	history: createWebHashHistory("/"),
	routes: routes as any,
});

export default router;
