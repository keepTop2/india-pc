<template>
	<div class="back-to-top-box" @click="scrollToTop">
		<svg-icon name="arrow_up" width="26px" height="15px"></svg-icon>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);
const scrollContainer = ref<HTMLElement | null>(null); // 用于存储滚动容器的引用

const checkVisibility = () => {
	if (scrollContainer.value) {
		visible.value = scrollContainer.value.scrollTop > 200;
	}
};

const scrollToTop = () => {
	scrollContainer.value?.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

onMounted(() => {
	scrollContainer.value = document.querySelector(".mainArea"); // 根据实际类名更改
	scrollContainer.value?.addEventListener("scroll", checkVisibility);
});

onUnmounted(() => {
	scrollContainer.value?.removeEventListener("scroll", checkVisibility);
});
</script>

<style scoped>
.back-to-top-box {
	position: fixed;
	z-index: 800;

	width: 60px;
	height: 60px;
	bottom: 90px;
	right: 20px;
	margin: 0 auto;
	color: #333;
	text-align: right;
	border-radius: 26px;
	background: var(--Bg3);
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
</style>
