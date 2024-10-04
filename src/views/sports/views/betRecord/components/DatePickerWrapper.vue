<template>
	<div class="date-picker">
		<span class="label">日期</span>
		<!-- 使用 VDatePicker 组件 -->
		<VDatePicker v-model.range.number="innerRange" @update:pages="handlePanelChange" @update:modelValue="updateModelValue">
			<!-- 自定义标题模板 -->
			<template #header-title-wrapper>{{ selectDateYM }}</template>
			<!-- 自定义前一页按钮 -->
			<template #header-prev-button> <svg-icon style="transform: rotate(-180deg)" name="datePicker_arrow" size="10px" /> </template>
			<!-- 自定义下一页按钮 -->
			<template #header-next-button> <svg-icon name="datePicker_arrow" size="10px" /> </template>
			<!-- 自定义内容模板 -->
			<template #default="{ togglePopover }">
				<div class="date-container" @click="togglePopover">
					<div>{{ startDateValue }} - {{ endDateValue }}</div>
					<span class="icon">
						<svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon>
					</span>
				</div>
			</template>
		</VDatePicker>
	</div>
</template>

<script setup lang="ts">
// 引入 Vue 的相关函数和 dayjs 进行日期处理
import { computed, ref, watch, defineProps, defineEmits } from "vue";
import dayjs from "dayjs";

// 定义组件的 props
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({
			start: dayjs().startOf("day").valueOf(), // 默认为当天开始时间
			end: dayjs().endOf("day").valueOf(), // 默认为当天结束时间
		}),
	},
});

// 定义组件的 emit 事件
const emit = defineEmits(["update:modelValue"]);

// 内部使用的日期范围，初始化为 props.modelValue 的值
const innerRange = ref({ ...props.modelValue });
const selectDateYM = ref("");

// 监听 props.modelValue 的变化，更新 innerRange，避免无限循环
watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue.start !== innerRange.value.start || newValue.end !== innerRange.value.end) {
			innerRange.value = { ...newValue };
		}
	},
	{ immediate: true, deep: true }
);

// 监听 innerRange 的变化，触发事件将新值发回给父组件，避免递归更新
watch(
	() => innerRange.value,
	(newValue) => {
		if (newValue.start !== props.modelValue.start || newValue.end !== props.modelValue.end) {
			emit("update:modelValue", { ...newValue });
		}
	},
	{ deep: true }
);

/** 计算属性：格式化开始日期 */
const startDateValue = computed(() => formatDate(innerRange.value.start));

/** 计算属性：格式化结束日期 */
const endDateValue = computed(() => formatDate(innerRange.value.end));

/** 格式化日期 */
const formatDate = (date: any) => {
	return date ? dayjs(date).format("YYYY/MM/DD") : ""; // 使用 day.js 的 format 方法进行格式化
};

/**
 * @description 处理日期选择器面板变化
 * @param {any} newPanel - 新的面板数据
 */
const handlePanelChange = (newPanel: any) => {
	// 更新选择的年月
	selectDateYM.value = dayjs(newPanel[0].monthComps.firstDayOfMonth).format("YYYY-MM");
};

/**
 * @description 更新模型值
 * @param {any} e - 更新的模型值，包括开始和结束时间
 */
const updateModelValue = (e: any) => {
	// 处理结束时间戳，将结束时间设置为当天最后一刻 23:59:59
	if (e && e.end) {
		e.end = dayjs(e.end).endOf("day").valueOf(); // 获取当天最后一刻的时间戳
	}
	// 更新内部范围，以便再次触发双向绑定
	innerRange.value = { ...e };
};
</script>

<style scoped lang="scss">
:deep(.vc-popover-content) {
	background: var(--light-ok-Bg-4-4, #212328);
	border-radius: 8px;
	border: 1px solid var(--light-ok-Line-2-, #373a40);
}
:deep(.vc-container) {
	width: 268px;
	height: 232px;
	background: var(--light-ok-Bg-4-4, #212328);
	.vc-header {
		height: 22px;
		margin-top: 4px;
		padding: 0px 6px;
		// border-bottom: 1px solid var(--Line_2);
		.vc-arrow {
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			background-color: transparent;
		}
		.vc-focus:focus-within {
			box-shadow: 0 0 0 2px rgba(255, 40, 75, 0.5);
		}
		.vc-title-wrapper {
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 500;
		}
	}
	.vc-weeks {
		.vc-focus:focus-within {
			box-shadow: none;
		}
		.vc-weekdays {
			.vc-weekday {
				height: 26px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0px;
				color: var(--Text2_1);
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 500;
			}
		}
		.vc-week {
			margin-top: 2px;
			border-radius: 4px;
			overflow: hidden;

			.vc-day {
				height: 26px;
				min-height: 26px;

				.vc-day-content {
					width: 26px;
					height: 26px;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0px;
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 500;
				}

				.vc-highlight-content-solid {
					color: var(--Text_s);
				}
				.vc-day-content:hover {
					width: 26px;
					height: 26px;
					background-color: var(--Theme);
					border-radius: 4px;
					color: var(--Text_s);
				}

				.vc-highlight-bg-solid {
					width: 26px;
					height: 26px;
					background-color: var(--Theme);
					border-radius: 4px;
					color: var(--Text_s);
				}
				.vc-highlight-bg-light {
					background: rgba(255, 40, 75, 0.5);
				}
				.vc-highlight-bg-outline {
					width: 26px;
					height: 26px;
					background-color: var(--Theme);
					border: none;
					border-color: transparent;
					border-radius: 4px;
				}
			}
			// .is-not-in-month {
			// 	* {
			// 		opacity: 1;
			// 		color: var(--Text2_2) !important;
			// 	}
			// }

			.vc-light {
				background-color: var(--Theme);
			}
		}
	}
}

:deep(.vc-popover-caret.direction-bottom.align-left) {
	display: none;
}

.date-picker {
	display: flex;
	align-items: center;
	.label {
		display: inline-block;
		margin-right: 8px;
		white-space: nowrap;
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}

	.date-container {
		width: 220px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 5px 12px;
		border-radius: 4px;
		background: var(--Bg2);
		color: var(--Text1);
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
		cursor: pointer;

		.icon {
			transform: rotate(90deg);
		}
	}
}
</style>
