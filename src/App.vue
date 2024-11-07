<template>
	<router-view />
</template>

<script setup lang="ts" name="app">
import { useThemesStore } from "/@/stores/modules/themes";
import { computed, onBeforeMount, watch } from "vue";
import { useUserStore } from "/@/stores/modules/user";
import { useWindowSize } from "@vueuse/core";
import { useLayoutStore } from "./stores/modules/layout";
const { width } = useWindowSize();
const UserStore = useUserStore();
const ThemesStore = useThemesStore();
const layoutStore = useLayoutStore();
const lauoytType = computed(() => {
	return width.value > 1440 ? 1 : width.value > 1024 ? 2 : 3;
});
watch(
	() => lauoytType.value,
	() => {
		layoutStore.setLayoutType(lauoytType.value);
	}
);
onBeforeMount(() => {
	ThemesStore.initTheme();
	UserStore.userInit();
});

//初始化主题
</script>

<style lang="scss"></style>
