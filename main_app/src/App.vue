<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
// import Common from '/@/utils/common';
import { useThemesStore } from "/@/stores/modules/themes";
import { LangType } from "/@/models/commonInterface";
import { computed, onBeforeMount, watch } from "vue";
import Common from "/@/utils/common";
import { CommonApi } from "/@/api/common";
import { useUserStore } from "/@/stores/modules/user";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import childrenAppsManage from "/@/childrenAppsManage/childrenAppsManage";
import childrenAppsMap from "/@/childrenAppsManage/childrenAppMaps/childrenAppsMap";
import ChildrenAppNameEnum from "/@/childrenAppsManage/childrenAppEnums/childrenAppNameEnum";
import { PreFetchApp } from "/@/childrenAppsManage/childrenAppModels/childrenAppsManageModel";
import { useRouter } from "vue-router"; // 引入路由
import pubsub from "/@/pubSub/pubSub";
const UserStore = useUserStore();
const ThemesStore = useThemesStore();
const router = useRouter();
onBeforeMount(() => {
	initTheme();
	initLang();
	preFetchApp();
});

const toMaintain = () => {
	router.push("/maintain");
};

const toAccessRestriction = () => {
	router.push("/accessRestriction");
};

pubsub.subscribe("maintain", toMaintain);
pubsub.subscribe("accessRestriction", toAccessRestriction);

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
	if (lang) {
		UserStore.setLang(lang);
	} else {
		await getLang();
	}
};

//发送给子应用的全局数据
const childrenAppData = computed(() => {
	return {
		token: UserStore.token,
		userInfo: UserStore.getUserInfo,
		lang: UserStore.getLang,
		themeName: ThemesStore.getTheme,
	};
});

watch(
	() => childrenAppData.value,
	(newValue, oldValue) => {
		childrenAppsManage.forceSetGlobalData(newValue);
	},
	{
		deep: true,
		immediate: true,
	}
);

//预加载子应用
const preFetchApp = () => {
	//获取体育A字典预加载参数
	const sportAPreFetchApp = childrenAppsMap.get(ChildrenAppNameEnum.sportA)?.preFetchApp as PreFetchApp;
	//预加载
	childrenAppsManage.preFetch([sportAPreFetchApp], 3000);
};
</script>
