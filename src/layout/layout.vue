<template>
	<div class="layout" ref="domeRef">
		<left :is-collapse="state.isCollapse" />
		<div class="container">
			<Head />
			<transition name="slide-fade">
				<div class="mainArea">
					<container />
				</div>
			</transition>
		</div>
		<Modal />
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import Head from "./components/header/index.vue";
import left from "./components/left/left.vue";
import container from "./components/container/index.vue";
import { useMenuStore } from "/@/stores/modules/menu";
import Modal from "/@/components/Modal/index.vue";
const MenuStore = useMenuStore();
const state = reactive({
	//是否折叠
	isCollapse: false,
});
const domeRef = ref(null);
//监听div大小改变；
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const domWidth = (entry.target as any)?.offsetWidth;
		if (domWidth < 1460) {
			MenuStore.setCollapse(true);
		} else {
			MenuStore.setCollapse(false);
		}
	}
});

onMounted(() => {
	resizeObserver.observe(domeRef.value as any);
});

onUnmounted(() => {
	resizeObserver.unobserve(domeRef.value as any);
});
</script>

<style lang="scss" scoped>
.layout {
	display: flex;
}
.container {
	height: 100vh;
	flex: 1;
	background: var(--Bg);
}
.mainArea {
	flex: 1;
	justify-content: center;
	margin: 64px auto 0;
	overflow-y: auto;
	height: calc(100vh - 100px);
}
.mainArea::-webkit-scrollbar {
	display: none;
}
</style>
