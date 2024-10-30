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
</script>

<style lang="scss"></style>
