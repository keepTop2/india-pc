<template>
	<div class="base-body">
		<!-- 公告通知 -->
		<div class="base-container">
			<HeaderNotify @click="openNotify"></HeaderNotify>
		</div>
		<!-- 体育 主体内容区域  -->
		<div class="main-container">
			<!-- 体育游戏列表 -->
			<div class="left-container">
				<div class="container">
					<div class="header">
						<HeaderMenuNav></HeaderMenuNav>
						<div class="line"></div>
						<HeaderMenuCondition @onRefresh="onRefresh" @onType="onTab"></HeaderMenuCondition>
					</div>
					<div class="back-container">
						<!-- 主体路由页面 -->
						<router-view v-cloak />
						<!-- 搜索触发的遮罩 -->
						<div class="overlay" v-if="isShowMask"></div>
					</div>
					<!-- 购物车 -->
					<SportsShopCart></SportsShopCart>
				</div>
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
import { computed, defineAsyncComponent, markRaw, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, provide, reactive, ref, watch, watchEffect } from "vue";
import { isEmpty } from "lodash-es";
import { useRoute, useRouter } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import moment from "moment";

import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useLayoutStore } from "/@/stores/modules/layout";
import { useUserStore } from "/@/stores/modules/user";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

import { i18n } from "/@/i18n/index";
import { useLoading } from "/@/directive/loading/hooks";
import { useToLogin } from "/@/hooks/toLogin";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";

import workerManage from "/@/webWorker/workerManage";
import sportsApi from "/@/api/sports/sports";
import pubSub from "/@/pubSub/pubSub";
import { formattingResultViewData } from "/@/views/sports/utils/formattingViewData";
import { sportTabPushActions, sportsEventDetailPush } from "/@/views/sports/utils/sportsMap/sportsSSERequestMap";
import SportsCommonFn from "/@/views/sports/utils/common";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { betTypes } from "/@/views/sports/utils/sportsMap/sportsBetType";

import { WorkerName, SportViewProcessWorkerCommandType } from "/@/enum/workerTransferEnum";

import Modal from "./components/Modal/index.vue";
import { HeaderMenuNav, HeaderMenuCondition, HeaderNotify, SportsShopCart, Sidebar } from "./components";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";

/**
 * @description 常量定义
 */
const $ = i18n.global;
const route = useRoute();
const router = useRouter();
const sportsBetEvent = useSportsBetEventStore();
const SidebarStore = useSidebarStore();

/**
 * @description Store 实例化
 */
const popularLeague = usePopularLeague();
const SportsInfoStore = useSportsInfoStore();
const SportAttentionStore = useSportAttentionStore();
const SportMorningTradingStore = useSportMorningTradingStore();
const LayoutStore = useLayoutStore();
const UserStore = useUserStore();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const ShopCatControlStore = useShopCatControlStore();

/**
 * @description Hooks
 */
const { isHaveToken, toLogin } = useToLogin();
const { startLoading, stopLoading } = useLoading();
const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();
// 引入 侧边赛事推送  侧边赛事盘口推送 获取热门赛事
const { getSidebarEventSSEPush, getSidebarMarketSSEPush, getPromotions } = useToolsHooks();

/**
 * @description 路由映射
 */
const routeMap = {
	"/sports/todayContest/rollingBall": "rollingBall",
	"/sports/todayContest/notStarted": "todayContest",
	"/sports/morningTrading": "morningTrading",
	"/sports/champion": "champion",
} as const;

/**
 * @description 响应式数据
 */
const tabActive = computed(() => routeMap[route.path as keyof typeof routeMap]);
const isShowMask = ref(false);

// 公告数据
const NotifyModal = ref();
// 公告弹窗状态
const showNotifyModal = ref(false);

/**
 * @description 计算属性
 */
const attentionSwitch = computed(() => SportAttentionStore.attentionType);

/**
 * @description 生命周期钩子
 */
onBeforeMount(() => {
	pubSub.subscribe("showoVerlay", (data) => {
		isShowMask.value = data;
	});
	LayoutStore.setBigScreen(true);
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);
	initSportRequest();
});

const { pause, resume } = useIntervalFn(() => sportsLogin(), 8 * 60 * 1000);

const sportType = computed(() => route.query.sportType as string);

onBeforeUnmount(() => {
	unSport();
	pause();
});

onUnmounted(() => {
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
	openSportPush(sportType);
};

/**
 * @description 打开体育推送
 * @param {string | undefined} sportType - 体育类型
 */
const openSportPush = async (type: string | undefined) => {
	// console.log(type, "====sportType.value==========", sportType.value);
	sportsBetEvent.clearHotLeagueList();
	pubSub.publish("clearHotLeagueList", "on");
	// 关闭体育线程
	// 目前只关闭了 { sportViewProcessWorker.workerName }
	closeSportViewProcessWorker();
	// 开启体育线程
	// 同时开启所有线程 { sportViewProcessWorker.workerName , WorkerName.sidebarWorker }
	openSportViewProcessWorker();
	// 球类信息推送
	await handleSportPush();

	// 开启球类赛事数据推送
	if (route.path == "/sports/collect") {
		await getAttention(false);
		await openAttentionSSE();
	} else if (route.path == "/sports/detail") {
		// 开启详情盘口推送
		// 侧边赛事推送
		getSidebarEventSSEPush();
		// 侧边赛事盘口推送
		getSidebarMarketSSEPush();
		// await openEventDetailPush();
		// 获取热门赛事id开启推送
		// getPromotions();
	} else {
		await handleSportEventsPush((type || sportType.value) as string);
		// await getSidebarMarketSSEPush();
		// 获取热门赛事id开启推送
		// getPromotions();
		// 获取热门赛事
		stopLoading();
	}
};

/**
 * @description 处理体育推送
 */
const handleSportPush = async () => {
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	const action = sportTabPushActions[tabActive.value as keyof typeof sportTabPushActions]?.openSport || sportTabPushActions.rollingBall.openSport;
	sendWorkerCommand(action, params);
};

/**
 * @description 处理体育事件推送
 * @param {string} sportType - 体育类型
 */
const handleSportEventsPush = async (sportType = "1") => {
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	const pushActions = {
		rollingBall: () => sendWorkerCommand(sportTabPushActions.rollingBall.openEvents(sportType), params),
		todayContest: () => sendWorkerCommand(sportTabPushActions.todayContest.openEvents(sportType), params),
		morningTrading: () => {
			const { startDate, endDate } = SportMorningTradingStore.getTimeInterval;
			const queryParams = SportMorningTradingStore.getActiveDate
				? {
						query: `$filter= sportType in (${sportType})`,
						from: startDate,
						until: endDate,
						includeMarkets: `$filter=bettype in (${betTypes})`,
				  }
				: {
						query: `$filter= sportType in (${sportType})`,
						includeMarkets: `$filter=bettype in (${betTypes})`,
						from: moment
							.utc()
							.add(8 - 5 / 24, "day")
							.startOf("day")
							.add(5, "hour")
							.format("YYYY-MM-DDTHH:mm:ss"),
				  };
			sendWorkerCommand(sportTabPushActions.morningTrading.openEvents(sportType), params, { params: queryParams });
		},
		champion: () => sendWorkerCommand(sportTabPushActions.champion.openEvents(sportType), params),
		matchResult: async () => {
			const today = moment();
			const twelveDaysAgo = moment().subtract(11, "day");
			const format = "YYYY-MM-DD";

			try {
				const res = await sportsApi.GetSportResults({
					language: "zhcn",
					from: `${twelveDaysAgo.format(format)}T00:00:00`,
					until: `${today.format(format)}T23:59:59`,
				});

				if (res.data) {
					const sportList = res.data.sportList;
					viewSportPubSubEventData.setSportData({
						...viewSportPubSubEventData.viewSportData,
						sports: formattingResultViewData(sportList),
					});
				}
			} catch (error) {
				console.error("获取比赛结果失败", error);
			}
		},
	};
	const action = pushActions[tabActive.value as keyof typeof pushActions];
	if (action) {
		action();
	}
};

/**
 * @description 发送工作线程命令
 * @param {any} action - 动作
 * @param {object} params - 参数
 * @param {object} additionalParams - 附加参数
 */
const sendWorkerCommand = (action: any, params = {}, additionalParams = {}) => {
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, action, params, additionalParams);
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
};

/**
 * @description 打开关注SSE
 */
const openAttentionSSE = async () => {
	console.log(attentionSwitch.value, "====attentionSwitch.value");
	attentionSwitch.value == "event" ? openAttentionEventSSE() : openAttentionOutrightSSE();
};

/**
 * @description 打开关注事件SSE
 */
const openAttentionEventSSE = () => {
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};

	const attentionParams = {
		params: {
			query: `$filter= eventId in (${SportAttentionStore.attentionEventIdList.join()})&$orderby=globalShowTime asc `,
			includeMarkets: `$filter=bettype in (${betTypes})`,
		},
	};
	sendWorkerCommand(sportTabPushActions.attention.openEvents, { ...params, ...attentionParams });
};

/**
 * @description 打开关注冠军SSE
 */
const openAttentionOutrightSSE = () => {
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};

	const attentionParams = {
		params: {
			query: `$filter= leagueId in (${SportAttentionStore.attentionLeagueIdList.join()})&$orderby=eventDate asc `,
			includeMarkets: `$filter=bettype in (${betTypes})`,
		},
	};

	sendWorkerCommand(sportTabPushActions.attention.openOutright, { ...params, ...attentionParams });
};

/**
 * @description 打开事件详情推送
 */
/*const openEventDetailPush = async () => {
	console.log("详情推送触发");
	const { leagueId, eventId } = route.query;

	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	sendWorkerCommand(sportsEventDetailPush.openMarkets(eventId as string), params);
	sendWorkerCommand(sportsEventDetailPush.openEvents(leagueId as string), params);
};*/

/**
 * @description 标签切换
 * @param {string} type - 标签类型
 */
const onTab = (type: string) => {
	console.log(tabActive.value, "==========", type);
	if (tabActive.value == type) return;
	tabActive.value = type;
	ShopCatControlStore.setShopCatShow(false);
	clearStroe();
	unSubSport();
	closeSportViewProcessWorker();
	initSportPubsub();
	openSportViewProcessWorker();
	openSportPush(route.query.sportType as string);
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
	closeSportViewProcessWorker();
	unSubSport();
	sportsBetEvent.clearHotLeagueList();
	pubSub.publish("clearHotLeagueList", "on");
};

/**
 * @description 打开通知
 */
const openNotify = () => {
	NotifyModal.value = markRaw(defineAsyncComponent(() => import(`./components/Notify/index.vue`)));
	showNotifyModal.value = true;
};

/**
 * @description 关闭通知模态框
 */
const closeNotifyModal = () => {
	showNotifyModal.value = false;
};

/**
 * @description 关闭体育视图处理工作线程
 */
const closeSportViewProcessWorker = () => {
	try {
		if (workerManage.getWorkerList().length) {
			// 关闭列表events线程
			workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
			// 关闭侧边栏events线程
			workerManage.stopWorker(workerManage.WorkerMap.sidebarWorker.workerName);
		}
	} catch (error) {
		console.error("关闭体育视图处理线程失败", error);
	}
};

/**
 * @description 打开体育视图处理工作线程
 */
const openSportViewProcessWorker = () => {
	// console.log("触发了几次开启线程的操作");
	try {
		// 开启列表events线程
		workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
		// 开启侧边栏events线程
		workerManage.startWorker(workerManage.WorkerMap.sidebarWorker.workerName);
	} catch (error) {
		// console.error("开启体育视图处理线程失败", error);
	}
};

/**
 * @description 清除存储
 */
const clearStroe = async () => {
	viewSportPubSubEventData.clearEventsState();
	SidebarStore.clearEventsInfo();
	SportLeagueSearchStore.clearLeagueSelect();
};

/**
 * @description 自动根据使用的路由参数触发对应代码逻辑
 * 监听name变化，配置可触发推送的路由name 调用openSportPush 函数开启推送
 * 关注，详情，
 */
// watchEffect(() => {
// 	const sportType = route.query.sportType as string;
// 	const routeName = route.name as string;
//   if (sportType && routeName) {
//     console.log('Sport type changed:', sportType);
//     openSportPush(sportType);
//   }
// });

provide("openSportPush", openSportPush);

// 监听早盘时间切换触发事件
watch(
	() => SportMorningTradingStore.getActiveDate,
	(newValue) => {
		if (newValue && tabActive.value == "morningTrading") {
			initSport();
		}
	}
);
</script>

<style lang="scss" scoped>
.base-body {
	width: 1660px;
	height: 100%;
	margin: 0 auto;
	overflow-x: auto;
}

.base-container {
	width: 100%;
}
.main-container {
	display: flex;
	height: calc(100% - 40px);
	width: 1660px;
	overflow: hidden;
	overflow-x: auto;
	justify-content: center;
	.left-container {
		position: relative;
		margin: 0px 12px;
		flex: 1;

		.container {
			width: 1246px;
			.header {
				width: 100%;
				border-radius: 8px;
				background: var(--Bg1);
				box-sizing: border-box;

				.line {
					width: 100%;
					height: 1px;
					background: var(--Line_1);
					box-shadow: 0px 1px 0px 0px #343d48;
				}
			}

			.back-container {
				background-color: var(--Bg);
				position: relative;

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
	}

	.right-container {
		width: 390px;
		height: 100%;
		overflow-y: auto;
	}
	.right-container::-webkit-scrollbar {
		display: none;
	}
}
</style>
