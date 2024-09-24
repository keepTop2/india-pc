<!--
 * @Description: 查询 toolbar
-->
<template>
	<div class="query">
		<div class="condition">
			<span>{{ $t(`matchResult['体育']`) }}</span>
			<Select :options="ballOptions" v-model="modelValue.ballType" />
			<span>{{ $t(`matchResult['日期']`) }}</span>
			<el-dropdown
				ref="selectRef"
				trigger="click"
				:teleported="false"
				placement="bottom-end"
				:hide-on-click="false"
				popper-class="popperClass"
				@visible-change="visibleChange"
				@command="onCommand"
			>
				<div class="el-dropdown-content">
					<span>{{ startDate }} - {{ endDate }}</span>
					<svg-icon class="searchIcon" name="arrow_down" size="14" />
				</div>
				<template #dropdown>
					<VDatePicker 
						class="v-Date" 
						v-model.range.number="range" 
						locale="en" 
						@update:pages="handlePanelChange"
					>
						<template #header-title-wrapper>{{ selectDateYM }}</template>
						<template #header-prev-button>
							<svg-icon class="searchIcon" name="arrow_up" size="14" />
						</template>
						<template #header-next-button>
							<svg-icon class="searchIcon" name="arrow_down" size="14" />
						</template>
					</VDatePicker>
				</template>
			</el-dropdown>
			
			<span>{{ $t(`matchResult['联赛']`) }}</span>
			<el-input v-model="modelValue.league" :placeholder="$t(`matchResult['请输入关键字搜索']`)" />
			
			<span>{{ $t(`matchResult['赛事']`) }}</span>
			<el-input v-model="modelValue.competition" :placeholder="$t(`matchResult['请输入']`)" />
			
			<!-- <el-checkbox v-model="modelValue.isLive">{{ $t(`matchResult['滚球']`) }}</el-checkbox> -->
		</div>
		<el-button 
			class="query-button" 
			@click="handleSearch" 
			:disabled="loading"
		>
			<svg-icon class="searchIcon" name="result_search" size="14" /> &nbsp;
			{{ $t(`matchResult['搜索']`) }}
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Select } from "/@/components/Select";
import { QueryOptionItemType } from "/@/views/sports/models/sportResultModel";
import Common from "/@/utils/common";
import dayjs from "dayjs";

/**
 * @description Props 接口
 */
interface Props {
	modelValue: any;
	ballOptions: QueryOptionItemType[];
	loading: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(["search", "updateModel"]);

const selectRef = ref(null);
const selectDateYM = ref("");
const showDatePicker = ref(false);
const range = ref({ start: props.modelValue.date[0], end: props.modelValue.date[1] });

/**
 * @description 计算属性，用于格式化开始日期
 */
const startDate = computed(() => formatDate(range.value.start));

/**
 * @description 计算属性，用于格式化结束日期
 */
const endDate = computed(() => formatDate(range.value.end));

/**
 * @description 处理搜索按钮点击事件
 */
const handleSearch = () => emits("search");

/**
 * @description 监听 range 变化
 */
watch(range, () => {
	console.log(range.value, '=range', props.modelValue);
	emits("updateModel", { ...props.modelValue, date: [range.value.start, range.value.end] });
});

/**
 * @description 处理下拉菜单命令
 * @param {string} command - 命令字符串
 */
const onCommand = (command: string) => {
	if (command) {
		// 处理特定日期命令
	} else {
		showDatePicker.value = true;
	}
};

/**
 * @description 处理下拉菜单可见性变化
 * @param {boolean} visible - 可见性状态
 */
const visibleChange = (visible: boolean) => {
	if (!visible) showDatePicker.value = false;
};

/**
 * @description 处理日期选择器面板变化
 * @param {any} newPanel - 新的面板数据
 */
const handlePanelChange = (newPanel: any) => {
	console.log(newPanel, '=newPanel');
	selectDateYM.value = dayjs(newPanel[0].monthComps.firstDayOfMonth).format("YYYY-MM");
};

/**
 * @description 格式化日期为字符串
 * @param {any} date - 日期对象
 * @returns {string} - 格式化后的日期字符串
 */
const formatDate = (date: any) => {
	console.log(date, '=====date');
	return date ? Common.getYMD(date, "YYYY/MM/DD") : "";
};
</script>

<style scoped lang="scss">
.query {
	margin: 14px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
		height: 44px;
		background: var(--Bg1);
		border-radius: 8px;
		box-sizing: border-box;
		padding:0 24px;
		:deep(.el-dropdown) {
			background: var(--Bg2);
			height:30px;
			.el-dropdown-content {
				width: 230px;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				    padding: 8px 10px;
				cursor: pointer;
				box-sizing: border-box;
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.popperClass {
				background-color: var(--Bg1);
				box-shadow: 0px 0px 8px 0px var(--popoverShadow);
				border-radius: 8px;
				border-color:var(--Line_2);
				.el-scrollbar {
					overflow: unset;
					.el-scrollbar__wrap {
						overflow: unset;
						.el-dropdown__list {
							margin: 0px !important;
							// padding: 8px 12px !important;
							border: 0;
									.vc-bordered {
										width: 268px;
										border-radius: 8px;
										border: 1px solid var(--Line);
										background-color: var(--Bg4);
										box-shadow: 0px 0px 8px 0px var(--popoverShadow);

										.vc-pane-container {
											.vc-header {
												height: 26px;
												margin: 4px 8px 0px;
												padding: 0px;
												grid-gap: 0px;
												.vc-title-wrapper {
													color: var(--Text1);
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
													box-shadow: 0 0 0 2px var(--Bg5);
												}
											}

											.vc-weeks {
												.vc-weekdays {
													color: var(--Text2_1);
													font-family: "PingFang SC";
													font-size: 14px;
													line-height: 22px;
												}

												.vc-day-content {
													color: var(--Text1);
													font-family: "PingFang SC";
													font-size: 14px;
													font-weight: 500;
													line-height: 22px;
												}

												.vc-day-content.vc-focusable.vc-focus.vc-attr.vc-attr.vc-highlight-content-solid.vc-blue {
													color: var(--Text_s);
													background-color: var(--Theme);
												}
												.vc-highlight.vc-highlight-base-middle.vc-highlight-bg-light,
												.vc-highlight.vc-highlight-base-start.vc-highlight-bg-light,
												.vc-highlight.vc-highlight-base-end.vc-highlight-bg-light,
												.vc-day-content.vc-focusable.vc-focus.vc-attr.vc-attr.vc-highlight-content-outline.vc-blue {
													background-color: var(--Bg5);
													box-shadow: 0px 0px 0px 1px var(--Bg5);
												}

												.vc-focus:focus-within {
													box-shadow: none;
												}

												.vc-light .vc-attr {
													background-color: var(--Bg5);
												}
											}
										}
								}

							.el-dropdown-menu__item:focus {
								background-color: var(--Bg3);
							}
						}
					}
				}

				.el-popper__arrow {
					display: none;
				}
			}
	}
	.condition {
		display: flex;
		gap: 16px;
		align-items: center;
		font-size: 14px;
		span {
			color: var(--Text1);
		}
		
		& > * {
			flex-shrink: 0;
		}
	}

	.query-button {
		width: 78px;
		height: 30px;
		background-color: var(--Theme);
		color: var(--Text_a);
		border:0;
		&.is-disabled :deep(.el-icon) {
			animation: rotate 1.5s linear infinite;
		}
		
		.searchIcon {
			color: var(--Text_a);
		}
	}
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

:deep {
	.el-input {
		width: 163px;
		height: 30px;
	}
	
	.select-date {
		width: 98px;
		height: 30px;
	}

	.el-input__wrapper {
		box-shadow: none;
		background: var(--Bg2);

		input {
			color: var(--Text2_1);

			&::placeholder {
				color: var(--Text2_1);
			}
		}
	}

	.el-checkbox__inner {
		background-color: var(--Bg1);
		border-color: var(--Line_2);
	}

	.el-checkbox__label {
		color: var(--Text1);
	}

	.el-checkbox__input.is-checked {
		.el-checkbox__inner {
			border-color: var(--Theme);
			
			&::after {
				border-color: var(--Theme);
			}
		}
	}
}
</style>
