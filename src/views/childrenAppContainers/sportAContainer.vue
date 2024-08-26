<template>
	<div id="sportAContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { MainTochildrenCommon } from "/@/childrenAppsManage/childrenAppDTOs/mainToChildren/mainTochildrenCommon";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
import { ControllersEnum } from "/@/childrenAppsManage/childrenAppEnums/controllersEnum";
import childrenAppsMap from "/@/childrenAppsManage/childrenAppMaps/childrenAppsMap";
import { RenderAppOptions } from "/@/childrenAppsManage/childrenAppModels/childrenAppsManageModel";
import childrenAppsManage from "/@/childrenAppsManage/childrenAppsManage";

const route = useRoute();
onMounted(() => {
	renderSportA();
});

onUnmounted(() => {
	childrenAppsManage.unmountApp(ChildrenAppNameEnum.sportA);
});

/**
 * @description 大容器渲染
 */
const renderSportA = () => {
	const sportAApp = childrenAppsMap.get(ChildrenAppNameEnum.sportA)?.renderAppOptions as RenderAppOptions;
	const routeData = JSON.parse(decodeURI(route.query.data as string));
	// console.log(routeData, "看下过来的数据");
	//设置默认渲染页面
	sportAApp["default-page"] = "#" + routeData.path;
	sportAApp.container = "#sportAContainer";
	childrenAppsManage.renderApp(sportAApp).then(() => {
		const mainTochildrenCommon: MainTochildrenCommon = {
			name: ChildrenAppNameEnum.sportA,
			transactionName: ControllersEnum.SportAContainerChangeController,
			apiName: "toSportAcontainerProcess",
			data: routeData,
		};
		//发数据给子应用 让子应用自己去跳转对应路由
		childrenAppsManage.forceSetData(ChildrenAppNameEnum.sportA, mainTochildrenCommon);
	});
};
</script>

<style lang="scss" scoped></style>
