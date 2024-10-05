<template>
	<div class="base-body">
		<!-- 体育 主体内容区域  -->
		<Banner />
		<div class="main-container">
			<!-- 体育游戏列表 -->
			<div class="left-container">
				<div class="header">
					<HeaderMenuCondition @onRefresh="onRefresh" @onType="onTab" v-if="isShowCondition"></HeaderMenuCondition>
					<div class="line" v-if="route.meta.type === 'list'"></div>
					<HeaderMenuNav :tabActive="tabActive"></HeaderMenuNav>
				</div>
				<div class="back-container">
					<!-- 主体路由页面 -->
					<router-view v-cloak />
					<!-- 搜索触发的遮罩 -->
					<div class="overlay" v-if="isShowMask"></div>
				</div>
				<!-- 购物车 -->
				<SportsShopCart v-if="popularLeague.visible"></SportsShopCart>
			</div>
			<!-- 右边侧边栏 -->
			<div class="right-container" v-if="popularLeague.visible">
				<Sidebar v-if="SportsInfoStore.getSportsToken"></Sidebar>
			</div>
		</div>
		<!-- 公告弹窗 -->
		<Modal v-if="showNotifyModal" :before-close="closeNotifyModal" @close="closeNotifyModal">
			<component :is="NotifyModal" />
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onUnmounted, ref, watch } from "vue";
import { isEmpty } from "lodash-es";
import { useRoute, useRouter } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useLayoutStore } from "/@/stores/modules/layout";
import { useUserStore } from "/@/stores/modules/user";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { i18n } from "/@/i18n/index";
import { useLoading } from "/@/directive/loading/hooks";
import { useToLogin } from "/@/hooks/toLogin";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";

import SkeletonList from "/@/views/sports/layout/components/SkeletonList/SkeletonList.vue";
import pubSub from "/@/pubSub/pubSub";
import { FootballCardApi } from "/@/api/sports/footballCard";

import Modal from "./components/Modal/index.vue";
import { HeaderMenuNav, HeaderMenuCondition, SportsShopCart, Sidebar } from "./components";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSportEvents } from "/@/views/sports/hooks/useSportEvents";

/**
 * @description 国际化实例
 */
const $ = i18n.global;

/**
 * @description 路由实例
 */
const route = useRoute();
const router = useRouter();

/**
 * @description 是否显示条件
 */
const isShowCondition = computed(() => route.meta.type === "list");

/**
 * @description 各种store实例
 */
const sportsBetEvent = useSportsBetEventStore();
const SidebarStore = useSidebarStore();
const popularLeague = usePopularLeague();
const SportsInfoStore = useSportsInfoStore();
const SportAttentionStore = useSportAttentionStore();
const SportMorningTradingStore = useSportMorningTradingStore();
const LayoutStore = useLayoutStore();
const UserStore = useUserStore();
const ShopCatControlStore = useShopCatControlStore();
const sportsData = computed(() => viewSportPubSubEventData.viewSportData.sports);

/**
 * @description 登录相关hooks
 */
const { isHaveToken, toLogin } = useToLogin();

/**
 * @description 加载相关hooks
 */
const { startLoading, stopLoading } = useLoading();

/**
 * @description 体育相关事件hooks
 */
const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();

/**
 * @description 工具相关hooks
 */
const { getSidebarEventSSEPush, getSidebarMarketSSEPush, getPromotions } = useToolsHooks();

/**
 * @description 是否显示遮罩层
 */
const isShowMask = ref(false);

// 公告数据
const NotifyModal = ref();
// 公告弹窗状态
const showNotifyModal = ref(false);

/**
 * @description 体育事件相关hooks
 */
const { sportType, tabActive, handleSportEventsPush, openSportPush, handleSportPush } = useSportEvents();

onBeforeMount(() => {
	/**
	 * @description 订阅遮罩层显示事件
	 */
	pubSub.subscribe("showoVerlay", (data) => {
		isShowMask.value = data;
	});

	/**
	 * @description 设置大屏模式
	 */
	LayoutStore.setBigScreen(true);

	/**
	 * @description 订阅关注变化事件
	 */
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);

	/**
	 * @description 初始化体育请求
	 */
	initSportRequest();
});

/**
 * @description 定时执行体育登录
 */
const { pause, resume } = useIntervalFn(() => sportsLogin(), 8 * 60 * 1000);

onBeforeUnmount(() => {
	/**
	 * @description 卸载体育相关事件
	 */
	unSport();

	/**
	 * @description 暂停定时执行
	 */
	pause();
});

onUnmounted(() => {
	/**
	 * @description 取消大屏模式
	 */
	LayoutStore.setBigScreen(false);
});

/**
 * @description 初始化体育请求
 */
const initSportRequest = async () => {
	// 获取关注列表
	await getAttention();
	// 体育登录
	await sportsLogin();
	// 初始化体育
	await initSport();
};

/**
 * @description 获取关注列表
 * @param {boolean} isLogin - 是否登录
 */
const getAttention = async (isLogin = true) => {
	if ((isLogin && !isEmpty(UserStore.getUserInfo)) || !isLogin) {
		try {
			const res = await FootballCardApi.getAttentionList();
			if (res.data) {
				SportAttentionStore.setAttentionList(res.data);
				return res.data;
			}
		} catch (error) {
			console.error("获取关注列表失败", error);
		}
	}
};

/**
 * @description 初始化体育
 */
const initSport = async () => {
	initSportPubsub();
	const sportType = (route.query.sportType as string) || "1";
	pubSub.publish("showSkeleton", true);
	openSportPush(sportType);
};

/**
 * @description 切换标签
 * @param {string} type - 标签类型
 */
const onTab = (type: string) => {
	console.log(tabActive.value, "=====onTab=====", type);
	if (tabActive.value === type) return;
	tabActive.value = type;
	ShopCatControlStore.setShopCatShow(false);
};

/**
 * @description 刷新
 */
const onRefresh = () => {
	initSport();
};

/**
 * @description 卸载体育
 */
const unSport = () => {
	console.error("卸载体育");
	clearState();
	unSubSport();
	sportsBetEvent.clearHotLeagueList();
	pubSub.publish("clearHotLeagueList", "on");
};

/**
 * @description 关闭通知模态框
 */
const closeNotifyModal = () => {
	showNotifyModal.value = false;
};

/**
 * @description 监听早盘交易活跃日期变化
 */
watch(
	() => SportMorningTradingStore.getActiveDate,
	(newValue) => {
		if (newValue && tabActive.value === "morningTrading") {
			initSport();
		}
	}
);

/**
 * @description 监听路由地址的变化，清理赛事数据，清理侧边栏数据，开启对应的推送。
 */
watch(
	() => route.fullPath,
	(newValue, oldValue) => {
		if (newValue !== oldValue) {
			// 清除数据中心数据===列表数据
			viewSportPubSubEventData.clearEventsState();
			// 清除侧边栏数据
			// SidebarStore.clearEventsInfo();
			//开启推送
			openSportPush(route.query.sportType as string, tabActive.value);
			pubSub.publish("SkeletonLoading", true);
		}
	}
);

/**
 * @description 监听体育球类的变化
 */
watch(
	() => sportsData.value,
	(newValue) => {
		if (newValue && newValue.length > 0) {
			if (route.query.sportType) {
				const isSportType = newValue.some((item) => item.sportType === Number(route.query.sportType));
				if (!isSportType) {
					router.push({
						path: route.path,
						query: {
							...route.query,
							sportType: newValue[0].sportType,
						},
					});
				}
			}
		}
	}
);
</script>

<style lang="scss" scoped>
.base-body {
	width: 1308px;
	margin: 0 auto;
	overflow-x: auto;
}

.main-container {
	width: 100%;
	height: calc(100vh - 66px);
	display: flex;
	overflow: hidden;
	overflow-x: auto;
	justify-content: center;
	margin-top: 6px;
	.left-container {
		position: relative;
		width: 930px;
		height: 100%;
		overflow: hidden;

		.header {
			width: 100%;
			box-sizing: border-box;
			.line {
				width: 100%;
				height: 1px;
				background: var(--Line_1);
				box-shadow: 0px 1px 0px 0px #343d48;
			}
		}

		.back-container {
			position: relative;
			width: 100%;
			height: calc(100% - 119px);
			background-color: var(--Bg);

			.overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: rgba(0, 0, 0, 0.5);
				z-index: 1;
			}
		}
	}

	.right-container {
		width: 370px;
		height: 100%;
		margin-left: 8px;
		overflow-y: auto;
	}
	.right-container::-webkit-scrollbar {
		display: none;
	}
}
</style>
