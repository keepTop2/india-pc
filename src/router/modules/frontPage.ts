// // 1号布局
import layout1 from "/@/layout/layout1/layout1.vue";
//首页
const frontPage = {
	path: "/frontPage",
	name: "frontPage",
	component: layout1,
	redirect: "/frontPage/home",
	children: [
		{
			path: "home",
			name: "home",
			component: () => import("/@/views/frontPage/home/home.vue"),
			meta: { title: "首页" },
		},
	],
};
export default frontPage;
