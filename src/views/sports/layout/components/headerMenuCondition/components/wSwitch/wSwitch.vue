<template>
	<div class="tabs_content">
		<!-- 遍历 'on' 和 'off'，为每个状态渲染一个标签 -->
		<div v-for="(key, index) in ['on', 'off']" :key="index" :disable="true" :class="['tab', { tab_active: switchObj[key].active, disabled: disabled }]" @click="handleSwitch(key)">
			{{ switchObj[key].label }}
			<!-- 显示状态标签 -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

// SwitchItem 接口定义单个开关项的结构
interface SwitchItem {
	label: string; // 显示的标签
	type: string; // 开关类型
	active: boolean; // 是否处于激活状态
}

// SwitchObject 接口定义开关对象的结构
interface SwitchObject {
	[key: string]: { active: boolean; label: string }; // 动态键值，表示状态和对应的属性
	on: SwitchItem; // 开启状态的详细信息
	off: SwitchItem; // 关闭状态的详细信息
}

// 定义组件接收的 props
const props = defineProps<{
	switchObj: SwitchObject; // 开关对象，包含 'on' 和 'off' 状态的信息
	disabled?: boolean; // 可选属性，指示组件是否禁用
}>();

// 定义组件发出的事件
const emit = defineEmits(["selected"]);

// 处理开关点击事件
const handleSwitch = (key: string) => {
	// 如果组件被禁用，则不执行任何操作
	if (props.disabled) return;

	// 发出 selected 事件，并传递当前状态的 key（'on' 或 'off'）
	emit("selected", key);
};
</script>

<style scoped lang="scss">
.tabs_content {
	width: 141px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 3px;
	padding: 3px;
	background: var(--Bg-2);

	.tab {
		min-width: 66px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 3px;
		background: var(--Butter);
		color: var(--Text-1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
		cursor: pointer;

		&.tab_active {
			position: relative;
			z-index: 1;
			color: var(--Text-a);
			&::after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: var(--Theme);
				color: var(--Text-a);
				opacity: 0.6;
				border-radius: 3px;
				z-index: -1;
			}
		}

		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	.disabled {
		cursor: not-allowed;
	}
}
</style>
