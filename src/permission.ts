import router from "/@/router";
// const store = useUserStore();
import { useMenuStore } from "/@/stores/modules/menu";
router.beforeEach(async (_to, _from, next) => {
	next();
});
