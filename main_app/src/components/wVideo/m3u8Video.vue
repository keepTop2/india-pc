<!--
 * @Author: WangMingxin
 * @Description: 视频 -文 件流格式 m3u8
-->

<template>
	<video ref="videoPlayer" :id="playerId" class="video-js"></video>
</template>
<script setup lang="ts">
import { ref, onMounted, shallowRef, onUnmounted, watch } from "vue";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { v4 as uuidv4 } from "uuid";
import pubSub from "/@/pubSub/pubSub";

// 定义props并设置默认值
const props = withDefaults(
	defineProps<{
		url?: string;
	}>(),
	{
		url: "",
	}
);

/**
 * @description: 生成指定长度的UUID；
 */
const generateShortUUID = (length: number): string => {
	const fullUUID: string = uuidv4(); // 生成完整的 UUID
	return fullUUID.replace(/-/g, "").substring(0, length); // 删除连接符，并截取指定长度的子串
};
const uuidDiv = generateShortUUID(8);

/** 视频播放器实例  不会深度响应 */
const videoPlayer = ref();
const player = shallowRef();
const playerId = ref("video" + uuidDiv);

/**
 * 初始化视频
 */
const initPlayer = () => {
	player.value = videojs(
		playerId.value,
		{
			sources: {
				src: props.url,
				type: "application/x-mpegURL", // 告诉videojs,这是一个m3u8流（默认格式）
			},
			controls: true,
			fluid: true,
			preload: "auto",
			height: "210px",
			// autoplay: true,
			playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 51],
			language: "zh-CN",
			nativeControlsForTouch: false,
		},
		() => {
			player.value?.play();
		}
	);
};

/**
 * 切换视频
 */
const changePlayer = () => {
	player.value?.pause();
	player.value?.src(props.url);
	player.value?.load();
	player.value?.play();
};

/**
 * 设置视频是否全屏播放
 */
const setFullScreen = ({ isFullScreen }: Record<"isFullScreen", boolean>) => {
	if (!player.value) {
		return;
	}

	if (!player.value.isFullscreen?.() && isFullScreen) {
		player.value.requestFullscreen();
	}

	if (player.value.isFullscreen?.() && !isFullScreen) {
		player.value.exitFullscreen();
	}
};

watch(
	() => props.url,
	(newUrl, oldUrl) => {
		if (newUrl !== oldUrl) {
			console.log(11111111, newUrl);
			changePlayer();
		}
	}
);

onMounted(() => {
	initPlayer();
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.onExpandAngCollapse.eventName, setFullScreen);
});

onUnmounted(() => {
	player.value?.dispose();
});
</script>
