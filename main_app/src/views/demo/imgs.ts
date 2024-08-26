import { computed } from 'vue';
import { i18n } from '/@/i18n/index';
import { useThemesStore } from '/@/stores/modules/themes';

/**
 * @description 图片集合
 */
const imgs = computed({
	get() {
		const themesStore = useThemesStore();
		return {
			demoImgUrl: new URL(`../../assets/${i18n.global.locale.value}/${themesStore.themeName}/demo/demo.png`, import.meta.url).href,
		};
	},
	set() {},
});

/**
 * @description 背景图片集合
 */
export const bgImgs = computed({
	get() {
		const themesStore = useThemesStore();
		return {
			demoBg: new URL(`../../assets/${i18n.global.locale.value}/${themesStore.themeName}/demo/demo.png`, import.meta.url).href,
		};
	},
	set() {},
});
export default imgs;
