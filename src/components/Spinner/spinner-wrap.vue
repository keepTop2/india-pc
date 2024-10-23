<template>
	<div class="spinner-warp">
		<spinner-roll v-if="modelValue" :style="computedSpinnerRollStyle" />
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import SpinnerRoll from "./spinner-roll.vue";

type Props = {
	modelValue: boolean;
	top?: number;
};

const props = withDefaults(defineProps<Props>(), {
	modelValue: false,
	top: 0,
});
const emit = defineEmits(["update:modelValue"]);

const computedSpinnerRollStyle = computed(() => {
	const { top } = props;
	if (top) {
		return {
			alignItems: "flex-start",
			paddingTop: `${top}px`,
		};
	}
	return {};
});
</script>

<style scoped lang="scss">
.spinner-warp {
	display: flex;
	flex-direction: column;
	margin-top: 0;
	align-items: center;
	justify-content: center;
	position: relative;

	> * {
		width: 100%;
	}
}
</style>
