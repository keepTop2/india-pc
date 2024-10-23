<template>
		<router-view />
</template>

<script setup lang="ts" name="app">
// import Common from '/@/utils/common';
import { useThemesStore } from "/@/stores/modules/themes";
import { onBeforeMount } from "vue";
import Common from "/@/utils/common";
import { CommonApi } from "/@/api/common";
import { useUserStore } from "/@/stores/modules/user";

const UserStore = useUserStore();
const ThemesStore = useThemesStore();

onBeforeMount(() => {
	ThemesStore.initTheme();
	UserStore.userInit();
});

//初始化主题

//获取语言
const getCommonBusinessDownBox = async () => {
	const res: any = await CommonApi.getCommonBusinessDownBox().catch((err: any) => err);
	const { code, data } = res;
	if (code == Common.ResCode.SUCCESS) {
		console.log(data, 3333);

		// UserStore.setLangs(data);
	}
};
// //初始化语言
// const initLang = async () => {
// 	const lang = UserStore.lang;
// 	console.log(lang, 3333);
// 	if (lang) {
// 		UserStore.setLangs(lang);
// 	} else {
// 		await getCommonBusinessDownBox();
// 	}
// };
</script>

<style lang="scss"></style>
