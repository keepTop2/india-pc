const activityRoutes = [
	{
		path: "/activity",
		name: "activity",
		layout: true,
		component: () => import("/@/views/activity/index.vue"),
		meta: {
			title: "优惠活动",
			idx: 1,
			showFooter: true,
		},
	},
];

export default activityRoutes;
