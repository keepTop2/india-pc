import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";
//引入首页路由
import frontPage from "./modules/frontPage";
// 错误页
import errorPage from "./modules/errorPage";

// 登录注册弹窗
const routes = [
	// 匹配不到重定向会主页
	{
		// 找不到路由重定向到login页面
		path: "/:",
		// redirect: ((to: any) => {
		// 	return { path: '/frontPage/home' }
		// })
		redirect: "/frontPage/home",
	},
	//登录
	// login,
	//首页模块路由
	frontPage,
	// 错误页
	errorPage,

	//效果实现页面demo
	{
		path: "/demo",
		name: "demo",
		component: () => import("/@/views/demo/demo.vue"),
		meta: {
			title: "demo",
			idx: 1,
		},
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
