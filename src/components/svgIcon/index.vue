<template>
	<!--svg外层容器，需要配置子元素use使用-->
	<svg :style="{ width: size ? size : width, height: size ? size : height, color: color, fill: fill }">
		<!--xlink:href引用的svg图标，#icon-图标名 -->
		<use :xlink:href="symbolId" style="pointer-events: none" />
	</svg>
</template>

<script setup>
import { computed, watch } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";
import { i18n } from "/@/i18n";
const themesStore = useThemesStore();
const props = defineProps({
	size: {
		type: String,
	},
	name: {
		type: String,
		required: true,
	},
	width: {
		type: String,
	},
	height: {
		type: String,
	},
	fill: {
		type: String,
	},
	color: {
		type: String,
	},
	hover: {
		type: String,
		default: "",
	},
});

// svg icon引入的格式
const symbolId = computed(() => {
	if (props.name?.slice(0, 6) === "common") {
		return `#${props.name}${props.hover == props.name ? "_on" : ""}`;
	} else {
		return `#${themesStore.getTheme}-${props.name}${props.hover == props.name ? "_on" : ""}`;
	}
});
</script>
