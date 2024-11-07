import { useHaveToken } from "/@/hooks/useHaveToken";
const MajorCategoriesMenu = [
	{
		path: "/sports/collect",
		name: "sportsCollect",
		icon: "collection_header_bar",
		component: () => import("/@/views/sports/views/collect/collect.vue"),
		meta: { title: "收藏", type: "collect" },
		beforeEnter: (to: any, from: any, next: (bool?: boolean | undefined) => void) => {
			const haveToken = useHaveToken();
			if (!haveToken()) {
				next(false); // 取消导航
			} else {
				next(); // 继续导航
			}
		},
	},
	{
		path: "/sports/betRecord",
		name: "sportsBetRecord",
		icon: "betRecord",
		component: () => import("/@/views/sports/views/betRecord/betRecord.vue"),
		meta: { title: "注单", type: "betRecord" },
		beforeEnter: (to: any, from: any, next: (bool?: boolean | undefined) => void) => {
			const haveToken = useHaveToken();
			if (!haveToken()) {
				next(false); // 取消导航
			} else {
				next(); // 继续导航
			}
		},
	},
	{
		path: "/sports/results",
		name: "sportsResults",
		icon: "amidithion",
		component: () => import("/@/views/sports/views/results/results.vue"),
		meta: { title: "赛果", type: "result" },
		beforeEnter: (to: any, from: any, next: (bool?: boolean | undefined) => void) => {
			const haveToken = useHaveToken();
			if (!haveToken()) {
				next(false); // 取消导航
			} else {
				next(); // 继续导航
			}
		},
	},
];

export default MajorCategoriesMenu;
