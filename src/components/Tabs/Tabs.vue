<template>
	<!-- 标签页组件 -->
	<div class="tabs">
		<!-- 遍历标签列表 -->
		<div
			v-for="(item, index) in list"
			:key="index"
			:style="height ? `height: ${height}px; line-height: ${height}px` : ''"
			class="tab-item"
			:class="{ active: item.value === modelValue }"
			@click="handleClick(item)"
		>
			{{ item.label }}
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 定义组件属性和事件
const props = defineProps({
	// 绑定的值，表示当前选中的标签项的值
	modelValue: {
		type: [String, Number],
		required: true,
	},
	// 标签列表，每个标签项包含 label 和 value
	list: {
		type: Array,
		default: () => [],
	},
	// 标签项的高度
	height: {
		type: Number,
		required: false,
		default: 50,
	},
});

// 定义组件发出的事件
const emit = defineEmits(['update:modelValue', 'tabClick']);

// 点击标签项的处理函数，更新选中的标签值并触发事件
const handleClick = (item) => {
	emit('update:modelValue', item.value); // 更新选中的标签值
	emit('tabClick', item); // 触发自定义事件，传递当前点击的标签项
};
</script>

<style lang="scss" scoped>
// 标签页样式
.tabs {
	@include themeify {
		display: flex;
		margin: 0;
		margin-bottom: 25px;
		background-color: unset;
		border-bottom: 1px solid themed('Line');
		// 标签项样式
		.tab-item {
			flex-grow: 1;
			text-align: center;
			font-size: 16px;
			cursor: pointer;
			color: themed('Text1');

			// // 激活状态下的样式
			&.active {
				border-bottom: 2px solid themed('Theme');
				color: themed('Text_s');
			}

			// // 鼠标悬停时的样式
			// &:hover {
			// 	color: themed('Text_s');
			// 	background-color: themed('Bg3');
			// }
		}
	}
}
</style>
