import { createRouter, createWebHashHistory, createWebHistory, Router } from "vue-router";

const routes = [
	{
		path: "/:",
		redirect: "/demo2C",
	},
	{
		path: "/demo2C",
		name: "demo2C",
		component: () => import("/@/views/demo2C/demo2C.vue"),
	},
	{
		path: "/demo2d",
		name: "demo2d",
		component: () => import("/@/views/demo2d/demo2d.vue"),
	},
];

const router: Router = createRouter({
	history: createWebHashHistory("/"),
	routes: routes as any,
});

export default router;
