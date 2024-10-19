import { ref, watch } from "vue";
import { useRoute } from "vue-router";
export default () => {
	// 获取当前路由
	const route = useRoute();
	// 记录展开的球队 默认全部展开
	const expandedPanels = ref(new Set<number>());
	const onToggleAllStates = (listData: any[]) => {
		if (expandedPanels.value.size === listData.length) {
			expandedPanels.value.clear();
		} else {
			expandedPanels.value = new Set(listData.map((_, index) => index));
		}
	};
	const toggleDisplay = (index: number) => {
		if (expandedPanels.value.has(index)) {
			expandedPanels.value.delete(index);
		} else {
			expandedPanels.value.add(index);
		}
	};
	watch(
		() => route.query.sportType,
		() => {
			expandedPanels.value.clear();
		}
	);

	return {
		expandedPanels,
		toggleDisplay,
		onToggleAllStates,
	};
};
