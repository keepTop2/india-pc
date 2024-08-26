<template>
	<div class="countdown">
		<div class="card">
			{{ hours }}
			<span>{{ $t(`competition['小时']`) }}</span>
		</div>
		:
		<div class="card">
			{{ minutes }}

			<span>{{ $t(`competition['分钟']`) }}</span>
		</div>
		:
		<div class="card">
			{{ seconds }}
			<span>{{ $t(`competition['秒']`) }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineEmits, PropType } from 'vue';

const props = defineProps({
	time: {
		type: Number as PropType<number>,
		default: 3600, // 默认为 1 小时
	},
});

const emit = defineEmits(['countdownFinished']);

// 使用 ref 来保存倒计时剩余的总秒数
const totalSeconds = ref(props.time);

// 用于存储定时器的标识符
let intervalId: number | null = null;

// 计算小时、分钟和秒
const hours = computed(() => String(Math.floor(totalSeconds.value / 3600)).padStart(2, '0'));
const minutes = computed(() => String(Math.floor((totalSeconds.value % 3600) / 60)).padStart(2, '0'));
const seconds = computed(() => String(totalSeconds.value % 60).padStart(2, '0'));

// 开始倒计时
const startCountdown = () => {
	intervalId = window.setInterval(() => {
		if (totalSeconds.value > 0) {
			totalSeconds.value -= 1;
		} else {
			// 倒计时结束后清除定时器
			clearInterval(intervalId as number);
			intervalId = null;
			emit('countdownFinished');
		}
	}, 1000);
};

// 停止倒计时
const stopCountdown = () => {
	if (intervalId !== null) {
		clearInterval(intervalId);
		intervalId = null;
	}
};

// 重置倒计时
const resetCountdown = (newTime?: number) => {
	totalSeconds.value = newTime !== undefined ? newTime : props.time;
	stopCountdown();
	startCountdown();
};

// 在组件挂载时开始倒计时
onMounted(() => {
	startCountdown();
});

// 在组件卸载前清除定时器
onUnmounted(() => {
	stopCountdown();
});
</script>

<style scoped lang="scss">
/* 样式设置 */
.countdown {
	display: flex;
	gap: 10px;
	justify-content: space-between;
	align-items: center;
	@include themeify {
		color: themed('Tag1');
	}
}
.card {
	width: 60px;
	height: 64px;
	background-color: white;
	font-weight: 600;
	border-radius: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	font-weight: bold;
	flex-direction: column;
	@include themeify {
		background: themed('Bg2');
		border: 1px solid themed('Bg3');
		color: themed('Text_s');
		span {
			color: themed('Text1');
			font-size: 12px;
			font-weight: 400;
		}
	}
}
</style>
