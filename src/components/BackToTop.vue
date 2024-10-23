<template>
	<div class="max-width back-to-top-box">
		<button v-show="visible" class="back-to-top max-width" @click="scrollToTop">↑ Top</button>
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
	width: 100%;
	bottom: 20px;
	right: 50%;
	left: 50%;
	transform: translateX(-50%);
	max-width: 1350px;
	margin: 0 auto;
	color: #333;
	text-align: right;
}
</style>
