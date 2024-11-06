<template>
	<div class="back-to-top-box">
		<img src="../../assets/common/kefu.png" alt="" />
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

<style scoped lang="scss">
.back-to-top-box {
	position: fixed;
	z-index: 1200;
	width: 100%;
	bottom: 20px;
	right: 20px;
	margin: 0 auto;
	color: #333;
	text-align: right;
	img {
		height: 60px;
		width: 60px;
		cursor: pointer;
	}
}
</style>
