// // 1号布局
import layout from "/@/layout/layout.vue";
//首页
const frontPage = {
	path: "/frontPage",
	name: "frontPage",
	component: layout,
	redirect: "/frontPage/home",
	children: [
		// {
		// 	path: "home",
		// 	name: "home",
		// 	component: () => import("/@/views/frontPage/home/home.vue"),
		// 	meta: { title: "首页" },
		// },
	],
};
export default frontPage;
