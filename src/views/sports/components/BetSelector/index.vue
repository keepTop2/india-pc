<template>
	<div class="bet-selector" :class="badgeClass">
		<!-- 内容 -->
		<slot></slot>
		<!-- 角标 购物车 -->
		<svg-icon v-if="isShopCar" class="badge-shop-car" :class="badgeClass" :name="'direction'" size="18px" />
		<!-- 角标 -->
		<span v-else class="badge" :class="badgeClass" />
	</div>
</template>

<script setup lang="ts">
import { watch, ref, onUnmounted } from "vue";
const props = defineProps({
	value: Number,
	isRun: { type: Boolean, default: true },
	isShopCar: Boolean,
	id: { type: String, required: false },
});

const badgeClass = ref<"up" | "down" | "normal">("normal");
const timer = ref<number | null>(null);

// 计算类名的逻辑优化
const updateBadgeClass = (newVal: number | undefined, oldVal: number | undefined, oldId: string | undefined, newId: string | undefined) => {
	if (!props.isRun || newVal === undefined || oldVal === undefined || newId !== oldId) {
		clearBadge();
		return;
	}
	badgeClass.value = oldVal > newVal ? "down" : oldVal < newVal ? "up" : "normal";
	clearTimer();
	timer.value = window.setTimeout(clearBadge, 2000);
};

// 清除状态的辅助方法
const clearBadge = () => (badgeClass.value = "normal");
const clearTimer = () => {
	if (timer.value !== null) clearTimeout(timer.value);
};

/**
 * 监控 `value` 的变化
 * 由于虚拟列表会替换组件数据，故组件从外部接收唯一id，防止快速滚动虚拟列表数据替换导致的错误上升下降信号
 */
watch([() => props.value, () => props.id], ([newVal, newId], [oldVal, oldId]) => updateBadgeClass(newVal, oldVal, newId, oldId));

onUnmounted(() => clearTimer());
</script>

<style scoped lang="scss">
.bet-selector {
	position: relative;
	height: 100%;
	width: 100%;
	.badge {
		position: absolute;
		transition: opacity 0.5s;
		&.normal {
			opacity: 0;
		}
		&.up,
		&.down {
			// animation: fadeOut 3s forwards; /* 3秒的动画，使用forwards保持最后状态 */
			position: absolute;
			right: 0px;
			border-top-right-radius: 2px;
			opacity: 1;
			animation: blinkAnimation 1s ease-in-out 3;
		}

		@keyframes blinkAnimation {
			0% {
				opacity: 1; /* 完全可见 */
			}
			50% {
				opacity: 0; /* 完全透明 */
			}
			100% {
				opacity: 1; /* 完全可见 */
			}
		}
		&.up {
			border-top: 4px solid red;
			border-right: 4px solid red;
			border-left: 4px solid transparent;
			border-bottom: 4px solid transparent;
			top: 0px;
		}
		&.down {
			border-top: 4px solid transparent;
			border-right: 4px solid green;
			border-left: 4px solid transparent;
			border-bottom: 4px solid green;
			bottom: 0px;
		}
	}
	:deep(.value) {
		transition: color 0.5s;
	}
	&.up {
		:deep(.value) {
			color: var(--Theme) !important;
		}
	}
	&.down {
		:deep(.value) {
			color: var(--Success) !important;
		}
	}

	.badge-shop-car {
		position: absolute;
		right: -20px;
		top: 2px;
		transition: opacity 0.5s;
		opacity: 0;
		&.up,
		&.down {
			opacity: 1;
			animation: blinkAnimation 1s ease-in-out 3;
		}
		&.up {
			color: var(--Theme) !important;
		}
		&.down {
			color: var(--Success) !important;
			transform: rotate(180deg);
		}
		@keyframes blinkAnimation {
			0% {
				opacity: 1; /* 完全可见 */
			}
			50% {
				opacity: 0; /* 完全透明 */
			}
			100% {
				opacity: 1; /* 完全可见 */
			}
		}
	}
}
</style>
