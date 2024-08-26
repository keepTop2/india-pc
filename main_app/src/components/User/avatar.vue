<template>
	<img :src="computedImages.avatar" :style="computedStyle" alt="avatar" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";

const props = defineProps({
	size: Number,
});

const themesStore = useThemesStore();
const computedImages = computed(() => {
	return {
		avatar: new URL(`../../assets/zh/${themesStore.themeName}/UserInfo/icon.png`, import.meta.url).href,
	};
});

const computedStyle = computed(() => {
	const { size } = props;
	if (size) {
		return {
			width: `${size}px`,
			height: `${size}px`,
		};
	}
	return {};
});
</script>
