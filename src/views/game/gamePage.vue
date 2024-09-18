<template>
	<div class="max-width">
		<div class="mt_30 mb_28 Text1 fs_14 curp">赌场>游戏供应商><span class="Text_s">供应商名称</span></div>
		<iframe
			class="ifrmeContainerRef"
			ref="videoFrame"
			:src="state.source"
			frameborder="0"
			scrolling="no"
			:style="{ width: '100%', height: (width > 1350 ? 1350 : width) * 0.5625 + 'px' }"
			sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
		></iframe>
	</div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { gameApi } from "/@/api/game";
import router from "/@/router";
import Common from "/@/utils/common";
import { onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";
const { width, height } = useWindowSize();
const state: any = reactive({
	source: "",
	userAccount: "",
	type: "",
});
onMounted(() => {
	state.source = useRoute().query.source;
});
const loginGame = () => {};
</script>

<style scoped>
.ifrmeContainerRef {
	height: 900px;
	width: 100%;
}
</style>
