import { Component, ref } from "vue";
import { i18n } from "/@/i18n";
const $: any = i18n.global;
/**
 * @description 彩种详情页切换购买彩票、开奖结果的 tabs 逻辑
 * @param
 * @returns
 */
export function useTab(BayLottery: Component, Result: Component) {
	// 购买彩票、开奖结构的 tab 切换
	const tabs = [
		{ id: 1, label: $.t(`lottery['购买彩票']`), component: BayLottery },
		{ id: 2, label: $.t(`lottery['购买彩票']`), component: Result },
	];
	const tabsActived = ref(0);
	const handleTabChange = (index: number) => {
		tabsActived.value = index;
	};

	return { tabs, tabsActived, handleTabChange };
}
