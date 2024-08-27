<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
// import Common from '/@/utils/common';
import { useThemesStore } from "/@/stores/modules/themes";
import { onBeforeMount } from "vue";
import Common from "/@/utils/common";
import { CommonApi } from "/@/api/common";
import { useUserStore } from "/@/stores/modules/user";
import zhCn from "element-plus/es/locale/lang/zh-cn";

const UserStore = useUserStore();
const ThemesStore = useThemesStore();

onBeforeMount(() => {
	initTheme();
	initLang();
});

//初始化主题
const initTheme = () => {
	ThemesStore.setTheme(ThemesStore.themeName);
};
//获取语言
const getLang = async () => {
	// const res: any = await CommonApi.getLanguage().catch((err: any) => err);
	// const { code, data } = res;
	// if (code == Common.ResCode.SUCCESS) {
	// 	UserStore.setLang(data);
	// }
};
//初始化语言
const initLang = async () => {
	const lang = UserStore.getLang;
	console.log(lang);
	if (lang) {
		UserStore.setLang(lang);
	} else {
		await getLang();
	}
};
</script>
