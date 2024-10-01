const MajorCategoriesMenu = [
	{
		path: "/sports/collect",
		name: "sportsCollect",
		icon: "collection",
		component: () => import("/@/views/sports/views/collect/collect.vue"),
		meta: { title: "收藏", type: "collect" },
	},
	{
		path: "/sports/betRecord",
		name: "sportsBetRecord",
		icon: "betRecord",
		component: () => import("/@/views/sports/views/betRecord/betRecord.vue"),
		meta: { title: "注单", type: "betRecord" },
	},
	{
		path: "/sports/results",
		name: "sportsResults",
		icon: "amidithion",
		component: () => import("/@/views/sports/views/results/results.vue"),
		meta: { title: "赛果", type: "result" },
	},
];

export default MajorCategoriesMenu;
