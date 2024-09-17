<template>
	<div class="banner">
		<img src="./image/image.png" alt="" />
		<div class="swiper-box">
			<Swiper :autoplay="true" :slidesPerView="3" :spaceBetween="15" :loop="true" :modules="modules" :pagination="true" class="swiper-container" @swiper="onSwiper">
				<SwiperSlide v-for="(item, index) in announcementList" :key="index">
					<img :src="item" alt="" />
				</SwiperSlide>
			</Swiper>
			<div class="arrow">
				<div class="arrow_left" @click="goToPrevSlide">
					<svg-icon name="arrow_left" width="6px" height="16px"></svg-icon>
				</div>
				<div class="arrow_right" @click="goToNextSlide">
					<svg-icon name="arrow_right" width="6px" height="16px"></svg-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
const modules = ref([Autoplay, Pagination, Navigation]);
import banner1 from "./image/banner1.png";
import banner2 from "./image/banner2.png";
import banner3 from "./image/banner3.png";
import { onMounted, ref } from "vue";
const swiperRef: any = ref(null);
const isLoading = ref(false);
const announcementList = [banner1, banner2, banner3, banner1, banner2, banner3];
const onSwiper = (swiper: any) => {
	swiperRef.value = swiper;
};
const goToNextSlide = () => {
	swiperRef.value?.slideNext();
};
const goToPrevSlide = () => {
	swiperRef.value?.slidePrev();
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
		.arrow {
			max-width: 1350px;
			position: absolute;
			left: 10px;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
			display: flex;
			justify-content: space-between;
			color: var(--Text_s);
			margin: 0 auto;
			cursor: pointer;
			.arrow_left,
			.arrow_right {
				background-color: var(--button);
				height: 82px;
				width: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.arrow_left {
				border-top-left-radius: 9px;
				border-bottom-left-radius: 9px;
			}
			.arrow_right {
				border-top-right-radius: 9px;
				border-bottom-right-radius: 9px;
			}
		}
	}
	.swiper {
		margin: -55px 55px 0;
		max-width: 1254px;
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
