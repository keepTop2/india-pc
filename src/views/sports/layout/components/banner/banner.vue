<template>
	<div class="banner">
		<Swiper :autoplay="true" :slidesPerView="slidesPerView" :spaceBetween="15" :loop="true" :modules="modules" :pagination="true" class="swiper-container curp" @swiper="onSwiper">
			<SwiperSlide v-for="(item, index) in announcementList" :key="index">
				<img :src="item" alt="" />
			</SwiperSlide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const modules = ref([Autoplay, Pagination, Navigation]);
const swiperRef: any = ref(null);
import banner1 from "./image/banner1.png";
import banner2 from "./image/banner2.png";
import banner3 from "./image/banner3.png";
const announcementList = [banner1, banner2, banner3, banner1, banner2, banner3];

const onSwiper = (swiper: any) => {
	swiperRef.value = swiper;
};

const slidesPerView = ref(3);

const handleScreenWidthChange = (event) => {
	if (event.matches) {
		// 窄屏处理逻辑
		slidesPerView.value = 2;
	} else {
		// 宽屏处理逻辑
		slidesPerView.value = 3;
	}
};

onBeforeMount(() => {
	const mediaQuery = window.matchMedia("(max-width: 1439px)"); // 设置需要的宽度
	// 添加监听器
	mediaQuery.addListener(handleScreenWidthChange);

	// 初次调用，检查当前宽度
	handleScreenWidthChange(mediaQuery);
});
</script>

<style scoped lang="scss">
.banner {
	width: 100%;
	height: 240px;
	box-sizing: border-box;
}
.swiper {
	width: 100%;
	height: 224px;
	img {
		width: 424px;
		height: 204px;
	}
	:deep(.swiper-pagination) {
		bottom: -2px !important;
	}
	:deep(.swiper-pagination-bullet) {
		width: 12px !important;
		border-radius: 2px !important;
		height: 4px;
		background-color: var(--Bg-3) !important;
		&.swiper-pagination-bullet-active {
			width: 26px !important;
			background: var(--Theme) !important;
		}
	}
}
</style>
