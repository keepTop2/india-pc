<template>
	<div class="banner">
		<Swiper :autoplay="true" :slidesPerView="3" :spaceBetween="15" :loop="true" :modules="modules" :pagination="true" class="swiper-container curp" @swiper="onSwiper">
			<SwiperSlide v-for="(item, index) in announcementList" :key="index">
				<img :src="item" alt="" />
			</SwiperSlide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
	}
	:deep(.swiper-pagination-bullet-active) {
		width: 26px !important;
		background: var(--Theme) !important;
	}
}
</style>
