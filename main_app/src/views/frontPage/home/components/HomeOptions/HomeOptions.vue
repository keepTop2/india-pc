<template>
	<ul class="homeOptions">
		<li>
			<img :src="computedImages.home_dianzi" alt="" />
			<div class="default_color message">
				<h3 class="fs_24">{{ $t(`home['电子']`) }}</h3>
				<p class="fs_14">{{ $t(`home['深入了解我们的游戏']`) }}</p>
				<el-button>Go to Casino</el-button>
			</div>
		</li>
		<li>
			<img :src="computedImages.home_tiyu" alt="" />
			<div class="default_color message">
				<h3 class="fs_24">{{ $t(`home['体育']`) }}</h3>
				<p class="fs_14">{{ $t(`home['体育描述']`) }}</p>
				<el-button>Go to Casino</el-button>
			</div>
		</li>
		<li>
			<img :src="computedImages.home_zhenren" alt="" />
			<div class="default_color message">
				<h3 class="fs_24">{{ $t(`home['真人']`) }}</h3>
				<p class="fs_14">{{ $t(`home['公平、公正、公开']`) }}</p>
				<el-button>Go to Casino</el-button>
			</div>
		</li>
		<li>
			<img :src="computedImages.home_caipiao" alt="" />
			<div class="default_color message">
				<h3 class="fs_24">{{ $t(`home['彩票']`) }}</h3>
				<p class="fs_14">{{ $t(`home['彩票描述']`) }}</p>
				<el-button>Go to Casino</el-button>
			</div>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";

const themesStore = useThemesStore();
const computedImages = computed(() => {
	return {
		home_dianzi: new URL(`../../../../../assets/zh/${themesStore.themeName}/home/home_dianzi.png`, import.meta.url).href,
		home_tiyu: new URL(`../../../../../assets/zh/${themesStore.themeName}/home/home_tiyu.png`, import.meta.url).href,
		home_zhenren: new URL(`../../../../../assets/zh/${themesStore.themeName}/home/home_zhenren.png`, import.meta.url).href,
		home_caipiao: new URL(`../../../../../assets/zh/${themesStore.themeName}/home/home_caipiao.png`, import.meta.url).href,
	};
});
</script>

<style lang="scss">
@import "./homeOptions.scss";
</style>
