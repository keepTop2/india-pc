import { findRouter, staticRouterName } from "../units/tool";
import pubSub from "/@/pubSub/pubSub";
import { useUserStore } from "/@/stores/modules/user";
import { Notification } from "/@/components/index";
import { i18n } from "/@/i18n/index";

// 游戏模版字典
export const gameModel = [
	// 一级菜单模板 CODE，赌场:CA，体育:PE，彩票:LT
	{
		modelCode: "CA",
		tag: "topgames",
		component: () => import("/@/views/menu/casino/topgames/topgames.vue"),
	},
	{
		modelCode: "PE",
		tag: "sports",
		component: () => import("/@/views/menu/sports/sports.vue"),
	},
	{
		modelCode: "LT",
		tag: "lottery",
		component: () => import("/@/views/menu/lottery/lottery.vue"),
	},
	// 二级菜单模板 CODE，游戏:GAME，游戏供应商:VENUE
	{
		modelCode: "GAME",
		tag: "slotmachine",
		component: () => import("/@/views/menu/casino/slotmachine/slotmachine.vue"),
	},
	{
		modelCode: "VENUE",
		tag: "supplier",
		component: () => import("/@/views/menu/casino/supplier/supplier.vue"),
	},
];

/**
 * @description: modelCode等于CA(赌场)时的处理；
 * @param {*} item
 * @return {*}
 */
export const modelCodeCA = (item: any, modelIndex: number) => {
	let routerArray = [];

	//父及是赌场 添加游戏详细页
	if (item.modelCode == "CA") {
		const id = item.id || item.gameOneClassId;
		const name = item.name || item.gameOneClassName;
		const iconCode = item.iconCode;

		//添加静态游戏详细；
		const staticRoueChilden = {
			path: "/menu/casino/gameDetail/:detail?",
			name: "gameDetail",
			component: () => import("/@/views/menu/casino/gameDetail/gameDetail.vue"),
			meta: {
				title: ``,
				parentName: "" + id,
				isHide: true,
			},
			beforeEnter: (to: any, from: any, next: any) => {
				if (to.query?.name) {
					//进入游戏详细（动态更改名称）从二级菜单类进入；
					const selfRoute: any = findRouter(to?.name);
					selfRoute.meta.title = to.query.name;
					//从收藏/最近/推荐 进入；
					if (staticRouterName.indexOf(from.name) != -1) {
						const parentRoute: any = findRouter("_" + id);
						parentRoute.redirect = from.path;
						parentRoute.meta = {};
					}
					//从赌场(大厅)进入；
					if (from.meta.modelCode == "CA") {
						const parentRoute: any = findRouter("_" + id);
						if (from.query?.tab) {
							//分类路由
							const genreRoute: any = findRouter(from.query?.tab);
							// console.info(genreRoute);
							parentRoute.redirect = genreRoute.path;
							parentRoute.meta = genreRoute.meta;
						} else {
							parentRoute.redirect = "";
							parentRoute.meta = {};
						}
					}
					//刷新进入
					if (from.path == "/") {
						const parentRoute: any = findRouter("_" + id);
						parentRoute.redirect = "";
						parentRoute.meta = {};
					}
				}
				next();
			},
		};
		//添加静态游戏详细虚拟层级
		const staticRouet = {
			path: "/menu/casino/_gameDetail",
			redirect: "",
			name: "_" + id,
			meta: {
				title: name,
				iconCode: iconCode,
				isServer: true,
				isHide: true,
			},
			children: [staticRoueChilden],
		};

		routerArray.push(staticRouet);

		/**赌场主路由模块 */
		const cRout = {
			path: "/menu/parent/" + gameModel[modelIndex]?.tag + "/" + id,
			name: "" + id,
			component: gameModel[modelIndex]?.component || "",
			meta: {
				title: name,
				iconCode: iconCode,
				modelCode: item.modelCode,
				isHide: true,
				isServer: true,
			},
		};
		routerArray.push(cRout);
		return routerArray;
		// return staticRouet;
	} else {
		return false;
	}
};

/**
 * @description: 创建体育菜单子路由结构
 */
const creatSportsMenuRightRouter = () => {
	let routerArray: Array<any> = [];

	// sportsRouter.forEach((item) => {
	// 	const children = [
	// 		{
	// 			path: item.path + "/list",
	// 			name: item.name + "_list",
	// 			component: item.component,
	// 			meta: {
	// 				title: item.meta.title,
	// 				iconCode: item.meta.iconCode,
	// 				isHide: true,
	// 				isServer: false,
	// 			},
	// 		},
	// 		{
	// 			path: item.path + "/detail",
	// 			name: item.name + "_detail",
	// 			component: () => {
	// 				const modules = import.meta.glob("/src/*/*/*/*/*/*/*");
	// 				return modules["/src/views/menu/sports/views/" + item.name + "/detail/detail.vue"]();
	// 			},
	// 			meta: {
	// 				title: "赛事详细",
	// 				isServer: false,
	// 				iconCode: "ty_icon_lq",
	// 				isSportSort: false,
	// 				isHide: true,
	// 			},
	// 		},
	// 		{
	// 			path: item.path + "/sportsLeagueSearch",
	// 			name: item.name + "_sportsLeagueSearch",
	// 			component: () => import("/@/views/menu/sports/views/sportsLeagueSearch/sportsLeagueSearch.vue"),
	// 			meta: {
	// 				title: "联赛搜索",
	// 				isServer: false,
	// 				iconCode: "ty_icon_lq",
	// 				isSportSort: false,
	// 				isHide: true,
	// 			},
	// 		},
	// 	];
	// 	/** 建立父及组路由*/
	// 	let obj = {
	// 		path: item.path,
	// 		name: item.name,
	// 		redirect: children[0].path,
	// 		children: children,
	// 		meta: {
	// 			title: item.meta.title,
	// 			isServer: false,
	// 			iconCode: "ty_icon_dzjj",
	// 			isSportSort: true,
	// 			isHide: true,
	// 		},
	// 	};
	// 	routerArray.push(obj);
	// });
	return routerArray;
};

/**
 * @description:  modelCode等于PE(体育)时的处理；
 * @param {any} item
 * @return {*}
 */
export const modelCodePE = (item: any, modelIndex: number) => {
	//
	if (item.modelCode == "PE") {
		// const id = item.id || item.gameOneClassId;
		// const name = item.gameOneClassName || item.name;
		// const iconCode = item.iconCode;
		// /*菜单右侧路由*/
		// const rightRouter = creatSportsMenuRightRouter();
		// const allRouter = sportsRouterLeft.concat(rightRouter);
		// // sportsRouter.concat(sportsRouterLeft)
		// const cRout = {
		// 	path: "/menu/parent/" + gameModel[modelIndex]?.tag + "/" + id,
		// 	name: "" + id,
		// 	redirect: rightRouter[0].path,
		// 	component: gameModel[modelIndex]?.component || "",
		// 	children: allRouter,
		// 	meta: {
		// 		title: name,
		// 		iconCode: iconCode,
		// 		modelCode: item.modelCode,
		// 		isHide: true,
		// 		isServer: true,
		// 	},
		// 	beforeEnter: (to: any, from: any, next: any) => {
		// 		const UserStore = useUserStore();
		// 		const $: any = i18n.global;
		// 		if (!UserStore.token) {
		// 			//发布登陆弹窗事件
		// 			pubSub.publish(pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.eventName, pubSub.PubSubEvents.LoginEvents.showOrHiddenLoginDialog.params[1]);
		// 			Notification({
		// 				title: $.t('gameList["提示"]'),
		// 				content: $.t('common["请登陆后再进行操作"]'),
		// 			});
		// 			return false;
		// 		} else {
		// 			next();
		// 		}
		// 	},
		// };
		// const citem = Object.assign({}, cRout);
		// return citem;
	} else {
		return false;
	}
};

/**
 * @description: modelCode等于LT(彩票)时的处理；
 * @param {*} item
 * @return {*}
 */
export const modelCodeLT = (item: any, modelIndex: number) => {
	if (item.modelCode == "LT") {
		const id = item.id || item.gameOneClassId;
		const name = item.gameOneClassName || item.name;
		const iconCode = item.iconCode;
		const cRout = {
			path: "/menu/parent/" + gameModel[modelIndex]?.tag + "/" + id,
			name: "" + id,
			component: gameModel[modelIndex]?.component || "",
			meta: {
				title: name,
				iconCode: iconCode,
				modelCode: item.modelCode,
				isHide: true,
				isServer: true,
			},
		};
		const citem = Object.assign({}, cRout);
		return citem;
	} else {
		return false;
	}
};

/**
 * @description: 遇到供应商路由-添加供应商游戏详细
 * @param {any} item
 * @param {number} modelIndex
 * @return {*}
 */
export const modelCodeVENUE = (item: any, modelIndex: number) => {
	if (item.modelCode == "VENUE") {
		const id = item.id || item.gameOneClassId;
		const name = item.gameOneClassName || item.name;
		const iconCode = item.iconCode;

		const staticRoueChilden = {
			path: "/menu/casino/supplierDetail/:detail?",
			name: "supplierDetail",
			component: () => import("/@/views/menu/casino/supplierDetail/supplierDetail.vue"),
			meta: {
				title: `menu['casino']['游戏提供商详细']`,
				activeIcon: "casino/electronicGames_active",
				inactivated: "casino/electronicGames_inactivated",
				modelCode: item.modelCode,
				parentName: "" + id,
				isHide: true,
			},
			beforeEnter: (to: any, from: any, next: any) => {
				if (to.query?.name) {
					const selfRoute: any = findRouter(to?.name);
					selfRoute.meta.title = to.query.name;
				}
				next();
			},
		};
		//虚拟供应商节点；
		const staticRoue = {
			path: "/menu/casino/_supplierDetail",
			redirect: "/menu/" + gameModel[modelIndex]?.tag + "/" + id,
			name: "_" + id,
			meta: {
				title: name,
				iconCode: iconCode,
				isServer: true,
				isHide: true,
			},
			children: [staticRoueChilden],
		};
		return staticRoue;
	} else {
		return false;
	}
};
