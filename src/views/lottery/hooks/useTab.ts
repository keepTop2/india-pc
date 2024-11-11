import { ref } from "vue";

/**
 * @description 彩种详情页切换购买彩票、开奖结果的 tabs 逻辑
 * @param
 * @returns
 */
export function useTab() {
	// 购买彩票、开奖结构的 tab 切换
	const tabs = [
		{ label: "购买彩票", value: 1 },
		{ label: "开奖结果", value: 2 },
	];
	const tabsActived = ref(1);
	const handleTabChange = (id: number) => {
		tabsActived.value = id;
	};

	return { tabs, tabsActived, handleTabChange };
}
