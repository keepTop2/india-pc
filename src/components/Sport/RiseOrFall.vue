<template>
	<div v-if="isVisible" :class="['triangle-indicator', indicatorClass]"></div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, watch, onMounted, onBeforeUnmount } from "vue";

// 定义属性
const props = defineProps<{
	status: 1 | 2 | 3; // 使用数字状态
}>();

// 定义事件发射器
const emit = defineEmits<{
	(e: "animationEnd"): void;
	(e: "update:status", value: 1 | 2 | 3): void; // 新增事件用于更新 status 状态
}>();

let timer: ReturnType<typeof setTimeout> | null = null;

// 状态映射字典
const statusMap = {
	1: "up", // 上升
	2: "down", // 下降
	3: "none", // 无状态
};

// 计算属性：确定指示器的 CSS 类
const indicatorClass = computed(() => {
	switch (statusMap[props.status]) {
		case "up":
			return "up";
		case "down":
			return "down";
		default:
			return "";
	}
});

// 计算属性：确定组件是否可见
const isVisible = computed(() => props.status !== 3); // 3 为 'none'

// 计时器函数
const startTimer = () => {
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(() => {
		emit("animationEnd");
		emit("update:status", 3); // 定时器结束时，将 status 更新为 3
		timer = null; // 清空计时器引用
	}, 3000);
};

// 监听状态变化，启动计时器
watch(
	() => props.status,
	(newStatus) => {
		if (newStatus === 1 || newStatus === 2) {
			startTimer();
		} else if (timer) {
			// 如果状态为 3，清除定时器
			clearTimeout(timer);
			timer = null;
		}
	}
);

// 在组件挂载时启动计时器
onMounted(() => {
	if (props.status === 1 || props.status === 2) {
		startTimer();
	}
});

// 在组件卸载前清除计时器
onBeforeUnmount(() => {
	if (timer) {
		clearTimeout(timer);
	}
});
</script>

<style scoped>
.triangle-indicator {
	width: 0;
	height: 0;
	margin: 0 auto;
	transition: all 0.2s ease-in-out; /* 添加过渡动画 */
}

/* 上升状态的三角形（红色） */
.triangle-indicator.up {
	position: absolute;
	top: 0px;
	right: 0px;
	border-top-right-radius: 2px;
	border-top: 4px solid red;
	border-right: 4px solid red;
	border-left: 4px solid transparent;
	border-bottom: 4px solid transparent;
}

/* 下降状态的三角形（绿色） */
.triangle-indicator.down {
	position: absolute;
	bottom: 0px;
	right: 0px;
	border-bottom-right-radius: 2px;
	border-top: 4px solid transparent;
	border-right: 4px solid green;
	border-left: 4px solid transparent;
	border-bottom: 4px solid green;
}
</style>
