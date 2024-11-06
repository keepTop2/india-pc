<template>
	<div class="back-to-top-box">
		<img src="../../assets/common/kefu.png" alt="" @click="Common.getSiteCustomerChannel" />
		<div class="customeWindow" v-if="showCustomeWindow">
			<iframe :src="customeUrl" frameborder="0"> </iframe>
			<div class="closeBtn curp">
				<svg-icon name="close" size="30px" @click="showCustomeWindow = false"></svg-icon>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import pubsub from "/@/pubSub/pubSub";
import Common from "/@/utils/common";
const customeUrl = ref("");
const visible = ref(false);
const scrollContainer = ref<HTMLElement | null>(null); // 用于存储滚动容器的引用

const checkVisibility = () => {
	if (scrollContainer.value) {
		visible.value = scrollContainer.value.scrollTop > 200;
	}
};
const showCustomeWindow = ref(false);
const scrollToTop = () => {
	scrollContainer.value?.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

onMounted(() => {
	pubsub.subscribe("showCustomer", (data) => {
		customeUrl.value = data;
		showCustomeWindow.value = true;
	});
	pubsub.subscribe("closeCustomer", (data) => {
		showCustomeWindow.value = false;
	});
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
	.customeWindow {
		position: absolute;
		top: -654px;
		right: 10px;
		height: 704px;
		width: 408px;
		border-radius: 15px;
		iframe {
			height: 100%;
			width: 100%;
			border-radius: 15px;
			overflow: hidden;
			position: relative;
		}
		.closeBtn {
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}
}
</style>
