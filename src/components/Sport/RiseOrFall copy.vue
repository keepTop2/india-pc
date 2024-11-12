<!--
 * @Author: WangMingxin
 * @Description: 体育赔率组件(上升下降标识)
-->
<template>
	<div class="RiseOrFall-container">
		<div class="centent" :class="statusValue[state?.status as keyof number & 3]">
			<div class="icon">
				<svg-icon name="direction" class="directionSvg"></svg-icon>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";

interface RiseOrFallType {
	/** 宽度 */
	// width?: number;
	// /**高度 */
	// height?: number;
	// /**右边距 */
	// right?: number;
	/** 动画执行时长 */
	time?: number;
	/** 状态 1:上升 2:下降 3:无状态  */
	status?: number;
}
const props = withDefaults(defineProps<RiseOrFallType>(), {
	// height: 20,
	// width: 14,
	// right: 10,
	time: 4500,
	status: 1 as number,
});

const state: RiseOrFallType = reactive({
	// height: 20,
	// width: 14,
	// right: 10,
	time: props.time,
	status: 1 as number & string,
});

const statusValue = {
	1: "rise",
	2: "fall",
	3: "unDome",
};

// const timer = ref();

const emit = defineEmits(["animationEnd"]);

// const setTime = () => {
// 	if (state.time) {
// 		if (state.status == 3) {
// 			clearTimeout(timer.value);
// 		} else {
// 			clearTimeout(timer.value);
// 			timer.value = setTimeout(() => {
// 				// 动画结束对外暴露事件
// 				emit("animationEnd");
// 				state.status = 3;
// 			}, state.time);
// 		}
// 	}
// };

let start: number | null = null;
let animationFrameId: number | null = null;
//使用 requestAnimationFrame 替代setTimeout
const setTime = () => {
	if (state.time) {
		if (state.status == 3) {
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
			}
		} else {
			if (animationFrameId !== null) {
				cancelAnimationFrame(animationFrameId);
			}
			start = null;
			const step = (timestamp: number) => {
				if (!start) start = timestamp;
				const elapsed = timestamp - start;
				if (elapsed >= (state.time as number)) {
					emit("animationEnd");
					state.status = 3;
				} else {
					animationFrameId = requestAnimationFrame(step);
				}
			};
			animationFrameId = requestAnimationFrame(step);
		}
	}
};

watch(
	() => props.status,
	(newValue, oldValue) => {
		state.status = newValue;
	},
	{
		immediate: true,
	}
);

watch(
	() => state.status,
	(newValue, oldValue) => {
		setTime();
	}
);

setTime();

defineExpose({ state });
</script>

<style scoped lang="scss">
.RiseOrFall-container {
	// position: absolute;
	// right: 1px;
	// top: 0px;
	// height: 100%;
	// width: 12px;

	.centent {
		height: 100%;
		width: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		animation: scaleout 1s infinite ease-in-out;

		&.unDome {
			display: none;
		}

		.icon {
			display: none;
			width: 12px;
			height: 12px;
			// display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.directionSvg {
				height: 100%;
				width: 100%;
			}
		}

		&.rise {
			.icon {
				display: flex;
				transform: rotate(0deg);
			}

			color: var(--Theme);
		}

		&.fall {
			.icon {
				display: flex;
				transform: rotate(180deg);
			}

			color: var(--success);
		}
	}
}

@keyframes scaleout {
	0% {
		transform: scale(1);
	}

	100% {
		transform: scale(1.1);
		opacity: 0;
	}
}
</style>
