<template>
	<div class="home_banner">
		<div :class="['banner_text', UserStore.token && 'top30']" v-if="UserStore.token">
			<span class="color_Text_a fs_24 fw_600">Hi Peak! Welcome aboard</span>
			<span class="fs_32 fw_400 color_Text_a">FIRST DEPOSIT BONUS</span>
			<span class="fs_48 fw_900"><span class="green_gradual_change">+180%</span></span>
			<span class="fs_48 fw_900"><span class="green_gradual_change">REWARDS</span></span>
			<div class="button_flex">
				<button class="bg_Theme color_Text_a fw_500">按钮文字</button>
				<button class="bg_f2 color_Text_a fw_500">按钮文字</button>
			</div>
		</div>
		<div class="banner_text" v-else>
			<span class="color_Text_a">sign up & <span class="color_Theme">get</span> reward</span>
			<span class="fs_64 color_Text_a ff_ab">UP TO <span class="blue_gradual_change">$20,000</span></span>
			<button class="bg_f2 color_Text_a fw_500" @click="register">立即注册</button>
		</div>
		<img :src="computedImages.home_banner" alt="" :style="{ width: '800px', float: 'right' }" />
		<div class="block">
			<Carousel :gameList="gameList" :spaceBetween="12" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import dialogSingleton from "/@/layout/layout1/login/dialogSingleton";
import { useUserStore } from "/@/stores/modules/user";
import { useThemesStore } from "/@/stores/modules/themes";
// import Carousel from '/@/components/Carousel/Carousel.vue';
import { Carousel } from "/@/components/Carousel";

import { gameList } from "../mock";
const UserStore = useUserStore();
const themesStore = useThemesStore();

const computedImages = computed(() => {
	return {
		home_banner: new URL(`../../../../../assets/zh/${themesStore.themeName}/home/home_banner.png`, import.meta.url).href,
	};
});

const register = () => {
	dialogSingleton.showDialog({});
};
</script>

<style lang="scss">
@import "./banner.scss";
.ff_ab {
	font-family: "Arial Black";
}
</style>
