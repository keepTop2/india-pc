<template>
	<div class="video-box" v-if="!!videoUrl">
		<spinner-wrap :model-value="loading" v-if="isShowH5Video">
			<H5Video :url="videoUrl" @onIframeLoad="onIframeLoad"></H5Video>
		</spinner-wrap>
		<M3u8Video v-else :url="videoUrl"></M3u8Video>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import H5Video from "./h5Video.vue";
import M3u8Video from "./m3u8Video.vue";
import { SpinnerWrap } from "../Spinner";
import { ControlListType } from "/@/models/sportResultModel";
import { SportControlEnum } from "/@/enum/sportEnum/sportEnum";

// 定义props并设置默认值
const props = withDefaults(
	defineProps<{
		videoStreamingItem?: ControlListType;
	}>(),
	{}
);

const iframeLoaded = ref(false);
const loading = ref(false);

const videoUrl = ref("");
const isShowH5Video = computed(() => props.videoStreamingItem?.type == SportControlEnum.Animation);

const loadIframe = () => {
	if (isShowH5Video.value) {
		if (!iframeLoaded.value) {
			loading.value = true;
		}
	}
};

watch(
	() => props.videoStreamingItem,
	(newValue) => {
		loadIframe();
		videoUrl.value = newValue?.url as string;
	},
	{
		immediate: true,
		deep: true,
	}
);

const onIframeLoad = () => {
	if (!!videoUrl.value) {
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
