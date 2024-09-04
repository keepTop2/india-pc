<!-- src/components/Modal.vue -->
<template>
	<Transition name="slide-fade">
		<div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
			<div class="modal-content" @click.stop>
				<button class="close-btn" @click="close">×</button>
				<component :is="asyncComponent" />
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent, markRaw } from "vue";
import eventBus from "/@/utils/eventBus";
const visible = ref(false);
const asyncComponent = ref(null);

const show = (type: string) => {
	asyncComponent.value = markRaw(defineAsyncComponent(() => import(`./components/${type}.vue`)));
	visible.value = true;
};
const hide = () => {
	visible.value = false;
};
const close = () => {
	hide();
};
const handleOverlayClick = () => {
	// close();
};
onMounted(() => {
	eventBus.on("show-modal", (type) => {
		show(type);
		disableScroll();
	});
	eventBus.on("hide-modal", hide);
});
onUnmounted(() => {
	eventBus.off("show-modal", show);
	eventBus.off("hide-modal", hide);
	enableScroll();
});

// 禁用背景滚动
const disableScroll = () => {
	document.body.style.overflow = "hidden";
};
// 恢复背景滚动
const enableScroll = () => {
	document.body.style.overflow = "";
};
</script>

<style scoped lang="scss">
.modal-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	height: 100vh;
	width: 100vw;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow-y: auto;
}

.modal-content {
	border-radius: 8px;
	top: 0;
	margin: auto;
	position: relative;
	background: var(--Bg);
}

.close-btn {
	position: absolute;
	top: 10px;
	right: 10px;
	border: none;
	color: var(--Icon_1);
	background: transparent;
	font-size: 30px;
	cursor: pointer;
}
.slide-fade-enter-active {
	transition: all 0.2s ease-in;
}

.slide-fade-leave-active {
	transition: all 0.2s ease-out;
}

.slide-fade-enter-from {
	transform: translateX(-20px);
	opacity: 0;
}
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
</style>
