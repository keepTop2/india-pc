/*
 * @Author: WangMingxin
 * @Description: 路由过滤(过渡子页面)
 */

const RouteFilter = {
	path: "/RouteFilter",
	name: "RouteFilter",
	component: () => import("/@/views/RouteFilter/RouteFilter.vue"),
	meta: { title: "路由过滤" },
};
export default RouteFilter;
