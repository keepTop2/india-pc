<template>
	<div class="Carousel">
		<!-- 导航按钮，用于前后切换幻灯片 -->
		<div class="paging">
			<span class="left" @click="prev()">
				<SvgIcon iconName="arrowLeft" width="8" height="12" />
			</span>
			<span class="right" @click="next()">
				<SvgIcon iconName="arrowRight" width="8" height="12" />
			</span>
		</div>
		<!-- Swiper组件，用于实现轮播效果 -->
		<Swiper
			@swiper="setSwiperRef"
			:slidesPerView="slidesPerView"
			:slidesPerGroup="slidesPerGroup"
			:spaceBetween="spaceBetween"
			:pagination="pagination"
			:autoplay="{
				delay: 5000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}"
			:modules="modules"
			class="swiper-no-swiping carousel-swiper"
		>
			<swiper-slide v-for="({ imageUrl }, index) in gameList" :key="index">
				<div>
					<img :src="imageUrl || game" alt="" />
				</div>
			</swiper-slide>
		</Swiper>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import game from './game.png';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Swiper模块配置
const modules = ref([Autoplay, Pagination, Navigation]);

// 组件接收的props定义
const props = defineProps({
	/**
	 * 游戏列表
	 */
	gameList: {
		type: [Object],
		default: [
			{
				imageUrl: game,
			},
			{
				imageUrl: game,
			},
			{
				imageUrl: game,
			},
			{
				imageUrl: game,
			},
			{
				imageUrl: game,
			},
			{
				imageUrl: game,
			},
		],
	},
	/**
	 * 可视范围内的slides数量
	 */
	slidesPerView: {
		type: Number,
		default: 3,
	},
	/**
	 * slides 多少个为一组
	 */
	slidesPerGroup: {
		type: Number,
		default: 3,
	},
	/**
	 * slides 之间的间距
	 */
	spaceBetween: {
		type: Number,
		default: 12,
	},
	/**
	 *  是否显示分页器
	 */
	pagination: {
		type: Boolean,
		default: true,
	},
});

// Swiper实例的引用
const SwiperRef = ref();

// 设置Swiper实例的引用
const setSwiperRef = (swiper: any) => {
	SwiperRef.value = swiper;
};

// 切换到下一张幻灯片
const next = () => {
	SwiperRef.value.slideNext();
};

// 切换到上一张幻灯片
const prev = () => {
	SwiperRef.value.slidePrev();
};
</script>

<style lang="scss">
@import './Carousel.scss';
</style>
