import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";
//引入首页路由
import frontPage from "./modules/frontPage";
//引入左侧菜单路由
import menu from "./modules/menu";

// 错误页
import errorPage from "./modules/errorPage";
//优惠详情
import discounts from "./modules/discounts";
// 帮助中心
import helpCenter from "./modules/helpCenter";
// 钱包
import wallet from "./modules/wallet";
import userDropDownRouter from "/@/router/modules/userDropDown";
// import login from './modules/login';
//路由过滤
import RouteFilter from "./modules/RouteFilter";
import childrenAppContainers from "/@/router/modules/childrenAppContainers";
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
	{
		name: "sports",
		path: "/sports",
		component: () => import("/@/views/tools/index.vue"),
		meta: {
			title: "工具集",
			keepAlive: false,
		},
	},
	{
		path: "/test",
		component: () => import("/@/views/test.vue"),
	},
	//子应用 容器路由
	childrenAppContainers,
	//登录
	// login,
	//首页模块路由
	frontPage,
	//左侧菜单路由
	menu,
	// 错误页
	errorPage,
	// 帮助中心
	helpCenter,
	// 钱包
	wallet,
	//
	userDropDownRouter,
	//优惠详情
	discounts,
	RouteFilter,
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
		path: "/svg/list",
		name: "svgList",
		component: () => import("/@/views/SvgList/SvgList.vue"),
	},
	{
		path: "/:pathMatch(.*)",
		redirect: "/pageLoss",
	},
	{
		path: "/:pathMatch(.*)*",
		redirect: "/pageLoss",
	},
	{
		path: "/:chatchAll(.*)",
		redirect: "/pageLoss",
	},
	//子应用demo
	{
		path: "/demoApp",
		component: () => import("/@/views/demoApp/demoApp.vue"),
	},
];

const router: Router = createRouter({
	history: createWebHashHistory("/"),
	routes: routes as any,
});

export default router;
