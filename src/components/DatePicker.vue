<template>
	<div class="date-picker-box">
		<div class="date-picker" ref="datePickerRef" v-if="modelValue">
			<VDatePicker v-model.range="rangeDate" :min-date="minDate" :max-date="maxDate">
				<!-- <template #header-title-wrapper>{{ dayjs(rangeDate[0]).format("YYYY年MM月") }}</template> -->
				<template #header-prev-button>
					<svg-icon class="searchIcon" name="common-arrow_left" size="14px" />
				</template>
				<template #header-next-button>
					<svg-icon class="searchIcon" name="common-arrow_right" size="14px" />
				</template>
			</VDatePicker>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref, toRef } from "vue";
const datePickerRef = ref(null);
const props = defineProps({
	modelValue: Boolean,
	range: {} as any,
	minDate: String,
	maxDate: String,
});
const emit = defineEmits(["setShowDatePicker", "update:modelValue", "updateRange"]);
onClickOutside(datePickerRef, () => {
	console.log(rangeDate.value);

	emit("update:modelValue", false);
	emit("updateRange", [rangeDate.value.start, rangeDate.value.end]);
});

const rangeDate = toRef(props.range);
</script>

<style scoped>
:deep(.vc-blue) {
	--vc-accent-200: rgba(255, 40, 75, 0.5);
	--vc-highlight-light-content-color: var(--Text-s);
	--vc-highlight-outline-bg: var(--Theme);
	--vc-highlight-outline-border: transparent;
	--vc-rounded-full: 4px;
	--vc-accent-700: var(--Text-s);
}

.date-picker {
	width: 268px;
	position: absolute;
	left: 0;
	top: 100%;
}
:deep(.vc-pane-container) {
	width: 268px;
	border-radius: 8px;
	background: var(--Bg-4);
}
:deep(.vc-bordered) {
	background: var(--Bg-4);
	border: 1px solid var(--Line-2);
	box-shadow: 0px 0px 4px 0px rgba(255, 40, 75, 0.08);
}
:deep(.vc-light) {
	color: var(--Text-s);
}
:deep(.vc-header.is-lg) {
	font-size: 14px;
	color: var(--Text-1);
	font-weight: 500;
}
:deep(.vc-header) {
	margin-top: 0;
	border-bottom: 1px solid var(--Line-2);
}
:deep(.vc-focus:focus-within) {
	color: var(--Text-a);
	box-shadow: none;
}
:deep(.vc-highlight-bg-solid) {
	background: var(--Theme);
	outline: none;
	width: 22px;
}
:deep(.vc-highlight) {
	width: 22px;
}
:deep(.vc-highlight-base-middle) {
	width: 100%;
}

:deep(.vc-arrow) {
	background: transparent;
}
:deep(.vc-day-content.vc-disabled) {
	background: transparent;
	color: #504e4e;
}
:deep(.vc-title) {
	background: transparent;
	color: var(--Text-s);
}
</style>
