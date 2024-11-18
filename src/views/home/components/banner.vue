<template>
	<div class="banner max-width">
		<img class="max-width mt_24" src="./image/image.png" alt="" style="width: 100%" v-if="!useUserStore().getLogin" />
		<div class="swiper-box max-width" v-else>
			<Swiper :autoplay="true" :slidesPerView="3" :spaceBetween="18" :loop="true" :modules="modules" :pagination="true" class="swiper-container curp" @swiper="onSwiper">
				<SwiperSlide v-for="(item, index) in bannerList?.length > 0 ? bannerList : 3" :key="index">
					<img v-lazy-load="item.iconFileUrl" alt="" />
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
import { ref } from "vue";
import { useUserStore } from "/@/stores/modules/user";
const props = defineProps({
	bannerList: [] as any,
});
const swiperRef: any = ref(null);
const modules = ref([Autoplay, Pagination, Navigation]);
const onSwiper = (swiper: any) => {
	if (swiperRef.value) {
		swiperRef.value = swiper;
	}
};
</script>

<style scoped lang="scss">
.banner {
	width: 100%;
	margin: 0 auto;
	> img {
		width: 100%;
		height: 345.19px;
		border-radius: 16px;
		object-fit: cover;
	}
	.swiper-box {
		position: relative;

		margin: 0 auto;
		margin-top: 20px;
	}
	.swiper {
		max-width: 1308px;
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
		:deep(.swiper-slide) {
			height: 204px;
			img {
				height: 204px;
				width: 100%;
				object-fit: cover;
				border-radius: 12px;
			}
		}
	}
}
</style>
