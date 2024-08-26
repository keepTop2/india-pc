<template>
	<div class="layout1_right">
		<Header></Header>
		<div class="router_main">
			<div class="router_w" :class="LayoutStore.getBigScreen ? 'bigScreen' : ''">
				<!-- 解决同一组件不同路由不重新载入问题 -->
				<template v-if="$route?.meta?.isServer">
					<router-view :key="$route.path" />
				</template>
				<!-- 解决同一组件重复载入问题 -->
				<router-view v-else />
			</div>
		</div>
		<Footer v-if="!currentRouterString.includes('gameDetail')"></Footer>
		<Controller v-if="!currentRouterString.includes('gameDetail')"></Controller>
	</div>
</template>

<script setup lang="ts">
import Header from "./components/header/header.vue";
import Footer from "./components/footer/footer.vue";
import { Controller } from "./components/controller";

import { useRoute } from "vue-router";
import { watch, ref } from "vue";
import { useLayoutStore } from "/@/stores/modules/layout";
const LayoutStore = useLayoutStore();

const route = useRoute();
let currentRouterString = ref("");
watch(
	() => route.path,
	(newPath, oldPath) => {
		console.log(newPath, "newpath", oldPath);
		currentRouterString.value = newPath;
	},
	{ immediate: true }
);
</script>

<style lang="scss" scoped>
.layout1_right {
	flex: auto;
	max-height: 100vh;
	overflow-y: auto;
	box-sizing: border-box;

	@include themeify {
		background: themed("Bg");
	}
}

.layout1_right::-webkit-scrollbar {
	display: none;
}

.router_main {
	// min-height: calc(100vh - 64px);
	box-sizing: border-box;

	.router_w {
		box-sizing: border-box;
		width: 100%;
		margin: 0 auto;
		padding: 0 60px;
		display: flex;
		justify-content: center;
		align-items: center;

		&.bigScreen {
			padding: 0px;
		}
	}
}
</style>
