<template>
	<svg
		:width="`${props.size}px`"
		:height="props.height ? `${props.height}px` : `${props.size}px`"
		:class="'svg-icon' + ($attrs.iconClass ? $attrs.iconClass : '')"
		aria-hidden="true"
	>
		<use class="svg-use" :href="'#' + $attrs.iconName" />
	</svg>
</template>

<script setup lang="ts">
// import { defineComponent, computed } from "vue";
// import ids from "virtual:svg-icons-names";

const props = withDefaults(
	defineProps<{
		size?: string | number;
		height?: string | number;
	}>(),
	{
		size: '24',
	}
);
</script>

<style scoped>
.svg-icon {
	fill: currentColor;
	vertical-align: middle;
	cursor: pointer;
}
</style>
