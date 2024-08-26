/*
 * @Author: wangmingxin
 * @Description: 主路由过滤
 */
import router from "/@/router";
// const store = useUserStore();
import { useMenuStore } from "/@/stores/modules/menu";
router.beforeEach(async (_to, _from, next) => {
	const MenuStore = useMenuStore();
	const ServeMenu = MenuStore.getServerMenu;
	//判断是否是进入路由过渡页面
	if (_to.name == "RouteFilter") {
		next();
	} else {
		/**动态路由数据处理 查询动态菜单是否存在； */
		if (ServeMenu && ServeMenu.length) {
			next();
		} else {
			//动态菜单不存在 强制跳转到过渡页面；
			next({ path: "/RouteFilter" });
		}
	}
});
