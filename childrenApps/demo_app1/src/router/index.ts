import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";

/**
 * @description idx大小判断路由左切动画还是右切动画
 */
const routes = [
	{
		path: "/:",
		redirect: "/test",
	},
	{
		path: "/demo1AAA",
		name: "demo1AAA",
		component: () => import("/@/views/demo1AAA/demo1AAA.vue"),
	},
	{
		path: "/demo1BBB",
		name: "demo1BBB",
		component: () => import("/@/views/demo1BBB/demo1BBB.vue"),
	},
	{
		path: "/test",
		name: "test",
		component: () => import("/@/views/test/index.vue"),
	},
];

const router: Router = createRouter({
	history: createWebHashHistory("/"),
	routes: routes,
} as any);

export default router;
