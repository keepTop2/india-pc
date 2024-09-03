/*
 * @Author: WangMingxin
 * @Description: 体育 - 所有公共及布局组件
 */
import HeaderMenuNav from "./headerMenuNav/headerMenuNav.vue";
import HeaderMenuCondition from "./headerMenuCondition/headerMenuCondition.vue";
import HeaderNotify from "./headerNotify/headerNotify.vue";

import SportsShopCart from "./sportsShopCart/sportsShopCart.vue";
import SportRight from "./sportRight/sportRight.vue";

import { defineAsyncComponent } from "vue";
// const HeaderMenuNav = defineAsyncComponent(() => import("/@/layout/components/headerMenuNav/headerMenuNav.vue"));
// const HeaderMenuCondition = defineAsyncComponent(() => import("/@/layout/components/headerMenuCondition/headerMenuCondition.vue"));
// const HeaderNotify = defineAsyncComponent(() => import("/@/layout/components/headerNotify/headerNotify.vue"));
// const SportsShopCart = defineAsyncComponent(() => import("/@/layout/components/sportsShopCart/sportsShopCart.vue"));
// const SportRight = defineAsyncComponent(() => import("/@/layout/components/sportRight/sportRight.vue"));

export {
	/** 体育球内导航*/
	HeaderMenuNav,
	/** 体育赛选导航组件*/
	HeaderMenuCondition,
	/** 体育顶部通知 */
	HeaderNotify,
	/** 购物车 */
	SportsShopCart,
	/**体育-右侧-热门 */
	SportRight,
};
