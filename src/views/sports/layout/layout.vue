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
						<HeaderMenuNav @switchType="openSportPush"></HeaderMenuNav>
						<div class="line"></div>
						<HeaderMenuCondition @onRefresh="onRefresh" @onType="onTab"></HeaderMenuCondition>
					</div>
					<div class="back-container">
						<!-- 主体路由页面 -->
						<router-view v-cloak />
						<div class="overlay" v-if="isShowoVerlay"></div>
					</div>
					<!-- 购物车 -->
					<SportsShopCart></SportsShopCart>
				</div>
			</div>
			<!-- 右边侧边栏 -->
			<div class="right-container" v-if="popularLeague.visible">
				<Sidebar v-if="SportsInfoStore.getSportsToken"></Sidebar>
				<!-- <sportRight v-if="SportsInfoStore.getSportsToken"></sportRight> -->
			</div>
		</div>
		<!-- 公告弹窗 -->
		<Modal v-if="showNotifyModal" :before-close="closeNotifyModal" @close="closeNotifyModal">
			<component :is="NotifyModal" />
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { cloneDeep, isEmpty } from "lodash-es";
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
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

import { i18n } from "/@/i18n/index";
import { useLoading } from "/@/directive/loading/hooks";
import { useToLogin } from "/@/hooks/toLogin";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";

import workerManage from "/@/webWorker/workerManage";
import Common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import pubSub from "/@/pubSub/pubSub";
import { formattingResultViewData } from "/@/views/sports/utils/formattingViewData";
import { sportTabPushActions, sportsEventDetailPush } from "/@/views/sports/utils/sportsMap/sportsSSERequestMap";
import SportsCommonFn from "/@/views/sports/utils/common";
import { FootballCardApi } from "/@/api/sports/footballCard";
import { betTypes } from "/@/views/sports/utils/sportsMap/sportsBetType";

import { WorkerName, SportViewProcessWorkerCommandType } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";

import Modal from "./components/Modal/index.vue";
import { HeaderMenuNav, HeaderMenuCondition, HeaderNotify, SportsShopCart, Sidebar, sportRight } from "./components";

// 常量定义
const $ = i18n.global;
const route = useRoute();
const router = useRouter();

// Store 实例化
const popularLeague = usePopularLeague();
const SportsInfoStore = useSportsInfoStore();
const SportsBetEventStore = useSportsBetEventStore();
const SportAttentionStore = useSportAttentionStore();
const SportMorningTradingStore = useSportMorningTradingStore();
const LayoutStore = useLayoutStore();
const UserStore = useUserStore();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const SportSortStore = useSportSortStore();
const ShopCatControlStore = useShopCatControlStore();
// Hooks
const { isHaveToken, toLogin } = useToLogin();
const { startLoading, stopLoading } = useLoading();
const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();

const routeMap = {
	// 滚球
	"/sports/todayContest/rollingBall": "rollingBall",
	// 未开赛
	"/sports/todayContest/notStarted": "todayContest",
	// 早盘
	"/sports/morningTrading": "morningTrading",
	// 今日
	"/sports/champion": "champion",
} as any;

// 响应式数据
const tabActive = ref(routeMap[route.path]); // 默认滚球
const isShowoVerlay = ref(false);

const NotifyModal = ref(null);
const showNotifyModal = ref(false);
const sportState = reactive({ sportTypeActive: null });
const routeRecord = ref({
	newRoute: { path: "", isSportSort: "" },
	oldRoute: { path: "", isSportSort: "" },
});

// const sportType = computed(() => route.query.sportType);

// 计算属性

/**
 * @description 组件生命周期钩子
 */
onBeforeMount(() => {
	pubSub.subscribe("showoVerlay", (data) => {
		console.log("showoVerlay", data);
		isShowoVerlay.value = data;
	});
	LayoutStore.setBigScreen(true);
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);
	initSportRequest();
});

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
	await getAttention();
	await sportsLogin();
	await initSport();
};

/**
 * @description 获取关注列表
 * @param isLogin 是否需要登录
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
	// 判断路由中是否有 sportType 参数
	const sportType = (route.query.sportType as string) || "1"; // 如果没有传入 sportType，则默认为 "1"
	openSportPush(sportType);
};

/**
 * @description 开启体育推送
 */
const openSportPush = async (sportType) => {
	closeSportViewProcessWorker();
	openSportViewProcessWorker();
	console.log("tabActive.value", tabActive.value);
	// 开启球类信息推送
	await handleSportPush();
	// 开启球类赛事数据推送
	await handleSportEventsPush(sportType);

	/*if (route?.meta?.isSportSort) {
	} else if (route.path == "/sports/collect") {
		await openAttentionSSE();
		await getAttention(false);
	} else if (route.path.match(/^\/sports\/\d+\/detail/)) {
		await openEventDetailPush();
	} else {
		stopLoading();
	}*/
};

// 开启对应sports推送
const handleSportPush = async () => {
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	switch (tabActive.value) {
		case "rollingBall":
			sendWorkerCommand(sportTabPushActions.rollingBall.openSport, params);
			break;
		case "todayContest":
			sendWorkerCommand(sportTabPushActions.todayContest.openSport, params);
			break;
		case "morningTrading":
			sendWorkerCommand(sportTabPushActions.morningTrading.openSport, params);
			break;
		case "champion":
			sendWorkerCommand(sportTabPushActions.champion.openSport, params);
			break;
		default:
			sendWorkerCommand(sportTabPushActions.rollingBall.openSport, params);
			break;
	}
};

/**
 * @description 处理体育分类推送
 * @param sportType 球类参数 默认为1 足球
 */
const handleSportEventsPush = async (sportType = "1") => {
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	const pushActions = {
		// 滚球
		rollingBall: () => sendWorkerCommand(sportTabPushActions.rollingBall.openEvents(sportType as string), params),
		// 今日
		todayContest: () => sendWorkerCommand(sportTabPushActions.todayContest.openEvents(sportType as string), params),
		// 早盘
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
			sendWorkerCommand(sportTabPushActions.morningTrading.openEvents(sportType as string), params, { params: queryParams });
		},
		// 冠军
		champion: () => sendWorkerCommand(sportTabPushActions.champion.openEvents(sportType as string), params),
		// 赛果
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
	// 判断tabActive触发对应方法
	const action = pushActions[tabActive.value as keyof typeof pushActions];
	if (!action) {
		return;
	}
	action();
};
/**
 * @description 发送worker命令
 * @param action 动作配置
 * @param params 基础参数
 * @param additionalParams 额外参数
 */
const sendWorkerCommand = (action, params, additionalParams = {}) => {
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, action, params, additionalParams);
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
};

/**
 * @description 开启关注SSE
 */
const openAttentionSSE = async () => {
	closeSportViewProcessWorker();
	openSportViewProcessWorker();
	initSportPubsub();

	if (attentionSwitch.value == "event") {
		openAttentionEventSSE();
	} else {
		openAttentionOutrightSSE();
	}
};

/**
 * @description 开启关注事件SSE
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
 * @description 开启关注冠军SSE
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
 * @description 开启事件详情推送
 */
const openEventDetailPush = async () => {
	const { leagueId, eventId } = route.query;

	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	// sendWorkerCommand(sportTabPushActions.rollingBall.openSport, params),
	sendWorkerCommand(sportsEventDetailPush.openMarkets(eventId), params);
	sendWorkerCommand(sportsEventDetailPush.openEvents(leagueId), params);
};

/**
 * @description 切换大类
 * @param path 路径对象
 */
const onTab = (type: string) => {
	console.log("type", type);
	// 点击当前大类直接退出
	if (tabActive.value == type) return;
	// 更新大类标识
	tabActive.value = type;
	ShopCatControlStore.setShopCatShow(false);
	// 清空数据
	clearStroe();
	//取消体育订阅
	unSubSport();
	// 关闭体育视图线程
	closeSportViewProcessWorker();
	// 订阅
	initSportPubsub();
	// 开启体育线程
	openSportViewProcessWorker();
	// 发起推送
	openSportPush(route.query.sportType as string);
};

/**
 * @description 刷新初始化体育界面
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
 * @description 关闭体育视图处理线程
 */
const closeSportViewProcessWorker = () => {
	try {
		workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	} catch (error) {
		console.error("关闭体育视图处理线程失败", error);
	}
};

/**
 * @description 开启体育视图处理线程
 */
const openSportViewProcessWorker = () => {
	try {
		workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	} catch (error) {
		console.error("开启体育视图处理线程失败", error);
	}
};

/**
 * @description 清除store数据
 */
const clearStroe = async () => {
	viewSportPubSubEventData.clearEventsState();
	SportLeagueSearchStore.clearLeagueSelect();
};

// 监听
/*watch(
	() => route.path,
	(newValue, oldValue) => {
		if (routeRecord.value.newRoute?.path) {
			routeRecord.value.oldRoute = cloneDeep(routeRecord.value.newRoute);
			routeRecord.value.newRoute = {
				path: newValue,
				isSportSort: route.meta?.isSportSort || false,
			};
			if (!routeRecord.value.oldRoute?.isSportSort || !routeRecord.value.newRoute?.isSportSort) {
				initSport();
			}
		} else {
			initSport();
			routeRecord.value.newRoute = {
				path: newValue,
				isSportSort: route.meta?.isSportSort || false,
			};
		}

		ShopCatControlStore.setShopCatShow(false);
		if (!routeRecord.value.oldRoute.path.includes("sportsLeagueSearch")) {
			clearStroe();
		}
	},
	{
		deep: true,
	}
);*/

watch(
	() => UserStore.userInfo.token,
	() => {
		window.location.reload();
	}
);
watch(
	() => SportMorningTradingStore.getActiveDate,
	(newValue) => {
		if (newValue && tabActive.value == "morningTrading") {
			initSport();
		}
	}
);

const { pause, resume } = useIntervalFn(() => sportsLogin(), 8 * 60 * 1000);
</script>

<style lang="scss" scoped>
.base-body {
	width: 1660px;
	height: 100%;
	// max-width: 1636px;
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
		position: relative; // 设置相对定位，购物车弹窗的绝对定位
		margin: 0px 12px;
		flex: 1;
		// width: 1246px;

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
		// margin: 0 10px;
		overflow-y: auto;
	}
	.right-container::-webkit-scrollbar {
		display: none;
	}
}
</style>
