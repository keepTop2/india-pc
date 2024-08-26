// 子应用大页面 容器
const childrenAppContainers = {
	path: "/childrenAppContainers",
	redirect: "/childrenAppContainers/sportAContainer",
	children: [
		{
			path: "/childrenAppContainers/sportAContainer",
			name: "sportAContainer",
			component: () => import("/@/views/childrenAppContainers/sportAContainer.vue"),
			meta: { title: "体育A子应用容器", idx: 1 },
		},
	],
};

export default childrenAppContainers;
