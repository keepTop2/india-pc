<template>
	<div class="video-box" v-if="videoUrl">
		<spinner-wrap :model-value="loading" v-if="isH5Video">
			<H5Video :url="videoUrl" @onIframeLoad="onIframeLoad"></H5Video>
		</spinner-wrap>
		<M3u8Video v-else :url="videoUrl"></M3u8Video>
	</div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watchEffect } from "vue";
import H5Video from "./h5Video.vue";
import M3u8Video from "./m3u8Video.vue";
import { SpinnerWrap } from "../Spinner";

// 定义props并设置默认值
const props = withDefaults(
	defineProps<{
		/**视频链接地址 */
		videoStreamingUrl?: Object;
	}>(),
	{
		videoStreamingUrl: () => {
			return {};
		},
	}
);

/** 是否是H5视频 */
const isH5Video = ref(false);
const videoUrl = ref("");
const iframeLoaded = ref(false);
const loading = ref(false);

onBeforeMount(() => {
	getUrl();
	watchEffect(() => {
		getUrl();
	});
});

const getUrl = () => {
	const { streamingUrlH5, streamingUrl, streamingUrlCN, streamingUrlNonCN } = props.videoStreamingUrl as any;
	if (streamingUrlH5) {
		if (!iframeLoaded.value) {
			loading.value = true;
		}
		isH5Video.value = true;
		videoUrl.value = streamingUrlH5;
	}

	if (streamingUrl || streamingUrlCN || streamingUrlNonCN) {
		isH5Video.value = false;
		videoUrl.value = streamingUrl || streamingUrlNonCN || streamingUrlCN;
	}

	console.log(1111, props.videoStreamingUrl);
};

const onIframeLoad = () => {
	if (videoUrl.value) {
		iframeLoaded.value = true;
		loading.value = false;
	}
};
</script>

<style scoped lang="scss">
.video-box {
	width: 100%;
	height: 100%;

	> * {
		width: 100%;
		height: 100%;
	}
}
</style>
