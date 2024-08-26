<template>
	<div class="list">
		<span class="fs_16 color_Text_s fw_500">统计数据</span>
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
				<div class="el-dropdown-content bg_Bg2">
					<span>{{ selectDateLabel }}</span>
					<SvgIcon class="icon" iconName="arrow" :size="18" />
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							:class="{ 'dropdown-item-active': dropdownItemActive == item.value }"
							v-for="(item, index) in status"
							:key="item.value"
							:command="{
								index: index,
								value: item.value,
								label: item.label,
							}"
							>{{ item.label }}</el-dropdown-item
						>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue';
import Common from '/@/utils/common';
import moment from 'moment-timezone';

// 使用常量代替魔法数字
const STATUS_ALL = 0;
const STATUS_SUCCESS = 1;
const STATUS_IN_PROGRESS = 2;
const STATUS_FAILED = 3;

const status = [
	{ label: '全部', value: STATUS_ALL },
	{ label: '成功', value: STATUS_SUCCESS },
	{ label: '进行中', value: STATUS_IN_PROGRESS },
	{ label: '失败', value: STATUS_FAILED },
];

const selectRef = ref(null);
const selectDateLabel = ref('全部'); // 时间选择器标签
const vDatePicker = ref(false);
const dropdownItemActive = ref(0); // 下拉菜单激活项

// 时间选择器选择
const onCommand = (e: { index: number; value: number | string; label: string }) => {
	dropdownItemActive.value = Number(e.value);
	selectDateLabel.value = e.label;
};

// 关闭时间选择器下拉菜单
const visibleChange = (bool: boolean) => {
	if (!bool) {
		vDatePicker.value = false;
	}
};
</script>

<style scoped lang="scss">
.list {
	display: flex;
	gap: 12px;
	align-items: center;
	margin-bottom: 24px;
	.select-date {
		width: 362px;
		height: 48px;
		// overflow: hidden;
		@include themeify {
			background: themed('Bg1');
		}
		border-radius: 8px;
		box-sizing: border-box;
		:deep(.el-dropdown) {
			width: 100%;
			height: 100%;
			.el-dropdown-content {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 12px 20px;
				cursor: pointer;
				box-sizing: border-box;
				@include themeify {
					color: themed('Text1');
				}
				font-family: 'PingFang SC';
				font-size: 14px;
				font-weight: 400;
			}
			.popperClass {
				width: 160px;
				border: 0;
				@include themeify {
					background-color: themed('Bg1');
					box-shadow: 0px 0px 8px 0px themed('popoverShadow');
				}
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
									@include themeify {
										background-color: themed('Bg5') !important;
										color: themed('Text_s') !important;
									}
									font-family: 'PingFang SC';
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
									@include themeify {
										color: themed('Text1');
									}
									overflow: unset;
									white-space: nowrap;
									text-overflow: ellipsis;
									font-family: 'PingFang SC';
									font-size: 14px;
									font-weight: 400;
									box-sizing: border-box;
									border-radius: 4px;
								}
							}
							.el-dropdown-menu__item:focus {
								@include themeify {
									background-color: themed('Bg3');
								}
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
