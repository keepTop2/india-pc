import logo from "/@/assets/zh/default/layout/layout1/left/logo.svg";

//任务
import rwjj_img from "/@/assets/zh/default/home/rwjj_img.png";
//抽奖
import choujiang_img from "/@/assets/zh/default/home/choujiang_img.png";

import { computed } from "vue";
import { useThemesStore } from "/@/stores/modules/themes";

const left_imgs = computed({
	get() {
		const themesStore = useThemesStore();
		return {
			collapse_icon: "collapse_icon",
			logo,

			//任务
			rwjj_img,
			//抽奖
			choujiang_img,
			//菜单折叠图标未激活
			right_1: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/right_1.svg`, import.meta.url).href,
			//菜单折叠图标激活
			right_2: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/right_2.svg`, import.meta.url).href,
			//激活图标
			active: {
				/**
				 * @description 奖金激活图标
				 */
				bonus_active: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/activeIcon/bonus_active.svg`, import.meta.url).href,
				/**
				 * @description 帮助中心菜单 激活图标
				 */
				helpcenter_active: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/activeIcon/helpcenter_active.svg`, import.meta.url).href,
				/**
				 * @description 白天 激活图标
				 */
				day_active: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/activeIcon/day_active.svg`, import.meta.url).href,
				/***
				 * @description 黑夜 激活图标
				 */
				night_active: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/activeIcon/night_active.svg`, import.meta.url).href,
			},
			//未激活图标
			inactivated: {
				/**
				 * @description 奖金未激活图标
				 */
				bonus_inactivated: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/inactivated/bonus_inactivated.svg`, import.meta.url).href,

				/**
				 * @description 帮助中心 未激活图标
				 */
				helpcenter_inactivated: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/inactivated/helpcenter_inactivated.svg`, import.meta.url).href,
				/**
				 * @description 白天 未激活图标
				 */
				day_inactivated: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/inactivated/day_inactivated.svg`, import.meta.url).href,
				/**
				 * @description 黑夜未激活图标
				 */
				night_inactivated: new URL(`../../../../assets/zh/${themesStore.themeName}/layout/layout1/left/inactivated/night_inactivated.svg`, import.meta.url).href,
			},
		};
	},
	set() {},
});

export default left_imgs;
