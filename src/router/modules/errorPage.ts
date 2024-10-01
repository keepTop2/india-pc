// 错误页
const errorPage = {
	children: [
		{
			path: "/404",
			name: "404",
			component: () => import("/@/views/errorPage/404.vue"),
			meta: { title: "页面报错", idx: 1 },
		},
		{
			path: "/405",
			name: "405",
			component: () => import("/@/views/errorPage/404.vue"),
			meta: { title: "站点维护", idx: 1 },
		},
		{
			path: "/406",
			name: "406",
			component: () => import("/@/views/errorPage/404.vue"),
			meta: { title: "访问限制", idx: 1 },
		},
	],
};

export default errorPage;
