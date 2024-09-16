import sportsRouterLeft from "../sports/sportsRouterLeft";
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
		children: [
			...menuRight,
			...sportsRouterLeft,
			{
				path: "/sports/:sportType/detail",
				name: "event_detail",
				component: () => import("/@/views/sports/views/eventDetail/eventDetail.vue"),
				meta: {
					title: "赛事详细",
					isServer: false,
					isSportSort: false,
					isHide: false,
				},
			},
		],
	},
];

export default Sports;
