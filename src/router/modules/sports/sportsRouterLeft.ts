const MajorCategoriesMenu = [
	{
		path: "/sports/collect",
		name: "sportsCollect",
		component: () => import("/@/views/sports/views/collect/collect.vue"),
		meta: { title: "收藏" },
	},
	{
		path: "/sports/betRecord",
		name: "sportsBetRecord",
		component: () => import("/@/views/sports/views/betRecord/betRecord.vue"),
		meta: { title: "注单" },
	},
	{
		path: "/sports/results",
		name: "sportsResults",
		component: () => import("/@/views/sports/views/results/results.vue"),
		meta: { title: "赛果" },
	},
];

export default MajorCategoriesMenu;
