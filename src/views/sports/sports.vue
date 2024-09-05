<template>
	<router-view />
</template>

<script setup lang="ts" name="app">
// import Common from '/@/utils/common';
import { onBeforeMount, onBeforeUnmount } from "vue";
import { useLoading } from "/@/directive/loading/hooks";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";

const ShopCatControlStore = useShopCatControlStore();
const SportsBetEventStore = useSportsBetEventStore();
const ChampionShopCartStore = useChampionShopCartStore();
const SportSortStore = useSportSortStore();

const { startLoading, stopLoading } = useLoading();

onBeforeMount(() => {
	window.addEventListener("appstate-change", appstateChange);
});

onBeforeUnmount(() => {
	console.log("sportA app.vue onBeforeUnmount 触发");
	window.removeEventListener("appstate-change", appstateChange);
	/** 清除购物车所有参数*/
	SportsBetEventStore.clearShopCart();
	SportSortStore.setIsActiveHot(false);
	SportSortStore.clearHotLeagueList();
	SportsBetEventStore.setOddsOptionMassge(0);
	ChampionShopCartStore.clearOutrightShopCart();
	ShopCatControlStore.setShopCatShow(false);
});

/**
 * 收到沙箱关闭后主应用发送的数据
 * @param data
 */
// function eventCenterForAppSportAProcess(mainTochildrenCommonData: MainTochildrenCommon) {
// 	console.log(mainTochildrenCommonData, "沙箱关闭后收到主应用的数据");
// }

/**
 * @description keep-alive模式下，在子应用卸载、重新渲染时，micro-app都会向子应用发送名为appstate-change的自定义事件，子应用可以通过监听该事件获取当前状态，状态值可以通过事件对象属性e.detail.appState获取。
 * @param e
 */
function appstateChange(e: any) {
	if (e.detail.appState === "afterhidden") {
		console.log("sportA 已推入后台");
		// router.push("/preFetchSportAView");
		// router.push({
		// 	path: "/preFetchSportAView",
		// 	replace: true,
		// });
	} else if (e.detail.appState === "beforeshow") {
		startLoading();
		console.log("sportA 即将重新渲染");
	} else if (e.detail.appState === "aftershow") {
		stopLoading();
		console.log("sportA 已经重新渲染");
	}
}
</script>
