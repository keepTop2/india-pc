<template>
	<div ref="draggable" class="draggable" :style="{ position: 'fixed', left: `${position.x}px`, top: `${position.y}px` }" @mousedown="onMouseDown" v-show="modelValue">
		<div class="parent">
			<div class="child curp">
				<div class="curp">
					<img class="close" src="/@/assets/common/redbagRainCountdownClose.png" alt="" @click.self="closeRedbagRainCountdown" />
				</div>
				<img class="CountdownImg" src="/@/assets/common/redbagRainCountdown.png" alt="" @click.self="handleClickCountdown" />
				<div class="countdown" @click="handleClickCountdown">
					<p v-if="countdown > 0">倒计时</p>
					<p>{{ countdown > 0 ? Common.convertMilliseconds(countdown * 1000) : "进行中" }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import pubsub from "../pubSub/pubSub";
import { webSocketMsgTopicEnum } from "/@/enum/webSocketEnum";
import { useCountdown } from "../hooks/countdown";
import { activityApi } from "../api/activity";
import { useActivityStore } from "../stores/modules/activity";
import { useModalStore } from "/@/stores/modules/modalStore";
import Common from "../utils/common";

const modalStore = useModalStore();
const activityStore = useActivityStore();
const { countdown, startCountdown, stopCountdown } = useCountdown();
const draggable = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });
const clickDisabled = ref(false);
let startMousePosition = ref({ x: 0, y: 0 });

const props = defineProps({
	modelValue: Boolean,
	redBagInfo: {} as any,
});
const emit = defineEmits(["update:modelValue"]);

// 订阅红包雨消息
// pubsub.subscribe(webSocketMsgTopicEnum.redBagRain, (data) => {
// 	console.log("Received:", data);
// });
// 打开红包雨页面
const handleClickCountdown = async () => {
	if (!clickDisabled.value) {
		await activityApi.getRedBagInfo().then(async (res) => {
			if (res.code == Common.ResCode.SUCCESS) {
				await activityStore.setCurrentActivityData({ ...res.data });
				modalStore.openModal("RED_BAG_RAIN");
			}
		});
	}
};

watch(
	() => countdown.value,
	() => {
		if (countdown.value == 0) {
			stopCountdown();
		}
	},
	{ once: true }
);
watch(
	() => props.redBagInfo,
	() => {
		if (props.redBagInfo?.advanceTime) {
			startCountdown(props.redBagInfo.advanceTime);
		}
	},
	{ once: true }
);
// 拖拽功能
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
// 拖拽功能
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
// 拖拽功能
const onMouseUp = () => {
	if (isDragging.value) {
		isDragging.value = false;
	}
	// 移除事件监听
	window.removeEventListener("mousemove", onMouseMove);
	window.removeEventListener("mouseup", onMouseUp);
};
// 拖拽功能
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
const closeRedbagRainCountdown = () => {
	emit("update:modelValue", false);
};
// 初始化
onMounted(() => {
	const parentElement = draggable.value?.parentElement;
	if (parentElement) {
		const parentRect = parentElement?.getBoundingClientRect();
		// 初始化位置靠右对齐
		position.value.x = parentRect.right - 115; // 右对齐
		position.value.y = 500; // Y 轴限制仍在窗口内
	}
	window.addEventListener("resize", updatePosition); // 添加窗口变化监听

	pubsub.subscribe("/activity/redBagRain/end", () => {
		closeRedbagRainCountdown();
	});
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
		.close {
			width: 16.5px;
			height: 16.5px;
		}
		.CountdownImg {
			width: 114.214px;
			height: 97.5px;
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
