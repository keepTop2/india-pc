import { ref, Ref } from "vue";
/**
 * @description 鼠标移入移出菜单高亮逻辑
 */
function useMenuHooks() {
	const hoverList: Ref<string> = ref("");

	/**
	 * @description 鼠标移入
	 * @param val  移入的菜单的路由信息
	 */
	const onMouseover = (val: string) => {
		hoverList.value = val;
	};

	/**
	 * @description 鼠标移出
	 */
	const onMouseout = () => {
		hoverList.value = "";
	};

	return {
		hoverList,
		onMouseover,
		onMouseout,
	};
}

export default useMenuHooks;
