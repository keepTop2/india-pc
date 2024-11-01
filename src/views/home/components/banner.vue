<template>
	<div class="banner">
		<img src="./image/image.webp" alt="" style="width: 100%" v-if="!useUserStore().getLogin" />
	<div class="swiper-box" v-else" >
			<Swiper :autoplay="true" :slidesPerView="3" :spaceBetween="15" :loop="true" :modules="modules" :pagination="true" class="swiper-container curp" @swiper="onSwiper">
				<SwiperSlide v-for="(item, index) in announcementList" :key="index">
					<img :src="item" alt="" />
				</SwiperSlide>
			</Swiper>
		</div> 
	</div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import banner1 from "./image/banner1.png";
import banner2 from "./image/banner2.png";
import banner3 from "./image/banner3.png";
import { ref } from "vue";
import { useUserStore } from "/@/stores/modules/user";
const swiperRef: any = ref(null);
const modules = ref([Autoplay, Pagination, Navigation]);
const announcementList = [banner1, banner2, banner3, banner1, banner2, banner3];
const onSwiper = (swiper: any) => {
	if (swiperRef.value) {
		swiperRef.value = swiper;
	}
};
const goToNextSlide = () => {
	if (swiperRef.value) {
		swiperRef.value?.slideNext();
	}
};
const goToPrevSlide = () => {
	if (swiperRef.value) {
		swiperRef.value?.slidePrev();
	}
};
</script>

<style scoped lang="scss">
.banner {
	width: 100%;
	max-width: 1636px;
	margin: 0 auto;
	img {
		width: 100%;
	}
	.swiper-box {
		position: relative;
		max-width: 1350px;
		margin: 0 auto;
		margin-top: 20px;
		padding: 0 10px;
	}
	.swiper {
		max-width: 1350px;
		padding-bottom: 20px;
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
}
</style>
