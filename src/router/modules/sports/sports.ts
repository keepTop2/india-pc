import sportsRouterLeft from "./sportsRouterLeft";
import menuRight from "./menuRight";
import Layout from "/@/views/sports/layout/layout.vue";
/**
 * @description tiyu
 */
const Sports = [
	{
		path: "/sports",
		name: "sports",
		component: Layout,
		redirect: "/sports/1",
		children: [...menuRight, ...sportsRouterLeft],
	},
];

export default Sports;
