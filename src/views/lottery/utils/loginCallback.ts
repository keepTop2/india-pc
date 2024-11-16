import { RouteLocationNormalizedLoaded as Route } from "vue-router";
import lotteryRoutes from "/@/router/modules/lottery";
import { useLoginGame } from "/@/views/lottery/stores/loginGameStore";

/**
 * @description 这个函数是裁片详情页登录之后，不会自动登录第三方的一个处理方案
 */
export function loginCallback(route: Route) {
	console.log("route", route);
	const routeName = route.name;
	const { loginGame } = useLoginGame();

	const routeNames = lotteryRoutes.children.map((v) => v.name);
	if (routeNames.includes(routeName as string)) {
		loginGame();
	}
}
