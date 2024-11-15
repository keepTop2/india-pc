<template>
	<div class="max-width pr_10 pl_10 wrapper">
		<div class="mt_30 mb_28 Text1 fs_14 flex_space-between">
			<div>赌场>游戏供应商><span class="Text_s">供应商名称</span></div>

			<div class="curp">
				<span>新窗口打开</span>
				<span @click="openIframeFullscreen">全屏</span>
				<span>收藏</span>
				<span>刷新</span>
				<span>关闭</span>
			</div>
		</div>
		<iframe
			class="ifrmeContainerRef"
			ref="gameFrame"
			:src="state.source"
			frameborder="0"
			scrolling="no"
			:style="{ width: '100%', height: (width > 1350 ? 1350 : width) * 0.5625 + 'px' }"
			sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
		></iframe>
	</div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useUserStore } from "/@/stores/modules/user";
import { gameApi } from "/@/api/game";
import Common from "/@/utils/common";
import qs from "qs";
import showToast from "/@/hooks/useToast";
const show = ref(true);
const { width, height } = useWindowSize();
const state: any = reactive({
	source: "",
	userAccount: "",
	type: "",
});
const gameFrame: any = ref(null);
const route = useRoute();

onMounted(() => {
	state.source = route.query.source;
	const params = route.query;

	gameApi.loginGame(params).then((res) => {
		if (res.code === 10000) {
			const { source, userAccount, type } = res.data;
			switch (type) {
				case "url": {
					state.source = source;
					state.userAccount = userAccount;
					state.type = type;
					break;
				}
				case "html": {
					const blob: any = new Blob([source], { type: "text/html" });
					state.source = URL.createObjectURL(blob);
					state.userAccount = userAccount;
					state.type = type;
					break;
				}
				case "token": {
					const params = {
						session_id: source,
						lang: "zh-CN",
						login_id: userAccount,
					};
					const url = Common.getUrl();
					state.source = url + `/api/cash/auth?${qs.stringify(params)}`;
					state.userAccount = userAccount;
					state.type = type;
					break;
				}
				default:
					break;
			}
		} else {
			showToast(res.message);
		}
	});
});
onBeforeRouteLeave(() => {
	useUserStore().initUserInfo();
});
function openIframeFullscreen() {
	if (gameFrame.value && gameFrame.value.requestFullscreen) {
		gameFrame.value.requestFullscreen();
	} else if (gameFrame.value && (gameFrame.value as any).webkitRequestFullscreen) {
		// Safari
		(gameFrame.value as any).webkitRequestFullscreen();
	} else if (gameFrame.value && (gameFrame.value as any).mozRequestFullScreen) {
		// Firefox
		(gameFrame.value as any).mozRequestFullScreen();
	} else if (gameFrame.value && (gameFrame.value as any).msRequestFullscreen) {
		// IE/Edge
		(gameFrame.value as any).msRequestFullscreen();
	}
}
</script>

<style>
.ifrmeContainerRef {
	width: 100%;
	height: 100%;
}
</style>
