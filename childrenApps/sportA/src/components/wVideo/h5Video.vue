<!--
 * @Author: WangMingxin
 * @Description: 视屏H5
-->
<template>
	<div ref="domeRef" class="container-main">
		<iframe ref="videoFrame" :src="url" frameborder="0" scrolling="no" sandbox="allow-same-origin allow-scripts allow-popups" @load="onIframeLoad"></iframe>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

//定义props并设置默认值
const props = withDefaults(
	defineProps<{
		/**视频链接地址 */
		url?: string;
	}>(),
	{
		url: "",
	}
);

const emit = defineEmits(["onIframeLoad"]);

/**外层容器 */
const domeRef = ref(null);
/*视频H5  */
const videoFrame = ref();
//监听div大小改变；
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		/**界面响应时激活大小监听 */
		const width = entry.contentRect.width;
		const height = entry.contentRect.height;

		videoFrame.value.style.width = `${width}px`;
		videoFrame.value.style.height = `${height}px`;
	}
});

const onIframeLoad = () => emit("onIframeLoad");

onMounted(() => {
	resizeObserver.observe(domeRef.value as any);
});

onUnmounted(() => {
	try {
		resizeObserver.unobserve(domeRef.value as any);
	} catch (error) {}
});
</script>

<style scoped lang="scss">
.container-main {
	height: 100%;
	width: 100%;
	min-height: 100px;
	overflow: hidden;
	position: relative;

	:deep() {
		.el-scrollbar {
			.el-scrollbar__view {
				display: flex;
				align-items: start;
				justify-content: center;
				position: relative;
			}
		}
	}
	iframe {
		// width: 100%;
		// height: 100%;
		aspect-ratio: 16/9;
		display: flex;
		align-items: center;
		justify-content: left;
		// background: red;
	}
	.hall-plan {
		padding-top: 34px;
	}
}
</style>
