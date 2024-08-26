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
		{
			path: "bonus",
			name: "bonus",
			component: () => import("/@/views/frontPage/bonus/bonus.vue"),
			meta: { title: `layout['layout1']['奖金']` },
		},
		{
			path: "casino",
			name: "casino",
			// component: () => import('/@/views/frontPage/bonus/bonus.vue'),
			meta: { title: `layout['layout1']['赌场']` },
		},
		{
			path: "sport",
			name: "sport",
			// component: () => import('/@/views/frontPage/bonus/bonus.vue'),
			meta: { title: `layout['layout1']['体育']` },
		},
		{
			path: "lottery",
			name: "lottery",
			// component: () => import('/@/views/frontPage/bonus/bonus.vue'),
			meta: { title: `layout['layout1']['彩票']` },
		},
		{
			path: "vip",
			name: "vip",
			// component: () => import('/@/views/frontPage/bonus/bonus.vue'),
			meta: { title: `layout['layout1']['VIP']` },
		},
		{
			path: "union",
			name: "union",
			// component: () => import('/@/views/frontPage/bonus/bonus.vue'),
			meta: { title: `layout['layout1']['联盟']` },
		},
	],
};
export default frontPage;
