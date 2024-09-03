import { computed, ref, Ref } from "vue";
/**
 * @description 鼠标移入移出菜单高亮逻辑
 */
function useSvgHoverHooks() {
	const hoverItem = ref("");

	/**
	 * @description 鼠标移入
	 * @param val  移入的菜单的路由信息
	 */
	const onMouseover = (val: string) => {
		hoverItem.value = val;
	};

	/**
	 * @description 鼠标移出
	 */
	const onMouseout = () => {
		hoverItem.value = "";
	};

	return {
		onMouseover,
		onMouseout,
		hoverItem,
	};
}

export default useSvgHoverHooks;
