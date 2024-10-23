<template>
	<img :src="imgSrc" alt="" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
const themesStore = useThemesStore();
import { i18n } from "/@/i18n";
const props = defineProps({
	src: {
		type: String,
		require: true,
	},
});
const imgSrc = ref("");
watch(
	() => themesStore.themeName,
	(newValue, oldValue) => {
		imgSrc.value = new URL(`../../assets/${i18n.global.locale.value}/${themesStore.themeName}${props.src}`, import.meta.url).href;
	},
	{
		immediate: true,
	}
);
watch(
	() => i18n.global.locale.value,
	(newValue, oldValue) => {
		imgSrc.value = new URL(`../../assets/${i18n.global.locale.value}/${themesStore.themeName}${props.src}`, import.meta.url).href;
	},
	{
		immediate: true,
	}
);
</script>

<style lang="scss" scoped>
img {
	width: 100%;
	height: 100%;
}
</style>
