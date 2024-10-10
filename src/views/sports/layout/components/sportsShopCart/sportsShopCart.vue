<template>
	<div
		ref="draggable"
		class="sports-container"
		:style="{ position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, pointerEvents: isDragging ? 'none' : 'auto' }"
		@mousedown="onMouseDown"
	>
		<div class="content">
			<div ref="cartContainer" class="sportsShopCart">
				<!-- 赛事购物车 -->
				<ShopCart v-if="shopCartTyp === 'league'" />
				<!-- 冠军购物车 -->
				<ChampionCart v-if="shopCartTyp === 'champion'" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, nextTick, watch } from "vue";
import { ShopCart, ChampionCart } from "./components/index";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

const ShopCatControlStore = useShopCatControlStore();

// 获取购物车类型
const shopCartTyp = computed(() => ShopCatControlStore.getShopCartType);

const draggable = ref<HTMLElement | null>(null);
const cartContainer = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const clickDisabled = ref(false);
let startMousePosition = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });
const cartHeight = ref(0); // 用于动态监听购物车高度
const isBottom = ref(false); // 标记是否吸底

// 使用 ResizeObserver 监听购物车高度变化
let resizeObserver: ResizeObserver | null = null;
const observeCartHeight = () => {
	if (cartContainer.value) {
		// 初始化观察器
		resizeObserver = new ResizeObserver(() => {
			updateCartHeight(); // 高度变化时更新
		});
		resizeObserver.observe(cartContainer.value); // 开始观察购物车容器
	}
};

// 停止监听高度变化
const stopObservingCartHeight = () => {
	if (resizeObserver && cartContainer.value) {
		resizeObserver.unobserve(cartContainer.value);
		resizeObserver.disconnect();
	}
};

// 更新购物车高度并限制拖动范围
const updateCartHeight = () => {
	nextTick(() => {
		if (cartContainer.value) {
			const windowHeight = window.innerHeight;
			cartHeight.value = cartContainer.value.offsetHeight; // 获取购物车的高度
			if (!isDragging.value && isBottom.value) {
				position.value.y = windowHeight - cartHeight.value; // 固定在底部
			} else {
				position.value.y = Math.min(position.value.y, windowHeight - cartHeight.value);
				position.value.y = Math.max(0, position.value.y); // 保证 Y 轴不能小于 0
			}
		}
	});
};

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

const onMouseMove = (event: MouseEvent) => {
	const distanceMoved = Math.sqrt(Math.pow(event.clientX - startMousePosition.value.x, 2) + Math.pow(event.clientY - startMousePosition.value.y, 2));
	if (distanceMoved > 5) {
		isDragging.value = true;
		clickDisabled.value = true;
		isBottom.value = false; // 取消吸底状态

		// 计算新的位置
		position.value.x = event.clientX - offset.value.x;
		position.value.y = event.clientY - offset.value.y;

		// 限制 X 轴拖拽范围在视口内
		position.value.x = Math.max(0, Math.min(window.innerWidth - draggable.value!.offsetWidth, position.value.x));

		// 限制 Y 轴拖拽范围在视口内
		position.value.y = Math.max(0, Math.min(window.innerHeight - cartHeight.value, position.value.y));
	}
};

const onMouseUp = () => {
	isDragging.value = false;
	// 检查是否吸底
	if (position.value.y >= window.innerHeight - cartHeight.value) {
		isBottom.value = true; // 标记吸底
		position.value.y = window.innerHeight - cartHeight.value; // 吸附到底部
	}
	window.removeEventListener("mousemove", onMouseMove);
	window.removeEventListener("mouseup", onMouseUp);
};

// 监听窗口变化，确保在窗口调整时购物车不会跑出可视范围
const updatePosition = () => {
	if (cartContainer.value) {
		const cartHeightNow = cartContainer.value.offsetHeight;

		position.value.x = Math.max(0, Math.min(window.innerWidth - draggable.value!.offsetWidth, position.value.x));

		// 如果拖动组件在底部，或者视口变化导致组件的底部已经接触或超过了视口底部
		if (isBottom.value || position.value.y >= window.innerHeight - cartHeightNow) {
			isBottom.value = true; // 标记吸底状态
			position.value.y = window.innerHeight - cartHeightNow; // 吸附到底部
		} else {
			position.value.y = Math.max(0, Math.min(window.innerHeight - cartHeightNow, position.value.y));
		}
	}
};

// 初始化
onMounted(() => {
	nextTick(() => {
		if (draggable.value) {
			// 获取视口尺寸
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;

			// 计算水平居中并底部贴底的位置
			position.value.x = (windowWidth - 520) / 2; // 水平居中
			position.value.y = windowHeight; // 初始在底部
			isBottom.value = true; // 初始吸底状态
		}
	});

	// 开始监听购物车高度变化
	observeCartHeight();

	// 监听窗口大小变化
	window.addEventListener("resize", updatePosition);
});

// 在组件卸载时移除事件监听
onBeforeUnmount(() => {
	window.removeEventListener("mousemove", onMouseMove);
	window.removeEventListener("mouseup", onMouseUp);
	window.removeEventListener("resize", updatePosition);

	// 停止监听购物车高度变化
	stopObservingCartHeight();
});
</script>

<style scoped lang="scss">
.sports-container {
	position: relative;
	z-index: 201;
}
</style>
