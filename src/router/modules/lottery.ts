const lotteryRoutes = {
	path: "/lottery",
	name: "Lottery",
	layout: true,
	component: () => import("/@/views/lottery/views/home/index.vue"),
	meta: {
		title: "彩票",
	},
};

export default lotteryRoutes;
