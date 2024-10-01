<template>
	<div ref="draggable" class="draggable" :style="{ position: 'fixed', left: `${position.x}px`, top: `${position.y}px` }" @mousedown="onMouseDown">
		<div class="parent">
			<div class="child curp">
				<div class="curp">
					<img src="/@/assets/common/redbagRainCountdownClose.svg" alt="" @click.self="closeRedbagRainCountdown" />
				</div>
				<img src="/@/assets/common/redbagRainCountdown.svg" alt="" @click.self="handleClickCountdown" />
				<div class="countdown" @click="handleClickCountdown">
					<p>倒计时</p>
					<p>{{ countdown }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import RED_BAG_RAIN from "../views/activity/activityType/RED_BAG_RAIN/index.vue";
import pubsub from "../pubSub/pubSub";
import { webSocketMsgTopicEnum } from "/@/enum/webSocketEnum";
import { useCountdown } from "../hooks/countdown";
import { activityApi } from "../api/activity";
import { useActivityStore } from "../stores/modules/activity";

import { useModalStore } from "/@/stores/modules/modalStore";
const modalStore = useModalStore();
const activityStore = useActivityStore();
const { countdown } = useCountdown();
const draggable = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });
const clickDisabled = ref(false);
let startMousePosition = ref({ x: 0, y: 0 });
pubsub.subscribe(webSocketMsgTopicEnum.redBagRain, (data) => {
	console.log("Received:", data);
});
const handleClickCountdown = async () => {
	if (!clickDisabled.value) {
		await activityApi.getRedBagInfo().then((res) => {
			activityStore.setCurrentActivityData({ ...res.data });
		});
		modalStore.openModal("RED_BAG_RAIN");
	}
};

const closeRedbagRainCountdown = () => {
	// Implement close functionality if needed
};

const onMouseDown = (event: MouseEvent) => {
	event.preventDefault();
	clickDisabled.value = false;
	startMousePosition.value = { x: event.clientX, y: event.clientY };

	offset.value = {
		x: event.clientX - position.value.x,
		y: event.clientY - position.value.y,
	};

	// 添加事件监听
	window.addEventListener("mousemove", onMouseMove);
	window.addEventListener("mouseup", onMouseUp);
};

const onMouseMove = (event: MouseEvent) => {
	const distanceMoved = Math.sqrt(Math.pow(event.clientX - startMousePosition.value.x, 2) + Math.pow(event.clientY - startMousePosition.value.y, 2));
	if (distanceMoved > 5) {
		isDragging.value = true;
		clickDisabled.value = true;
		// 获取父元素的父元素
		const grandParentElement: any = draggable.value?.parentElement;
		if (grandParentElement) {
			const grandParentRect = grandParentElement?.getBoundingClientRect(); // 获取父元素的父元素的边界
			position.value.x = event.clientX - offset.value.x;
			position.value.y = event.clientY - offset.value.y;
			// 限制拖动范围在父元素的父元素的 x 轴范围内
			position.value.x = Math.max(grandParentRect.left, Math.min(grandParentRect.right - 100, position.value.x));
			position.value.y = Math.max(64, Math.min(window.innerHeight - 100, position.value.y)); // Y 轴限制
		}
	}
};

const onMouseUp = () => {
	if (isDragging.value) {
		isDragging.value = false;
	}
	// 移除事件监听
	window.removeEventListener("mousemove", onMouseMove);
	window.removeEventListener("mouseup", onMouseUp);
};
const updatePosition = () => {
	const parentElement = draggable.value?.parentElement; // 获取父元素
	const grandParentElement: any = draggable.value?.parentElement;
	const grandParentRect = grandParentElement?.getBoundingClientRect(); // 获取父元素的父元素的边界
	if (parentElement) {
		// 设置初始 Y 轴位置
		position.value.x = Math.max(grandParentRect.left, Math.min(grandParentRect.right - 100, position.value.x));
		position.value.y = Math.max(64, Math.min(window.innerHeight - 100, position.value.y)); // Y 轴限制
	}
};

onMounted(() => {
	const parentElement = draggable.value?.parentElement;
	if (parentElement) {
		const parentRect = parentElement?.getBoundingClientRect();
		// 初始化位置靠右对齐
		position.value.x = parentRect.right - 115; // 右对齐
		position.value.y = 500; // Y 轴限制仍在窗口内
	}
	window.addEventListener("resize", updatePosition); // 添加窗口变化监听
});
// 在组件卸载时移除事件监听
onBeforeUnmount(() => {
	window.removeEventListener("mousemove", onMouseMove);
	window.removeEventListener("mouseup", onMouseUp);
});
</script>

<style lang="scss">
.draggable {
	cursor: grab;
	user-select: none; /* 防止文本选择 */

	position: absolute;
	z-index: 1000;
}
.parent {
	cursor: move;
	z-index: 500;
	transition: all 0.2s ease;
	cursor: grab; /* 显示抓取光标 */
	.child {
		text-align: right;
		position: relative;
		animation: shake 3s ease infinite;
		.countdown {
			position: absolute;
			bottom: 5px;
			left: 50%;
			transform: translateX(-50%);
			color: var(--Text_a);
			text-align: center;
		}
	}
	@keyframes shake {
		0% {
			transform: translateX(0) rotate(0deg);
		}
		5% {
			transform: translateX(-10px) rotate(-5deg);
		}
		10% {
			transform: translateX(10px) rotate(5deg);
		}
		15% {
			transform: translateX(-10px) rotate(-5deg);
		}
		20% {
			transform: translateX(10px) rotate(5deg);
		}
		25% {
			transform: translateX(0) rotate(0deg);
		}
		100% {
			transform: translateX(0) rotate(0deg);
		}
	}
}
</style>
