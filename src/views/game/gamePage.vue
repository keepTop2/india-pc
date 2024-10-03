<template>
	<div class="max-width pr_10 pl_10">
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
import { reactive, onMounted, watch } from "vue";
import { useWindowSize } from "@vueuse/core";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useUserStore } from "/@/stores/modules/user";
const { width, height } = useWindowSize();
const state: any = reactive({
	source: "",
	userAccount: "",
	type: "",
});
const route = useRoute();

onMounted(() => {
	state.source = route.query.source;
});
onBeforeRouteLeave(() => {
	useUserStore().initUserInfo();
});
</script>

<style scoped>
.max-width {
	overflow: auto;
}

</style>
