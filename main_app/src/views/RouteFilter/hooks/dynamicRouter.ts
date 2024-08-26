/*
 * @Author: WangMingxin
 * @Description: 动态路由处理；
 */
import { computed, h, onMounted, reactive, ref, watch } from "vue";
import router from "/@/router";
import { useMenuStore } from "/@/stores/modules/menu";
import { findRouter } from "../units/tool";
import { gameModel, modelCodeCA, modelCodePE, modelCodeLT, modelCodeVENUE } from "./modelCodeOperate";

/**
 * @description: 动态路由全局处理；
 * @return {*}
 */
export function useDynamicRouter() {
	const MenuStore = useMenuStore();
	const gameMenu: any = ref([]);
	/**
	 * @description: 创建游戏动态路由；
	 * @param {any} list {菜单数组 }
	 * @param {any} pItem {父级对象}
	 * @return {*}
	 */
	const creatGameMenu = (list: any, pItem?: any) => {
		let newArray: Array<any> = [];
		list &&
			list.forEach((item: any) => {
				const modelIndex = gameModel.findIndex((e) => e.modelCode == item.modelCode);
				let children = [];
				let rout = {};
				const id = item.id || item.gameOneClassId;
				const name = item.gameOneClassName || item.name;
				const iconCode = item.iconCode;
				// 拥有子级路由处理；
				if (item.gameTwoClassList && item.gameTwoClassList.length) {
					/** 后端创建的路由 */
					children = creatGameMenu(item.gameTwoClassList, item);
					/** 赌场子路由的处理  */
					const CA_router = modelCodeCA(item, modelIndex);
					if (CA_router) {
						CA_router &&
							CA_router.forEach((e) => {
								children.push(e);
							});
					}
					// /** 体育子路由处理 */
					// const PE_router = modelCodePE(item, modelIndex);
					// if (PE_router) {
					// 	console.info(PE_router);
					// 	children.push(PE_router);
					// }
					/** 彩票子路由的处理; */
					const LT_router = modelCodeLT(item, modelIndex);
					if (LT_router) {
						children.push(LT_router);
					}
					rout = {
						path: "/menu/" + gameModel[modelIndex]?.tag + "/" + id,
						// name: '' + id,
						redirect: "/menu/parent/" + gameModel[modelIndex]?.tag + "/" + id,
						meta: {
							title: name,
							iconCode: iconCode,
							isServer: true,
							modelCode: item.modelCode,
						},
						children,
					};
					item = Object.assign(item, rout);
					newArray.push(item);
				} else {
					// 末层级别路由
					rout = {
						path: "/menu/" + gameModel[modelIndex]?.tag + "/" + id,
						name: "" + id,
						component: gameModel[modelIndex]?.component || "",
						meta: {
							title: name,
							iconCode: iconCode,
							isServer: true,
							modelCode: item.modelCode,
						},
					};
					item = Object.assign(item, rout);
					newArray.push(item);

					//添加供应商游戏详细(虚拟节点添加;)
					const VENUE_router = modelCodeVENUE(item, modelIndex);
					if (VENUE_router) {
						newArray.push(VENUE_router);
					}
				}
			});

		return newArray;
	};
	/**
	 * @description: 设置全部路由菜单;
	 * @return {*}
	 */
	const setRoutes = () => {
		const routenew = router.options.routes.find((item) => {
			return item.path == "/menu";
		});
		if (gameMenu.value.length) {
			gameMenu.value.forEach((item: any, ind: number) => {
				routenew?.children?.splice(3 + ind, 0, item);
			});
		}
		MenuStore.setMenuList(routenew);
	};

	/**
	 * @description: 运行创建及设置菜单
	 * @param {object} _to {}
	 * @param {object} _from {}
	 * @param {function} next {下一步函数}
	 * @param {object} serverData {后台数据}
	 * @return {*}
	 */
	const runCreatSetMenu = (_to: any, _from: any, next: any, serverData: any) => {
		//获取需要跳转的路由地址及参数；(使用next重定向)
		const path = _to.redirectedFrom?.path || _to.path;
		const query = _to.redirectedFrom?.query || _to.query;
		const params = _to.redirectedFrom?.params || _to.params;
		//跳转的路由地址及参数-end
		gameMenu.value = creatGameMenu(JSON.parse(JSON.stringify(serverData)));
		console.log("gameMenu.value", gameMenu.value);

		MenuStore.setServeMenu(gameMenu.value);
		//查找路由判断路由名称是否添加
		const routeNmame = gameMenu.value[0].name || gameMenu.value[0].children[gameMenu.value[0].children.length - 1].name;
		const isAdd = router.hasRoute(routeNmame);
		// 查看后台菜单是否添加（已添加不处理；未添加进行菜单处理）
		if (!isAdd) {
			for (const item of gameMenu.value) {
				router?.addRoute("menu", item);
			}
			setRoutes();
			// next({ path: _to.redirectedFrom?.path });
		}
		next({ path: path, query, params });
	};

	return {
		/**运行创建及设置菜单 */
		runCreatSetMenu,
	};
}
