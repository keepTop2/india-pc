import router from "/@/router";
import { useRouterStore } from "/@/stores/modules/cacheRouter";

router.beforeEach(async (to, from, next) => {
	//页面单次缓存处理
	const { cacheRouter } = useRouterStore();
	cacheRouter(from, to);
	next();
});
