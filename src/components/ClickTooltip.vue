<template>
	<div class="tooltip-container" ref="ClickTooltipRef" @click="toggleTooltip">
		<div class="content">
			<slot name="icon"></slot>
		</div>
		<div v-if="show" class="tooltip" :style="{ minWidth: width + 'px' }" :class="right ? 'right' : ''">
			<div>
				<slot name="message"></slot>
			</div>
			<span class="tooltip-arrow"></span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

// 定义组件的 props
const props = defineProps<{
	message: string; // 提示文字内容
	maxWidth?: string; // 最大宽度，可选
	right?: boolean;
	width?: string;
}>();

// 控制提示框的显示和隐藏
const show = ref(false);
const ClickTooltipRef = ref(null);

// 当点击外部时，隐藏提示框
onClickOutside(ClickTooltipRef, () => {
	show.value = false;
});

// 点击按钮时切换提示框的显示状态
const toggleTooltip = () => {
	show.value = !show.value;
};
</script>

<style scoped lang="scss">
.tooltip-container {
	position: relative;
	display: inline-block; /* 确保容器根据内容自适应 */
	cursor: pointer;
}

.content {
	display: flex;
	align-items: center;
}

.tooltip {
	position: absolute;
	top: 105%;
	left: 50%;
	transform: translateX(-50%);
	background-color: rgba(0, 0, 0, 0.8);
	color: #fff;
	padding: 8px;
	border-radius: 4px;
	z-index: 1000;
	font-size: 12px;
	margin-top: 5px;
	font-size: 10px;
	word-break: break-all;
	word-wrap: break-word;
	text-align: center;
	color: #999;
}
.tooltip-arrow {
	position: absolute;
	bottom: 100%; /* 让箭头位于提示框上方 */
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-bottom: 6px solid rgba(0, 0, 0, 0.8); /* 箭头的颜色与提示框背景色相同 */
}
.right.tooltip {
	left: 0;
	right: 20px;
	transform: translateX(-94%);
	.tooltip-arrow {
		right: 10px;
		left: 100%;
		transform: translateX(-110%);
	}
}
</style>
