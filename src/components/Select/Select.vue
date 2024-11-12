<template>
	<div class="select-date">
		<el-dropdown ref="selectRef" trigger="click" :teleported="false" :placement="'bottom-end'" :popper-class="'popperClass'" @visible-change="visibleChange" @command="onCommand">
			<div class="el-dropdown-content">
				<span class="content"><slot name="prefix"></slot>{{ selectDateLabel }}</span>
				<svg-icon class="icon" name="common-arrow_down" size="12" />
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item
						:class="{ 'dropdown-item-active': dropdownItemActive == index }"
						v-for="(item, index) in props.options"
						:key="item.value"
						:command="{ index: index, value: item.value, label: item.label }"
					>
						{{ item.label }}
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

interface Options {
	label: string;
	value: string | number;
}

const props = defineProps<{
	options: Options[];
}>();
const data = defineModel("modelValue");

const selectRef = ref(null);
const selectDateLabel = computed(() => props.options.find((item) => item.value === data.value)?.label);
const dropdownItemActive = ref("" as number | string);

// 关闭时间选择器下拉菜单
const visibleChange = (bool: any) => {};
// 时间选择器选择
const onCommand = (e: any) => {
	console.log("e", e);
	dropdownItemActive.value = e.index;
	data.value = e.value;
	console.log(data);
	// selectDateLabel.value = e.label;
	// selectRef.value?.handleClose();
};
</script>

<style scoped lang="scss">
.select-date {
	width: 200px;
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
			padding: 8px 10px;
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
													background-color: themed("Bg5");
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

.content {
	display: flex;
	align-items: center;
	gap: 10px;
}

:deep(.el-popper) {
	border: 0;
}

:deep(.el-select-dropdown__wrap) {
	max-height: none !important;
}
</style>
