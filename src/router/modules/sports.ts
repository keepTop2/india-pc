export default [
	{
		path: "/",
		name: "sports",
		layout: true,
		component: () => import("/@/views/sports/index.vue"),
		meta: {
			title: "",
			idx: 1,
		},
	},
];
