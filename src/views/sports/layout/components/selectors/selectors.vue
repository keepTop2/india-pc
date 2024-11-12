<template>
	<div class="list">
		<div class="select">
			<el-select v-model="state.value1" :teleported="false" :suffix-icon="SuffixIcon" :fit-input-width="true" :placement="'bottom-end'" :popper-options="popperOptions">
				<el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>

		<div class="select-date">
			<el-dropdown
				ref="selectRef"
				trigger="click"
				:teleported="false"
				:placement="'bottom-end'"
				:hide-on-click="false"
				:popper-class="'popperClass'"
				@visible-change="visibleChange"
				@command="onCommand"
			>
				<div class="el-dropdown-content">
					<span v-if="!range.start && !range.end">{{ selectDateLabel }}</span>
					<span v-else>{{ startDate }}-{{ startEnd }}</span>
					<SvgIcon class="icon" iconName="arrow" :size="18" />
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							:class="{ 'dropdown-item-active': dropdownItemActive == index && !range.start && !range.end }"
							v-for="(item, index) in date"
							:key="item.value"
							:command="{
								index: index,
								value: item.value,
								label: item.label,
							}"
							>{{ item.label }}</el-dropdown-item
						>
						<el-dropdown-item :class="{ 'dropdown-item-active': range.start && range.end }" :command="''">
							<template #>
								<div class="date">
									<span>自定义</span>
									<VDatePicker v-if="vDatePicker" class="v-Date" v-model.range.number="range" locale="en" @update:pages="handlePanelChange">
										<template #header-title-wrapper> {{ selectDateYM }} </template>
										<template #header-prev-button>
											<SvgIcon style="transform: rotate(90deg)" class="icon" iconName="arrow" :size="18" />
										</template>
										<template #header-next-button>
											<SvgIcon style="transform: rotate(-90deg)" class="icon" iconName="arrow" :size="18" />
										</template>
									</VDatePicker>
								</div>
							</template>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<div class="select">
			<el-select v-model="state.value3" :teleported="false" :suffix-icon="SuffixIcon" :fit-input-width="true" :placement="'bottom-end'" :popper-options="popperOptions">
				<el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from "vue";
import SuffixIcon from "./components/suffix-icon.vue";

import Common from "/@/utils/common";
import moment from "moment-timezone";
import { defineAsyncComponent } from "vue";
// const SuffixIcon = defineAsyncComponent(() => import("/@/views/sports/layout/components/selectors/components/suffix-icon.vue"));
const type = [
	{ label: "充值", value: 0 },
	{ label: "提现", value: 1 },
	{ label: "账变", value: 2 },
	{ label: "奖金", value: 3 },
];
const date = [
	{ label: "24小时", value: 1 },
	{ label: "7天", value: 2 },
	{ label: "30天", value: 3 },
	{ label: "60天", value: 4 },
	{ label: "90天", value: 5 },
];
const status = [
	{ label: "全部", value: "" },
	{ label: "成功", value: 1 },
	{ label: "进行中", value: 2 },
	{ label: "失败", value: 3 },
];

const selectRef = ref(null);
const selectDateYM = ref(""); // 时间选择器
const selectDateLabel = ref(""); // 时间选择器
const vDatePicker = ref(false);
const startDate = ref("" as number | string);
const startEnd = ref("" as number | string);
const dropdownItemActive = ref("" as number | string);
const state = reactive({
	value1: 0,
	value2: "" as string | number,
	value3: "",
});

const range = ref({ start: "", end: "" }); // 时间参数

// 监听时间参数变化
watch([range], ([newRange], [prevRange]) => {
	console.log("newRange", newRange);
	startDate.value = Common.getYMD(newRange.start, "YYYY/MM/DD");
	startEnd.value = Common.getYMD(newRange.end, "YYYY/MM/DD");
});

// 监听时间选择是否为自定义
watch(
	() => state.value2,
	(newValue, oldValue) => {
		// console.log('newValue', newValue);
		if (newValue == "") {
			selectRef.value?.handleOpen();
			vDatePicker.value = true;
		} else {
			selectRef.value?.handleClose();
			vDatePicker.value = false;
		}
	}
);

// 时间选择器选择
const onCommand = (e: any) => {
	// console.log('e', e);
	if (e) {
		dropdownItemActive.value = e.index;
		state.value2 = e.value;
		selectDateLabel.value = e.label;
		range.value.start = "";
		range.value.end = "";
	} else {
		state.value2 = "";
		vDatePicker.value = true;
	}
};

// 关闭时间选择器下拉菜单
const visibleChange = (bool: any) => {
	if (!bool) {
		vDatePicker.value = false;
	}
};

const handlePanelChange = (newPanel: any) => {
	let date = newPanel[0].monthComps.firstDayOfMonth;
	selectDateYM.value = moment(date).format("YYYY-MM");
};

// 弹窗层配置
const popperOptions = {
	modifiers: [
		{
			name: "offset",
			options: {
				offset: [0, 8],
			},
		},
	],
};
</script>

<style scoped lang="scss">
.list {
	display: flex;
	gap: 4px;
	.select {
		width: 200px;
		height: 44px;
		background: var(--Bg-1);
		border-radius: 8px;
		box-sizing: border-box;
		.el-select {
			width: 100%;
			height: 44px;

			:deep(.el-input) {
				width: 100%;
				height: 44px;
				.el-input__wrapper {
					padding: 12px 20px;
					background-color: unset;
					box-shadow: none !important;
					.el-input__inner {
						color: var(--Text-1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
					}
					.el-icon svg {
						width: unset;
						height: unset;
					}
				}
			}

			:deep(.el-select__popper) {
				background-color: var(--Bg-1);
				box-shadow: var(--popoverShadow);
				border-radius: 8px;
			}
			:deep(.el-select-dropdown) {
				width: 160px !important;

				.el-scrollbar {
					overflow: unset;
					.el-scrollbar__wrap {
						overflow: unset;
					}
				}

				.el-select-dropdown__list {
					margin: 0px !important;
					padding: 8px 12px !important;

					.el-select-dropdown__item {
						width: 100%;
						height: 40px;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0px 12px;
						color: var(--Text-1);
						overflow: unset;
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						line-height: unset;
						border-radius: 4px;
					}

					.hover {
						background-color: transparent;
						color: var(--Text-1);
					}
					.selected {
						background-color: var(--Bg-5) !important;
						color: var(--Text-s) !important;
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 500;
					}

					.el-select-dropdown__item:hover {
						background-color: var(--Bg-3);
						border-radius: 4px;
					}
				}
			}
			:deep(.el-popper__arrow) {
				display: none;
			}
		}
	}

	.select-date {
		width: 240px;
		height: 44px;
		background: var(--Bg-1);
		border-radius: 8px;
		box-sizing: border-box;
		:deep(.el-dropdown) {
			width: 100%;
			.el-dropdown-content {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 12px 20px;
				cursor: pointer;
				box-sizing: border-box;
				color: var(--Text-1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.popperClass {
				width: 160px;
				background-color: var(--Bg-1);
				box-shadow: var(--popoverShadow);

				border-radius: 8px;

				.el-scrollbar {
					overflow: unset;
					.el-scrollbar__wrap {
						overflow: unset;
						.el-dropdown__list {
							margin: 0px !important;
							padding: 8px 12px !important;

							.el-dropdown-menu {
								padding: 0px;
								background-color: transparent;

								.dropdown-item-active {
									background-color: var(--Bg-5) !important;
									color: var(--Text-s) !important;
									font-family: "PingFang SC";
									font-size: 14px;
									font-weight: 500;
								}
								.el-dropdown-menu__item {
									width: 100%;
									height: 40px;
									display: flex;
									align-items: center;
									justify-content: space-between;
									padding: 0px 12px;
									color: var(--Text-1);
									overflow: unset;
									white-space: nowrap;
									text-overflow: ellipsis;
									font-family: "PingFang SC";
									font-size: 14px;
									font-weight: 400;
									box-sizing: border-box;
									border-radius: 4px;
									.date {
										position: relative;
										width: 100%;
										.v-Date {
											position: absolute;
											top: calc(100% + 24px);
											right: -24px;
										}
										.vc-bordered {
											width: 268px;
											// height: 232px;
											border-radius: 8px;
											border: 1px solid;
											border-color: var(--Line);
											background-color: var(--Bg-4);
											box-shadow: var(--popoverShadow);
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
	}
}

:deep(.el-popper) {
	border: 0;
}
:deep(.el-select-dropdown__wrap) {
	max-height: none !important;
}
</style>
