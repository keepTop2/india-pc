import { reactive } from 'vue';
import { useThemesStore } from '/@/stores/modules/themes';

/**
 * @description 鼠标移入移出菜单高亮逻辑
 */
function useMenuHooks() {
	type StatusNam = 'activeIcon' | 'inactivated';

	const hoverList = reactive({
		val: [] as Array<string>,
	});

	/**
	 * @description 鼠标移入
	 * @param val  移入的菜单的路由信息
	 */
	const onMouseover = (val: any) => {
		hoverList.val = [val.path];
	};

	/**
	 * @description 鼠标移出
	 */
	const onMouseout = () => {
		hoverList.val = [];
	};

	/**
	 *
	 * @param iconLastPath
	 * @param status 图片激活未激活 activeIcon | inactivated
	 * @returns
	 */
	const getIconPath = (iconLastPath: string, status: StatusNam) => {
		const themesStore = useThemesStore();
		return new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/menu/${status}/${iconLastPath}.svg`, import.meta.url).href;
	};

	return {
		hoverList,
		onMouseover,
		onMouseout,
		getIconPath,
	};
}

export default useMenuHooks;
