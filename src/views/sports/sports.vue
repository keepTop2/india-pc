<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
// import Common from '/@/utils/common';
import { useThemesStore } from "/@/stores/modules/themes";
import { LangType } from "/@/models/commonInterface";
import { onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import Common from "/@/utils/common";
import { CommonApi } from "/@/api/common";
import { useUserStore } from "/@/stores/modules/user";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import ChildrenAppportAManage from "/@/ChildrenAppportAManage/ChildrenAppportAManage";
import { MainTochildrenCommon, MainToChildrenGlobal } from "/@/ChildrenAppportAManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import pubsub from "./pubSub/pubSub";
import { useRouter } from "vue-router";
import { SportAContainerChangeToMain } from "/@/ChildrenAppportAManage/childrenAppDTOs/childrenToMain/sportAContainerChangeToMain";
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
const UserStore = useUserStore();
const ThemesStore = useThemesStore();
const router = useRouter();
onBeforeMount(() => {
	initTheme();
	initLang();
	pubsub.subscribe(pubsub.PubSubEvents.SportAEvents.toSportAContainer.eventName, toSportABigContainer);
	pubsub.subscribe(pubsub.PubSubEvents.SportAEvents.routerChangeProcessEvent.eventName, routerChangeProcessEventProcess);
	window.addEventListener("appstate-change", appstateChange);
});

onMounted(() => {
	if (window.microApp) {
		console.log("子应用SportA App.vue渲染");
		window.microApp.addGlobalDataListener(initChildrenAppData, true);
		window.microApp.addDataListener(ChildrenAppportAManage.mainToChildrenData, true);

		// window.rawWindow.eventCenterForSportA.addDataListener(eventCenterForAppSportAProcess, true);
	}
});

onBeforeUnmount(() => {
	console.log("sportA app.vue onBeforeUnmount 触发");
	pubsub.unsubscribe(pubsub.PubSubEvents.SportAEvents.toSportAContainer.eventName, toSportABigContainer);
	pubsub.unsubscribe(pubsub.PubSubEvents.SportAEvents.routerChangeProcessEvent.eventName, routerChangeProcessEventProcess);
	window.removeEventListener("appstate-change", appstateChange);
	window.microApp.removeGlobalDataListener(initChildrenAppData);
	window.microApp.removeDataListener(ChildrenAppportAManage.mainToChildrenData);
	/** 清除购物车所有参数*/
	SportsBetEventStore.clearShopCart();
	SportSortStore.setIsActiveHot(false);
	SportSortStore.clearHotLeagueList();
	SportsBetEventStore.setOddsOptionMassge(0);
	ChampionShopCartStore.clearOutrightShopCart();
	ShopCatControlStore.setShopCatShow(false);
});

//初始化主题
const initTheme = () => {
	ThemesStore.setTheme(ThemesStore.themeName);
};
//获取语言
const getLang = async () => {
	const res: any = await CommonApi.getLanguage().catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		UserStore.setLang(data);
	}
};
//初始化语言
const initLang = async () => {
	const lang = UserStore.getLang;
	// console.info("初始化语言====>", lang);

	if (lang) {
		UserStore.setLang(lang);
	} else {
		await getLang();
	}
};

/**
 * 收到主应用派发的全局数据
 * @param data
 */
function initChildrenAppData(data: MainToChildrenGlobal) {
	// console.log("子应用收到全局数据", data);
	UserStore.setInfo(data.userInfo);
	UserStore.setLang(data.lang);
	UserStore.token = data.token;
	ThemesStore.setTheme(data.themeName);
}

/**
 * @description 大容器
 * @param data
 */
function toSportABigContainer(mainTochildrenCommonData: MainTochildrenCommon<SportAContainerChangeToMain>) {
	console.log("这里路由不能跳转吗", mainTochildrenCommonData.data?.data);
	router.push({
		path: mainTochildrenCommonData.data?.data.path,
		query: {
			data: JSON.stringify(mainTochildrenCommonData.data?.data),
		},
		replace: true,
	});
}

/**
 * @description 收到主应用路由跳转信息
 */
function routerChangeProcessEventProcess(mainTochildrenCommonData: MainTochildrenCommon<SportARouterChangeDTO>) {
	console.log(mainTochildrenCommonData, "sportA app.vue收到主应用路由跳转消息");
	let path = mainTochildrenCommonData.data?.path as string;
	let query = {};
	if (mainTochildrenCommonData.data?.data) {
		query = {
			data: JSON.stringify(mainTochildrenCommonData.data?.data),
		};
	}
	console.log(path, query, "看下query====");
	router.push({ path, query });
}

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
