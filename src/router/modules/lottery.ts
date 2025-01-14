const lotteryRoutes = {
	path: "/lottery",
	name: "Lottery",
	layout: true,
	meta: {
		title: "彩票",
	},
	children: [
		{
			path: "/lottery/home",
			name: "LotteryHome",
			meta: { name: "LotteryHome", title: "彩票大厅" },
			component: () => import("/@/views/lottery/views/home/index.vue"),
		},
		{
			path: "/lottery/shishicai",
			name: "Shishicai",
			meta: { name: "Shishicai", title: "时时彩" },
			component: () => import("/@/views/lottery/views/category/shishicai/index.vue"),
		},

		{
			path: "/lottery/kuaisan",
			name: "Kuaisan",
			meta: { name: "Shishicai", title: "快三" },
			component: () => import("/@/views/lottery/views/category/kuaisan/index.vue"),
		},
		{
			path: "/lottery/lucky28",
			name: "Lucky28",
			meta: { name: "Lucky28", title: "幸运28" },
			component: () => import("/@/views/lottery/views/category/lucky28/index.vue"),
		},
		{
			path: "/lottery/elevenChooseFive",
			name: "ElevenChooseFive",
			meta: { name: "ElevenChooseFive", title: "11选5" },
			component: () => import("/@/views/lottery/views/category/elevenChooseFive/index.vue"),
		},
		{
			path: "/lottery/unionLotto",
			name: "UnionLotto",
			meta: { name: "UnionLotto", title: "双色球" },
			component: () => import("/@/views/lottery/views/category/unionLotto/index.vue"),
		},
		{
			path: "/lottery/pk10",
			name: "Pk10",
			meta: { name: "Pk10", title: "pk10" },
			component: () => import("/@/views/lottery/views/category/pk10/index.vue"),
		},
		{
			path: "/lottery/3D",
			name: "3D",
			meta: { name: "3D", title: "3D" },
			component: () => import("/@/views/lottery/views/category/3D/index.vue"),
		},
	],
};

export default lotteryRoutes;
