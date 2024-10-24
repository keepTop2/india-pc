<template>
	<div class="bet-selector" :class="[badgeClass]">
		<!-- 内容 -->
		<slot></slot>
		<!-- 角标 购物车-->
		<svg-icon v-if="isShopCar" class="badge-shop-car" :class="[badgeClass]" :name="'direction'" size="18px" />
		<!-- 角标 -->
		<span v-else class="badge" :class="[badgeClass]" />
	</div>
</template>

<script setup lang="ts">
import { watch, ref, Ref, onBeforeUnmount } from "vue";

const props = defineProps({
	// 监控的值
	value: {
		type: Number,
	},
	// 非滚盘恢复nromal状态
	isRun: {
		type: Boolean,
		default: true,
	},
	isShopCar: {
		type: Boolean,
	},
});

const badgeClass = ref<"up" | "down" | "normal">("normal");

const timer: Ref<number | null> = ref(null);

watch(
	() => props.value,
	(newVal, oldValue) => {
		console.log(newVal, oldValue, "oldValue===");

		if (newVal && oldValue && props.isRun) {
			// 比较新值跟旧值，如果三秒钟未更新，及恢复normal状态
			badgeClass.value = oldValue > newVal ? "down" : oldValue < newVal ? "up" : "normal";
			clearTimeout(timer.value as number);
			timer.value = window.setTimeout(() => {
				badgeClass.value = "normal";
			}, 2000);
		} else {
			clearTimeout(timer.value as number);
			badgeClass.value = "normal";
		}
	}
);

onBeforeUnmount(() => clearTimeout(timer.value as number));
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
