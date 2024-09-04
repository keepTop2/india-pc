<template>
	<div class="select-date">
		<el-dropdown
			ref="dropdownRef"
			trigger="click"
			:teleported="false"
			placement="bottom-end"
			:hide-on-click="true"
			popper-class="popperClass"
			@visible-change="handleVisibleChange"
			@command="handleCommand"
		>
			<div class="el-dropdown-content">
				<div class="name_left">
					<span class="name">{{ selectedOption ? selectedOption.leagueName : "全部" }}</span>
					<span> ({{ selectedOption ? selectedOption.events?.length ?? selectedOption.teams?.length ?? 0 : totalEvents }}) </span>
				</div>

				<div class="name_right">
					<SvgIcon class="icon" iconName="arrow" :size="18" />
				</div>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						v-for="(item, index) in optionsWithAll"
						:key="item.leagueId"
						:class="{ 'dropdown-item-active': activeIndex === index }"
						:command="{ index, value: item.leagueId, label: item.leagueName }"
					>
						<span class="text">{{ item.leagueName }}</span>
						<span class="text"> ({{ item.leagueId == 0 ? totalEvents : item.events?.length ?? item.teams?.length ?? 0 }}) </span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { defineProps, withDefaults } from "vue";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
const SportLeagueSeachStore = useSportLeagueSeachStore();
interface Option {
	leagueId: number | null;
	leagueName: string;
	events?: any[]; // events 属性是可选的
	teams?: any[]; // teams 属性是可选的
}

const props = withDefaults(defineProps<{ options: Option[] }>(), {
	options: () => [],
});

const dropdownRef = ref(null);
const activeIndex = ref<number | null>(0);
const selectedOption = ref<Option | null>(null);

const handleVisibleChange = (isVisible: boolean) => {
	console.log("Dropdown visibility changed:", isVisible);
};

/**
 * @description: option选中
 * @param {*} command
 * @return {*}
 */
const handleCommand = (command: { index: number; value: string | null; label: string }) => {
	console.log("Command received:", command);
	activeIndex.value = command.index;
	selectedOption.value = command.index !== 0 ? props.options[command.index - 1] : null;
	if (activeIndex.value > 0) {
		SportLeagueSeachStore.setSportsLeagueSelect([command.value]);
	} else {
		SportLeagueSeachStore.clearLeagueSelect();
	}
};

const totalEvents = computed(() => {
	return props.options.reduce((sum, item) => sum + (item.events?.length ?? item.teams?.length ?? 0), 0);
});

const optionsWithAll = computed(() => {
	return [{ leagueId: 0, leagueName: "全部", events: [] }, ...props.options];
});
</script>

<style scoped lang="scss">
.select-date {
	width: 200px;
	height: 30px;
	background: var(--Bg1);
	border-radius: 4px;
	box-sizing: border-box;

	:deep(.el-dropdown) {
		width: 100%;

		.el-dropdown-content {
			.name_left {
				display: flex;
				white-space: nowrap; /* 不换行，文本溢出 */
				overflow: hidden; /* 隐藏溢出部分 */
				text-overflow: ellipsis; /* 溢出时显示省略号 */
				.name {
					display: block;
					white-space: nowrap; /* 不换行，文本溢出 */
					overflow: hidden; /* 隐藏溢出部分 */
					text-overflow: ellipsis; /* 溢出时显示省略号 */
				}
			}
			.name_right {
				white-space: nowrap;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 5px 20px;
			cursor: pointer;
			box-sizing: border-box;

			color: var(--Text1);

			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}

		.popperClass {
			max-height: 200px; /* 设置下拉菜单的最大高度 */
			overflow-y: auto; /* 开启垂直滚动条 */
			width: 200px;

			background-color: var(--Bg1);
			box-shadow: var(--popoverShadow);

			border-radius: 8px;

			.el-scrollbar {
				overflow: unset;

				.el-scrollbar__wrap {
					overflow: unset;

					.el-dropdown__list {
						margin: 0px !important;
						// padding: 8px 12px !important;

						.el-dropdown-menu {
							padding: 0px;
							background-color: transparent;

							.dropdown-item-active {
								background-color: var(--Bg5) !important;
								color: var(--Text_s) !important;

								font-family: "PingFang SC";
								font-size: 14px;
								font-weight: 500;
							}

							.el-dropdown-menu__item {
								// width: 100%;
								display: flex;
								align-items: center;
								justify-content: space-between;
								padding: 8px 12px;
								color: var(--Text1);

								font-family: "PingFang SC";
								font-size: 14px;
								font-weight: 400;
								box-sizing: border-box;
								border-radius: 4px;

								.text {
									white-space: normal; /* 允许换行 */
									word-wrap: break-word; /* 长单词换行 */
									overflow-wrap: break-word; /* 同上 */
									max-width: 200px; /* 根据需要调整宽度 */
								}

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
										background-color: var(--Bg4);
										box-shadow: var(--popoverShadow);

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

		.popperClass::-webkit-scrollbar {
			width: 0.5em; /* 设置滚动条宽度 */
		}

		.popperClass::-webkit-scrollbar-track {
			background-color: transparent; /* 设置滚动条轨道背景色 */
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
