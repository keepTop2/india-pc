<template>
	<div class="list-item" ref="itemsRef">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, ref, watch } from "vue";
interface cententItem {
	/**上级索引 */
	_key: number;
	/** 父级根元素 */
	root: HTMLElement | null;
}
const emit = defineEmits(["InView", "OutView", "domeUnmount", "domeResize"]);
const props = withDefaults(defineProps<cententItem>(), {
	_key: 0,
	root: null,
});

const state = reactive({
	_key: props?._key,
	width: 0,
	height: 0,
});

const itemsRef = ref();
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			// boundingClientRect 视口的位置和尺寸信息
			const params = {
				...state,
			};
			// console.info("位置情况", params._key, entry.boundingClientRect?.y);
			// console.info("根元素", params._key, entry.rootBounds?.y);
			// console.info("交叉情况", params._key, entry.intersectionRect);
			if (entry.isIntersecting) {
				// 元素进入视口时的逻辑
				emit("InView", params);
			} else {
				// 元素离开视口时的逻辑
				emit("OutView", params);
			}
		});
	},
	{
		root: props.root || null, // 默认为 viewport
		rootMargin: "0px", // 根据需要调整
		threshold: [0, 0.25, 0.75, 1], //触发回调的阈值 (默认: 0.5 )
		// threshold: [0.25, 0.75], //触发回调的阈值 (默认: 0.5 )
		// threshold: [0, 1], //触发回调的阈值 (默认: 0.5 )
	}
);

const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		/**界面响应时激活大小监听 */
		state.width = entry.contentRect.width;
		state.height = entry.contentRect.height;
		const params = {
			...state,
		};
		const activation = "domeChange";
		emit("domeResize", params, activation);
	}
});
onMounted(() => {
	state._key = props._key;
	if (itemsRef.value) {
		observer.observe(itemsRef.value);
		resizeObserver.observe(itemsRef.value);
	}
});
onBeforeUnmount(() => {
	const params = {
		...state,
	};
	emit("domeUnmount", params);
	observer.disconnect();
	resizeObserver.disconnect();
});
</script>

<style scoped lang="scss">
.list-item {
	width: 100%;
	height: auto;
	overflow: hidden;
}
</style>
