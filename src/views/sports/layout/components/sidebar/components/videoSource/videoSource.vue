<template>
	<div class="video-container">
		<video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto" width="100%" height="400" muted></video>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted } from "vue";
import videojs from "video.js";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";

const SidebarStore = useSidebarStore();
const videoPlayer = ref<HTMLVideoElement | null>(null);
let player: videojs.Player | null = null;

const isMuted = ref(false);

const videoSrc = "https://gcalic.v.myalicdn.com/gc/wgw05_1/index.m3u8?contentid=2820180516001";

// 监听视频地址的变化
watch(
	() => SidebarStore.getLiveUrl,
	(newSrc) => {
		console.log("直播地址变化");
		if (newSrc) {
			// 只有在有值时才初始化播放器
			initPlayer(newSrc);
		}
	}
);

onMounted(() => {
	initPlayer();
});

// 初始化视频播放器
const initPlayer = (videoSrc: string) => {
	if (videoPlayer.value) {
		if (player) {
			player.dispose(); // 重新生成时销毁旧的实例
		}
		player = videojs(videoPlayer.value, {
			sources: [
				{
					src: "https://gcalic.v.myalicdn.com/gc/wgw05_1/index.m3u8?contentid=2820180516001",
					type: "application/x-mpegURL",
				},
			],
			autoplay: true,
			muted: true,
			controls: true,
		});

		// 监听视频的静音状态
		player.on("volumechange", () => {
			isMuted.value = player!.muted();
		});
	}
};

// 在组件销毁时，销毁 video.js 实例
onBeforeUnmount(() => {
	if (player) {
		player.dispose();
	}
});
</script>

<style scoped>
.video-container {
	position: relative;
	width: 390px; /* 宽度 */
	height: 220px; /* 高度 */
}

.video-js {
	width: 100%; /* 自适应容器宽度 */
	height: 100%; /* 自适应容器高度 */
}

.controls {
	margin-top: 10px;
	display: flex;
	gap: 10px;
}

button {
	padding: 5px 10px;
	cursor: pointer;
}
</style>
