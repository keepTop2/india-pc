<template>
	<div class="GameSwiper">
		<Swiper
			:slidesPerView="slidesPerView"
			:spaceBetween="spaceBetween"
			:loop="true"
			:noSwiping="true"
			:autoplay="{
				delay: 2500,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}"
			:modules="modules"
			class="mySwiper swiper-no-swiping"
		>
			<swiper-slide v-for="({ userName, unit, money }, index) in gameList" :key="index">
				<div>
					<img :src="home_bigwins" alt="" />
					<div class="message">
						<span class="gameName">{{ userName }}</span>
						<span class="money">{{ unit }}{{ money }}</span>
					</div>
				</div>
			</swiper-slide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import home_bigwins from "/@/assets/zh/default/home/home_bigwins.png";

const modules = ref([Autoplay, Pagination, Navigation]); //swiper配置项

const props = defineProps({
	gameList: {
		type: [Object],
	},
	slidesPerView: {
		type: Number,
		default: 7,
	},
	spaceBetween: {
		type: Number,
		default: 30,
	},
});
</script>

<style lang="scss">
@import "./gameswiper.scss";
</style>
