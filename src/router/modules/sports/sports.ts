import Layout from "/@/views/sports/layout/layout.vue";
import sportsRouterLeft from "./sportsRouterLeft";
import menuRight from "./menuRight";
/**
 * @description tiyu
 */
const Sports = {
	path: "/sports",
	name: "sports",
	component: Layout,
	redirect: "/sports/1",
	children: [...menuRight, ...sportsRouterLeft],
};

export default Sports;
