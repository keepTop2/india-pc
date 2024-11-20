import { computed } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";

/**
 * 动态生成主题资源路径
 * @param {string} relativePath - 相对路径（不包含语言和主题信息）
 * @returns {string} 完整的资源路径
 */
export const useThemeResources = () => {
	const themesStore = useThemesStore();
	const themeName = computed(() => themesStore.themeName || "dark"); // 默认主题

	const getThemeResourcePath = (relativePath: string) => {
		return `/@/assets/zh-CN/${themeName.value}/${relativePath}`;
	};

	return computed(() => ({
		amount_info_bg: getThemeResourcePath("wallet/amount_info_bg.png"),
	}));
};
