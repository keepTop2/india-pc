import sportsRouterLeft from "./sportsRouterLeft";
import menuRight from "./menuRight";
/**
 * @description tiyu
 */
const Sports = [
	{
		path: "/sports",
		name: "sports",
		component: () => import("/@/views/sports/layout/layout.vue"),
		redirect: "/sports/1",
		children: [...menuRight, ...sportsRouterLeft],
	},
];

export default Sports;
