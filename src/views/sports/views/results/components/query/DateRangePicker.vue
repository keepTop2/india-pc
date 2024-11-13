<template>
	<el-dropdown trigger="click" :teleported="false" placement="bottom-end" :hide-on-click="false" popper-class="popperClass" @visible-change="visibleChange">
		<div class="el-dropdown-content">
			<span>{{ formattedDateRange }}</span>
			<svg-icon class="searchIcon" name="common-arrow_down" size="14" />
		</div>
		<template #dropdown>
			<VDatePicker class="v-Date" v-model="localDateRange" locale="en" @update:modelValue="updateModelValue">
				<template #header-title-wrapper>{{ headerTitle }}</template>
				<template #header-prev-button>
					<svg-icon class="searchIcon" name="common-arrow_up" size="14" />
				</template>
				<template #header-next-button>
					<svg-icon class="searchIcon" name="common-arrow_down" size="14" />
				</template>
			</VDatePicker>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import dayjs from "dayjs";
import Common from "/@/utils/common";

const props = defineProps<{
	modelValue: [number, number];
}>();

const emits = defineEmits(["update:modelValue"]);

const localDateRange = ref({ start: props.modelValue[0], end: props.modelValue[1] });

const formattedDateRange = computed(() => {
	const start = formatDate(localDateRange.value.start);
	const end = formatDate(localDateRange.value.end);
	return `${start} - ${end}`;
});

const headerTitle = computed(() => {
	return dayjs(localDateRange.value.start).format("YYYY-MM");
});

const formatDate = (date: number) => {
	return Common.getYMD(date, "YYYY/MM/DD");
};

const updateModelValue = () => {
	emits("update:modelValue", [localDateRange.value.start, localDateRange.value.end]);
};

const visibleChange = (visible: boolean) => {
	if (!visible) {
		updateModelValue();
	}
};
</script>

<style scoped lang="scss">
.el-dropdown {
	background: var(--Bg-2);
	height: 30px;
	.el-dropdown-content {
		width: 230px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 10px;
		cursor: pointer;
		box-sizing: border-box;
		color: var(--Text-1);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
	}
	.popperClass {
		background-color: var(--Bg-1);
		box-shadow: 0px 0px 8px 0px var(--popoverShadow);
		border-radius: 8px;
		border-color: var(--Line-2);
		.el-scrollbar {
			overflow: unset;
			.el-scrollbar__wrap {
				overflow: unset;
				.el-dropdown__list {
					margin: 0px !important;
					border: 0;
					.vc-bordered {
						width: 268px;
						border-radius: 8px;
						border: 1px solid var(--Line);
						background-color: var(--Bg-4);
						box-shadow: 0px 0px 8px 0px var(--popoverShadow);

						.vc-pane-container {
							.vc-header {
								height: 26px;
								margin: 4px 8px 0px;
								padding: 0px;
								grid-gap: 0px;
								.vc-title-wrapper {
									color: var(--Text-1);
									font-family: "PingFang SC";
									font-size: 14px;
									font-weight: 500;
									line-height: 22px;
								}
								.vc-arrow {
									width: 22px;
									height: 22px;
									background-color: transparent;
								}

								.vc-focus:focus-within {
									box-shadow: 0 0 0 2px var(--Bg-5);
								}
							}

							.vc-weeks {
								.vc-weekdays {
									color: var(--Text-2-1);
									font-family: "PingFang SC";
									font-size: 14px;
									line-height: 22px;
								}

								.vc-day-content {
									color: var(--Text-1);
									font-family: "PingFang SC";
									font-size: 14px;
									font-weight: 500;
									line-height: 22px;
								}

								.vc-day-content.vc-focusable.vc-focus.vc-attr.vc-attr.vc-highlight-content-solid.vc-blue {
									color: var(--Text-s);
									background-color: var(--Theme);
								}
								.vc-highlight.vc-highlight-base-middle.vc-highlight-bg-light,
								.vc-highlight.vc-highlight-base-start.vc-highlight-bg-light,
								.vc-highlight.vc-highlight-base-end.vc-highlight-bg-light,
								.vc-day-content.vc-focusable.vc-focus.vc-attr.vc-attr.vc-highlight-content-outline.vc-blue {
									background-color: var(--Bg-5);
									box-shadow: 0px 0px 0px 1px var(--Bg-5);
								}

								.vc-focus:focus-within {
									box-shadow: none;
								}

								.vc-light .vc-attr {
									background-color: var(--Bg-5);
								}
							}
						}
					}

					.el-dropdown-menu__item:focus {
						background-color: var(--Bg-3);
					}
				}
			}
		}

		.el-popper__arrow {
			display: none;
		}
	}
}
</style>
