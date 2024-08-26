import { computed } from 'vue';
import { useThemesStore } from '/@/stores/modules/themes';

const home_imgs = computed({
	get() {
		const themesStore = useThemesStore();
		return {
			banner: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/banner.svg`, import.meta.url).href,
			lunbo1: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/lunbo/lunbo_1.svg`, import.meta.url).href,
			lunbo2: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/lunbo/lunbo_2.svg`, import.meta.url).href,
			lunbo3: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/lunbo/lunbo_3.svg`, import.meta.url).href,
			caipiao: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/caipiao.svg`, import.meta.url).href,
			dianzi: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/dianzi.svg`, import.meta.url).href,
			tiyu: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/tiyu.svg`, import.meta.url).href,
			zhenren: new URL(`../../../assets/zh/${themesStore.themeName}/layout/layout1/right/home/zhenren.svg`, import.meta.url).href,
		};
	},
	set() {},
});

export default home_imgs;
