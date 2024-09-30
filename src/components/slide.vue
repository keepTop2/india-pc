<template>
	<div class="slider-container">
		<!-- 滑动内容区域 -->
		<div class="slider-content" ref="content" @mousedown="startDrag" @touchstart="startDrag">
			<!-- 使用插槽以允许动态插入内容 -->
			<slot />
		</div>
		<!-- 隐藏的滑动条 -->
		<div class="slider-bar">
			<div class="slider-thumb" ref="thumb"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";

export default defineComponent({
	setup() {
		// 用于引用内容区域的 DOM 元素
		const content = ref<HTMLDivElement | null>(null);
		// 用于引用滑块的 DOM 元素
		const thumb = ref<HTMLDivElement | null>(null);
		// 标记是否正在拖动
		const isDragging = ref(false);
		// 存储拖动开始时的鼠标 X 坐标
		const startX = ref(0);
		// 存储拖动开始时内容区域的 scrollLeft 值
		const startScrollLeft = ref(0);

		// 更新滑块位置的函数
		const updateThumbPosition = () => {
			if (content.value && thumb.value) {
				const contentWidth = content.value.scrollWidth; // 内容区域的总宽度
				const containerWidth = content.value.offsetWidth; // 内容区域的可见宽度
				const thumbWidth = (containerWidth / contentWidth) * containerWidth; // 滑块宽度

				// 设置滑块宽度
				thumb.value.style.width = `${thumbWidth}px`;

				// 计算滑块的位置
				const scrollRatio = content.value.scrollLeft / (contentWidth - containerWidth);
				thumb.value.style.transform = `translateX(${scrollRatio * (containerWidth - thumbWidth)}px)`;
			}
		};

		// 开始拖动时调用的函数
		const startDrag = (event: MouseEvent | TouchEvent) => {
			isDragging.value = true; // 标记为正在拖动
			if (event instanceof MouseEvent) {
				startX.value = event.pageX; // 鼠标 X 坐标
				startScrollLeft.value = content.value?.scrollLeft || 0; // 内容区域的 scrollLeft 值
			} else if (event instanceof TouchEvent) {
				startX.value = event.touches[0].pageX; // 触摸 X 坐标
				startScrollLeft.value = content.value?.scrollLeft || 0; // 内容区域的 scrollLeft 值
			}

			// 绑定拖动和结束事件
			window.addEventListener("mousemove", onDrag);
			window.addEventListener("touchmove", onDrag);
			window.addEventListener("mouseup", stopDrag);
			window.addEventListener("touchend", stopDrag);
		};

		// 拖动中调用的函数
		const onDrag = (event: MouseEvent | TouchEvent) => {
			if (!isDragging.value || !content.value || !thumb.value) return;

			let x = 0;
			if (event instanceof MouseEvent) {
				x = event.pageX; // 获取鼠标 X 坐标
			} else if (event instanceof TouchEvent) {
				x = event.touches[0].pageX; // 获取触摸 X 坐标
			}

			const dx = x - startX.value; // 计算拖动距离
			const containerWidth = content.value.offsetWidth; // 内容区域的可见宽度
			const contentWidth = content.value.scrollWidth; // 内容区域的总宽度
			const thumbWidth = thumb.value.offsetWidth; // 滑块宽度
			const maxScrollLeft = contentWidth - containerWidth; // 最大的 scrollLeft 值

			// 计算新的 scrollLeft 值，并限制在有效范围内
			let scrollLeftNew = startScrollLeft.value - (dx / (containerWidth - thumbWidth)) * maxScrollLeft;
			scrollLeftNew = Math.max(0, Math.min(scrollLeftNew, maxScrollLeft));
			content.value.scrollLeft = scrollLeftNew;

			updateThumbPosition(); // 更新滑块位置
		};

		// 结束拖动时调用的函数
		const stopDrag = () => {
			isDragging.value = false; // 标记为不再拖动
			// 移除拖动和结束事件的监听
			window.removeEventListener("mousemove", onDrag);
			window.removeEventListener("touchmove", onDrag);
			window.removeEventListener("mouseup", stopDrag);
			window.removeEventListener("touchend", stopDrag);
		};

		// 组件挂载后调用
		onMounted(() => {
			updateThumbPosition(); // 初始化滑块位置
			window.addEventListener("resize", updateThumbPosition); // 监听窗口大小变化
		});

		// 组件卸载后调用
		onUnmounted(() => {
			window.removeEventListener("resize", updateThumbPosition); // 移除窗口大小变化监听
		});

		return {
			startDrag,
			content,
			thumb,
		};
	},
});
</script>

<style scoped>
.slider-container {
	position: relative; /* 设置容器为相对定位 */
	width: 100%; /* 宽度为 100% */
	height: 100%; /* 高度为 100% */
}

.slider-content {
	display: flex; /* 使用 flexbox 布局 */
	overflow-x: auto; /* 允许水平滚动 */
	white-space: nowrap; /* 防止换行 */
	cursor: grab; /* 拖动时显示抓取光标 */
	-webkit-touch-callout: none; /*系统默认菜单被禁用*/
	-webkit-user-select: none; /*webkit浏览器*/
	-khtml-user-select: none; /*早期浏览器*/
	-moz-user-select: none; /*火狐*/
	-ms-user-select: none; /*IE10*/
}

/* 隐藏滑动条和滑块 */
.slider-bar {
	display: none; /* 隐藏滑动条 */
}

.slider-thumb {
	display: none; /* 隐藏滑块 */
}

/* 隐藏滚动条样式 */
.slider-content::-webkit-scrollbar {
	display: none; /* 隐藏滚动条 */
}
</style>
