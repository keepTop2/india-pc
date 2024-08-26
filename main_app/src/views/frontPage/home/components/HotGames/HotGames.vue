<template>
	<div class="hotgame">
		<div class="paging">
			<a class="c_green">查看全部</a>
			<span @click="prev()">
				<SvgIcon iconName="arrowLeft" width="8" height="12" />
			</span>
			<span @click="next()">
				<SvgIcon iconName="arrowRight" width="8" height="12" />
			</span>
		</div>
		<Swiper
			@swiper="setBigwinsSwiper"
			:slidesPerView="slidesPerView"
			:spaceBetween="spaceBetween"
			:slidesPerGroup="6"
			:loop="true"
			:noSwiping="true"
			:modules="modules"
			class="mySwiper swiper-no-swiping"
		>
			<swiper-slide v-for="i in 10" :key="i">
				<div>
					<img :src="home_bigwins" />
					<div class="message">
						<span class="gameName">游戏名字</span>
					</div>
				</div>
			</swiper-slide>
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
import home_bigwins from "/@/assets/zh/default/home/home_bigwins.png";

const props = defineProps({
	slidesPerView: {
		type: Number,
		default: 6,
	},
	spaceBetween: {
		type: Number,
		default: 30,
	},
});

const modules = ref([Autoplay, Pagination, Navigation]);
const bigwinsRef = ref();

const setBigwinsSwiper = (swiper: any) => {
	bigwinsRef.value = swiper;
};

const next = () => {
	bigwinsRef.value.slideNext();
};

const prev = () => {
	bigwinsRef.value.slidePrev();
};
</script>

<style lang="scss">
@import "./hotgame.scss";
</style>
