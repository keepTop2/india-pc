<template>
	<div class="layout" ref="domeRef" :class="collapse ? 'collapse' : ''">
		<left :is-collapse="collapse" />
		<div class="container">
			<Head />
			<transition name="slide-fade">
				<div class="mainArea">
					<router-view id="router-view" />
					<Footer v-if="route.meta.showFooter" />
					<BackToTop />
				</div>
			</transition>
		</div>
		<Modal />
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import Head from "./components/header/index.vue";
import left from "./components/left/left.vue";
import { useMenuStore } from "/@/stores/modules/menu";
import Modal from "/@/components/Modal/index.vue";
import Footer from "./components/footer/index.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const MenuStore = useMenuStore();

const collapse = computed(() => {
	return MenuStore.getCollapse;
});
const lastWidth = ref(0);
const domeRef = ref(null);
// 监听div大小改变；
const resizeObserver = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const domWidth = (entry.target as any)?.offsetWidth;
		if (domWidth === lastWidth.value) return;
		lastWidth.value = domWidth;
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

	background: var(--Bg);
	width: calc(100vw - 260px);

	// margin-left: 260px;
}
.collapse {
	.container {
		width: calc(100vw - 64px);
		// margin-left: 64px;
	}
}

.mainArea {
	flex: 1;
	justify-content: center;
	margin: 64px auto 0;
	overflow-y: auto;
	height: calc(100vh - 64px);
	position: relative;
}
.mainArea::-webkit-scrollbar {
	display: none;
}
</style>
