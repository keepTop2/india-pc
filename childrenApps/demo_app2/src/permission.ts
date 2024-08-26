/*
 * @Author: wangmingxin
 * @Description: 主路由过滤
 */
import router from "/@/router";
// const store = useUserStore();

router.beforeEach(async (_to, _from, next) => {
	next();
});
