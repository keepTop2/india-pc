<template>
	<el-dialog
		:class="`${!title && 'noTitle'} dialog-module`"
		:show-close="false"
		:modelValue="modelValue"
		:width="width"
		top="0"
		modal-class="dialog_shade"
		@update:modelValue="handleUpdateModelValue"
	>
		<template v-if="!$slots.header">
			<div class="my-header">
				<h4 class="color_Text_s fs_20 fw_500">{{ title }}</h4>
				<SvgIcon class="close" v-if="showClose" @click="onClose" name="dialog_close" />
			</div>
		</template>
		<slot name="header" v-else></slot>
		<slot></slot>
		<template v-slot:footer v-if="showFooter">
			<span class="dialog-footer">
				<el-button class="close_button" @click="onClose">取 消</el-button>
				<el-button class="confirm" type="primary" @click="onConfirm">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, computed } from "vue";

/**
 * @param title
 * @param width 弹出框宽度
 * @param visible 是否展示弹出框
 * @param showClose 是否展示关闭按钮
 * @description 支持头部插槽 <template #header>自定义头部内容</template>
 * @function confirm 点击确定按钮的回调
 * @function close 关闭弹出框的回调
 */

interface DialogProps {
	/**
	 * 对话框标题
	 */
	title?: string;

	/**
	 * 弹出框宽度，可接受百分比或像素值（如 '30%' 或 '400px'）
	 * @default '30%'
	 */
	width?: string;
	/**
	 * 弹出框高度，可接受百分比或像素值（如 '30%' 或 '400px'）
	 */
	height?: string;

	/**
	 * 是否展示弹出框  v-model="visible"
	 */
	modelValue?: boolean;

	/**
	 * 是否展示关闭按钮（右上角的“×”图标）
	 * @default true
	 */
	showClose?: boolean;

	/**
	 * 是否展示底部操作栏（包含确认与取消按钮）
	 * @default false
	 */
	showFooter?: boolean;
}

const props = withDefaults(defineProps<DialogProps>(), {
	width: "50%",
	showFooter: false,
	showClose: true,
	modelValue: false,
});

const emit = defineEmits(["confirm", "update:modelValue", "close"]);

const handleUpdateModelValue = (value: boolean) => {
	emit("update:modelValue", value);
};

const onClose = () => {
	handleUpdateModelValue(false);
	emit("close");
};

const onConfirm = () => {
	emit("confirm");
	handleUpdateModelValue(false);
};

// function validateSize(size: string) {
// 	if (typeof size !== 'string' || (size.includes('%') && size.includes('px') && size.includes('vh'))) {
// 		return false;
// 	}
// 	return true;
// }

// function getDialogStyle(height?: string) {
// 	return {
// 		height: height && validateSize(height) ? height : ``,
// 	};
// }

// const dialogStyle = getDialogStyle(props.height);
</script>

<style lang="scss">
.dialog_shade {
	.my-header {
		padding: 28px 32px;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.el-overlay-dialog {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.dialog-module {
		position: relative;
		margin: 0;
		border-radius: 15px;
		background-color: var(--Bg-1);
		padding: 0;
		overflow: hidden;
		.el-dialog__header {
			padding: 0px;
			// 	.el-dialog__title {
			// 		color: themed('Text1');
			// 	}
			// 	.el-dialog__headerbtn {
			// 		top: 10px;
			// 		font-size: 20px;
			// 	}
		}
		.close {
			width: 30px;
			height: 30px;
		}
		.close:hover {
			color: var(--Text-s);
			transform: rotate(-90deg) scale(1.05);
			transition: all 0.3s;
		}
	}
	.noTitle {
		.my-header {
			padding: 0;
			height: 0;
			.close {
				position: absolute;
				right: 20px;
				top: 15px;
			}
		}
	}
	.dialog-footer {
		display: flex;
		justify-content: center;
		gap: 16px;
		font-family: "PingFang SC";
		margin-bottom: 40px;
		button {
			height: 40px;
			width: 150px;
			margin: 0;
			padding: 0;
			font-size: 16px;
			font-weight: 500;
		}
		.close_button {
			border: 1px solid var(--Theme);
			background: transparent;
			color: var(--Theme);
		}
	}
}
</style>
