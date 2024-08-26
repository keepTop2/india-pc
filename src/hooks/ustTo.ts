import { useRouter } from "vue-router";

/**
 * @description 路由跳转相关hooks
 */
function useTo() {
	const router = useRouter();
	/**
	 * @description 路由跳转
	 * @param path 跳转路径
	 * @param query 参数
	 */
	const to = (path: string, query = {}) => {
		router.push({
			path,
			query,
		});
	};

	return { to, router };
}

export default useTo;
