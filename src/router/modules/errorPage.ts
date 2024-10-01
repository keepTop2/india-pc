// 错误页
const errorPage = [
	{
		path: "/404",
		name: "404",
		component: () => import("/@/views/errorPage/404.vue"),
		meta: { title: "页面报错", idx: 1 },
	},
	{
		path: "/maintain",
		name: "maintain",
		component: () => import("/@/views/errorPage/maintain.vue"),
		meta: { title: "站点维护", idx: 1 },
	},
	{
		path: "/block",
		name: "block",
		component: () => import("/@/views/errorPage/block.vue"),
		meta: { title: "访问限制", idx: 1 },
	},
];
export default errorPage;
