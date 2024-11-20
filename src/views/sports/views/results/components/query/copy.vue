<!--
 * @Description: 查询 toolbar
-->

<template>
	<div class="query">
		<div class="condition">
			<span>{{ $t(`matchResult['体育']`) }}</span>
			<Select :options="ballOptions" v-model="queryForm.ballType" />

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
					<span v-if="!range.start && !range.end">{{ selectDateLabel }}</span>
					<span v-else>{{ startDate }} - {{ endDate }}</span>
					<SvgIcon class="icon" name="arrow" :size="18" />
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item :class="{ 'dropdown-item-active': range.start && range.end }" command="">
							<div class="date">
								<VDatePicker class="v-Date" v-model.range.number="range" locale="en" @update:pages="handlePanelChange">
									<template #header-title-wrapper>{{ selectDateYM }}</template>
									<template #header-prev-button>
										<SvgIcon style="transform: rotate(90deg)" class="icon" name="arrow" :size="18" />
									</template>
									<template #header-next-button>
										<SvgIcon style="transform: rotate(-90deg)" class="icon" name="arrow" :size="18" />
									</template>
								</VDatePicker>
							</div>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>

			<span>{{ $t(`matchResult['联赛']`) }}</span>
			<el-input v-model="queryForm.league" :placeholder="$t(`matchResult['请输入关键字搜索']`)" />

			<span>{{ $t(`matchResult['赛事']`) }}</span>
			<el-input v-model="queryForm.competition" :placeholder="$t(`matchResult['请输入']`)" />

			<el-checkbox v-model="queryForm.isLive">{{ $t(`matchResult['滚球']`) }}</el-checkbox>
		</div>
		<el-button class="query-button" :icon="loading ? 'loading' : 'search'" @click="handleSearch" :disabled="loading">
			<svg-icon class="searchIcon" name="result_search" :size="14" />
			{{ $t(`matchResult['搜索']`) }}
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Select } from "/@/components/Select";
import { QueryFormType, QueryOptionItemType } from "/@/views/sports/models/sportResultModel";
import Common from "/@/utils/common";
import dayjs from "dayjs";

interface Props {
	queryForm: QueryFormType;
	ballOptions: QueryOptionItemType[];
	loading: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(["search", "updateQueryForm"]);

const selectRef = ref(null);
const selectDateYM = ref("");
const selectDateLabel = ref("");
const showDatePicker = ref(false);
const range = ref({ start: "", end: "" });

const startDate = computed(() => formatDate(range.value.start));
const endDate = computed(() => formatDate(range.value.end));

watch(
	range,
	(newRange) => {
		if (newRange.start && newRange.end) {
			emits("updateQueryForm", { date: [newRange.start, newRange.end] });
		}
	},
	{ deep: true }
);

const handleSearch = () => emits("search");

const onCommand = (command: string) => {
	if (command) {
		// Handle specific date commands
	} else {
		showDatePicker.value = true;
	}
};

const visibleChange = (visible: boolean) => {
	if (!visible) showDatePicker.value = false;
};

const handlePanelChange = (newPanel: any) => {
	selectDateYM.value = dayjs(newPanel[0].monthComps.firstDayOfMonth).format("YYYY-MM");
};

const formatDate = (date: number | string) => {
	return date ? Common.getYMD(new Date(date).getTime(), "YYYY/MM/DD") : "";
};
</script>

<style scoped lang="scss">
.query {
	margin: 14px 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
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
			box-shadow: 0px 0px 8px 0px var(--popoverShadow);
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
								background-color: var(--Bg-2) !important;
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
	.condition {
		display: flex;
		gap: 16px;
		align-items: center;

		span {
			color: var(--Text-1);
		}

		& > * {
			flex-shrink: 0;
		}
	}

	.query-button {
		width: 78px;
		height: 32px;
		background-color: var(--Theme);
		color: var(--Text-a);

		&.is-disabled :deep(.el-icon) {
			animation: rotate 1.5s linear infinite;
		}

		.searchIcon {
			color: var(--Text-a);
		}
	}
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
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
		background: var(--Bg-1);

		input {
			color: var(--Text-2-1);

			&::placeholder {
				color: var(--Text-2-1);
			}
		}
	}

	.el-checkbox__inner {
		background-color: var(--Bg-1);
		border-color: var(--Line-2);
	}

	.el-checkbox__label {
		color: var(--Text-1);
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
