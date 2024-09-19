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
						<HeaderMenuNav :sportsActive="tabActive"></HeaderMenuNav>
						<div class="line"></div>
						<HeaderMenuCondition :sportsActive="tabActive" v-if="$route?.meta?.isSportSort" @onRefresh="onRefresh" @onType="onTab"></HeaderMenuCondition>
					</div>
					<div class="back-container">
						<!-- 主体路由页面 -->
						<router-view v-cloak />
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
import { computed, defineAsyncComponent, markRaw, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from "vue";
import { cloneDeep, isEmpty } from "lodash-es";
import Modal from "./components/Modal/index.vue";
import moment from "moment";
import workerManage from "/@/webWorker/workerManage";
import Common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import pubSub from "/@/pubSub/pubSub";
import { useIntervalFn } from "@vueuse/core";
import { formattingResultViewData } from "/@/views/sports/utils/formattingViewData";
import { sportTabPushActions } from "/@/views/sports/utils/sportsMap/sportsSSERequestMap";
import { useRoute, useRouter } from "vue-router";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { Sports, SportData, SportViewData } from "/@/views/sports/models/interface";
import { ServerData } from "/@/views/sports/models/commonInterface";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useLayoutStore } from "/@/stores/modules/layout";
import { useUserStore } from "/@/stores/modules/user";
import { Notification } from "/@/components/index";
import { WorkerName, SportViewProcessWorkerCommandType } from "/@/enum/workerTransferEnum";
import { OpenSportEventSourceParams } from "/@/views/sports/models/sportEventSourceModel";
import { HeaderMenuNav, HeaderMenuCondition, HeaderNotify, SportsShopCart, Sidebar, sportRight } from "./components";
import { i18n } from "/@/i18n/index";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { useLoading } from "/@/directive/loading/hooks";
import SportsCommonFn from "/@/views/sports/utils/common";
import { FootballCardApi } from "/@/api/sports/footballCard";
import PubSub from "/@/pubSub/pubSub";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import { betTypes } from "/@/views/sports/utils/sportsMap/sportsBetType";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

import { useToLogin } from "/@/hooks/toLogin";
const { isHaveToken, toLogin } = useToLogin();

const { startLoading, stopLoading } = useLoading();
const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();
const $: any = i18n.global;
const popularLeague = usePopularLeague();
const SportsInfoStore = useSportsInfoStore();
// const sportAttention = useSportAttentionStore();

const SportsBetEventStore = useSportsBetEventStore();
const SportAttentionStore = useSportAttentionStore();
const SportMorningTradingStore = useSportMorningTradingStore();
const LayoutStore = useLayoutStore();
const UserStore = useUserStore();

const SportLeagueSearchStore = useSportLeagueSearchStore();
const ShopCatControlStore = useShopCatControlStore();

const route = useRoute();
const router = useRouter();

const NotifyModal: any = ref(null);
const showNotifyModal = ref(false);
/** 打开体育参数  */
export interface SendParams {
	/**用户账号 */
	userAccount?: string;
	/** 设备：0:后台 1:PC 2:IOS_H5 3:IOS_APP 4:Android_H5 5:Android_APP */
	device?: number;
	/** 场馆code */
	venueCode?: string;
	/** 游戏code */
	gameCode?: string;
	/** 游戏code */
	gameId?: string;
	/** 客户端ip */
	ip?: string;
}

/*选中的类型项 */
type TabOptions = "rollingBall" | "todayContest" | "morningTrading" | "champion" | "attention" | "matchResult";
/**
 * @description 组件挂载之前根据路由设置选中的tab
 */
const tabActive = ref<TabOptions>("rollingBall");

const sportState = reactive({ sportTypeActive: null as number | null });

/** 路由记录( 用于判断是否需要重建sport数据)  */
const routeRecord = ref({
	newRoute: {
		path: "" as any,
		isSportSort: "" as any,
	},
	oldRoute: {
		path: "" as any,
		isSportSort: "" as any,
	},
});

const { pause, resume } = useIntervalFn(() => sportsLogin(), 8 * 60 * 1000);

/**
 * 卸载
 */
onBeforeUnmount(() => {
	// 卸载体育
	unSport();
	pause();
});
onBeforeMount(() => {
	LayoutStore.setBigScreen(true);
	PubSub.subscribe(PubSub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);
	initSportRequest();
});
const initSportRequest = async () => {
	//获取关注列表
	getAttention();
	// 体育登录
	await sportsLogin();
	// 初始化体育
	await initSport();
};

/**清除store数据 */
const clearStroe = () => {
	SportLeagueSearchStore.clearLeagueSelect();
};

watch(
	() => route.path,
	(newValue, oldValue) => {
		if (routeRecord.value.newRoute?.path) {
			routeRecord.value.oldRoute = cloneDeep(routeRecord.value.newRoute);
			routeRecord.value.newRoute = {
				path: newValue,
				isSportSort: route.meta?.isSportSort || false,
			};
			// console.info("routeRecord.value.", routeRecord.value);
			/** 路由记录 当判断isSportSort 不一致时；进行数据请求  */
			if (!routeRecord.value.oldRoute?.isSportSort || !routeRecord.value.newRoute?.isSportSort) {
				// console.info("路由记录 当判断isSportSort 不一致时；进行");
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
		// 如果不是从搜索页面跳转的就不清除store数据  否则清除
		if (!routeRecord.value.oldRoute.path.includes("sportsLeagueSearch")) {
			clearStroe();
		}
	},
	{
		deep: true,
		// immediate: true,
	}
);

onUnmounted(() => {
	LayoutStore.setBigScreen(false);
});
const attentionSwitch = computed(() => SportAttentionStore.attentionType);

watch(
	() => UserStore.userInfo.token,
	(newValue, oldValue) => {
		/**改为token 变动时就进行更新体育token */
		window.location.reload();
	}
);

watch(
	() => SportMorningTradingStore.getActiveDate,
	(newValue, oldValue) => {
		if (newValue && tabActive.value == "morningTrading") {
			initSport();
		}
	}
);

/**
 * @description: 关闭体育线程
 * @return {*}
 */
const closeSportViewProcessWorker = () => {
	try {
		workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	} catch (error) {}
};

/**
 * @description: 开启体育线程
 * @return {*}
 */
const openSportViewProcessWorker = () => {
	try {
		workerManage.startWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
	} catch (error) {}
};

/**
 * @description 获取关注列表
 * @param isLogin 是否需要登陆
 */
const getAttention = async (isLogin = true) => {
	if (isLogin) {
		if (!isEmpty(UserStore.getUserInfo)) {
			handleGetAttention();
		}
	} else {
		handleGetAttention();
	}
};

/**
 * @description 获取关注列表
 */

const handleGetAttention = () => {
	return new Promise((resolve, reject) => {
		FootballCardApi.getAttentionList().then((res) => {
			if (res.data) {
				SportAttentionStore.setAttentionList(res.data);
				resolve(res.data);
			} else {
				reject(res);
			}
		});
	});
};

//初始化体育
const initSport = async () => {
	initSportPubsub();
	openSportPush();
};

const initSportPush = () => {
	//打开冠军页面  loading不停 所以注释
	startLoading();
	//线程名称 体育视图处理线程
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	//console.warn("第二步 准备发送指令到线程管理器", pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName);
	//线程指令 体育eventSource 指令
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;
	//console.warn("第二步 准备发送指令到线程管理器", pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType);
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};

	if (tabActive.value == "rollingBall") {
		//清空参数
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
		//参数赋值
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.rollingBall.openSport, params);
		//发送SSE指令到线程管理器
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	}

	//如果当前激活的tab是 今日
	else if (tabActive.value == "todayContest") {
		//清空参数
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
		//参数赋值
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.todayContest.openSport, params);
		//发送SSE指令到线程管理器
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	}

	//如果当前激活的tab是 早盘
	else if (tabActive.value == "morningTrading") {
		//清空参数
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
		//参数赋值
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.morningTrading.openSport, params);
		//发送SSE指令到线程管理器
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	}

	//如果当前激活的tab是 冠军
	else if (tabActive.value == "champion") {
		//清空参数
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;

		//参数赋值
		pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.champion.openSport, params);
		//发送SSE指令到线程管理器
		pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	}
};

/**
 * @description 发送指令到体育视图处理线程 开启SSE推送
 */
const openSportPush = async () => {
	// 关闭体育线程
	closeSportViewProcessWorker();
	// 开启体育线程
	openSportViewProcessWorker();

	const query = { ...route?.query, sportsActive: tabActive.value };
	//路由添加请求时的选中类型；用于页面判断展示内容；
	router.replace({ path: route.path, query: query });
	// console.info("路由添加请求时的选中类型；用于页面判断展示内容；", route);
	//stopLoading  在useSportPubSubEvents hooks 中触发 停止loading
	//打开冠军页面  loading不停 所以注释
	startLoading();
	//线程名称 体育视图处理线程
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	//console.warn("第二步 准备发送指令到线程管理器", pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName);
	//线程指令 体育eventSource 指令
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;
	//console.warn("第二步 准备发送指令到线程管理器", pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType);
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	console.log(tabActive.value, "==tabActive.value ");
	initSportPush();
	if (route?.meta?.isSportSort) {
		// router.push({ path: route.path, query: { sportsActive: tabActive.value } });
		//console.warn("第二步 准备发送指令到线程管理器", params);
		//如果当前激活的tab是 滚球
		if (tabActive.value == "rollingBall") {
			//清空参数
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
			//参数赋值
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.rollingBall.openEvents, params);
			//发送SSE指令到线程管理器
			pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
		}

		//如果当前激活的tab是 今日
		else if (tabActive.value == "todayContest") {
			//清空参数
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
			//参数赋值
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.todayContest.openEvents, params);
			//发送SSE指令到线程管理器
			pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);

			// await sportTabPushActions.todayContest.openSport?.();

			// await sportTabPushActions.todayContest.openEvents?.();
		}

		//如果当前激活的tab是 早盘
		else if (tabActive.value == "morningTrading") {
			// //清空参数
			// pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
			// //参数赋值
			// pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.morningTrading.openEvents, params);
			// //发送SSE指令到线程管理器
			// pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
			openMorningTradingSSE();
		}

		//如果当前激活的tab是 冠军
		else if (tabActive.value == "champion") {
			//清空参数
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
			//参数赋值
			pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.champion.openEvents, params);
			// console.info(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName);
			// console.info(pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
			//发送SSE指令到线程管理器
			pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
			stopLoading();
		}

		//如果当前激活的tab是 赛果
		else if (tabActive.value == "matchResult") {
			await getMatchResult();
		}

		//如果当前激活的tab是 关注
		else if (tabActive.value == "attention") {
			console.log("点击关注");
		}
	} else if (route.path == "/sports/collect") {
		/** 关注收藏 */
		openAttentionSSE();
		getAttention(false);
	} else {
		// closeSportViewProcessWorker();
		stopLoading();
	}
};

/**早盘sse数据请求 */
const openMorningTradingSSE = () => {
	const ActiveDate = SportMorningTradingStore.getActiveDate;
	const { startDate, endDate } = SportMorningTradingStore.getTimeInterval;
	const params = {
		apiUrl: SportsCommonFn.getSportPushApiUrl(),
		token: SportsInfoStore.getSportsToken,
		language: SportsCommonFn.getSportLanguage(),
	};
	const queryParams: any = {};
	if (SportMorningTradingStore.getActiveDate) {
		queryParams["params"] = {
			query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
			from: startDate,
			until: endDate,
			includeMarkets: `$filter=bettype in (${betTypes})`,
		};
	} else {
		queryParams["params"] = {
			query: `$filter= sportType in (${SportsCommonFn.getRequestSportsType()})`,
			includeMarkets: `$filter=bettype in (${betTypes})`,
			from: moment
				.utc()
				.add(8 - 5 / 24, "day")
				.startOf("day")
				.add(5, "hour")
				.format("YYYY-MM-DDTHH:mm:ss"),
		};
	}
	// // startLoading();
	// pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	// //参数赋值
	// pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.morningTrading.openSport, params);
	// //发送SSE指令到线程管理器
	// pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.morningTrading.openEvents, params, queryParams);
	//发送SSE指令到线程管理器
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
};

/**
 * @description: 开启关注SSE event
 * @return {*}
 */
const openAttentionEventSSE = async () => {
	//stopLoading  在useSportPubSubEvents hooks 中触发 停止loading
	//线程名称 体育视图处理线程
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	//线程指令 体育eventSource 指令
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;

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
	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.attention.openEvents, params, attentionParams);
	//发送SSE指令到线程管理器
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
};

/**
 * @description: 开启关注冠军的SSE;
 * @return {*}
 */
const openAttentionOutrightSSE = async () => {
	//stopLoading  在useSportPubSubEvents hooks 中触发 停止loading
	//线程名称 体育视图处理线程
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.workerName = WorkerName.sportViewProcessWorker;
	//线程指令 体育eventSource 指令
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.commandType = SportViewProcessWorkerCommandType.sportEventSource;

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
	//清空参数
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = {} as OpenSportEventSourceParams;
	//参数赋值
	pubSub.PubSubEvents.WorkerEvents.viewToWorker.params!.data = Object.assign({}, sportTabPushActions.attention.openOutright, params, attentionParams);
	//发送SSE指令到线程管理器
	pubSub.publish(pubSub.PubSubEvents.WorkerEvents.viewToWorker.eventName, pubSub.PubSubEvents.WorkerEvents.viewToWorker.params);
	// stopLoading();
};

/**
 * @description: 开启关注SSE；
 * @return {*}
 */
const openAttentionSSE = async () => {
	closeSportViewProcessWorker();
	openSportViewProcessWorker();
	initSportPush();
	if (attentionSwitch.value == "event") {
		openAttentionEventSSE();
	} else {
		openAttentionOutrightSSE();
	}
};

// 切换tab时 根据path处理对应的获取数据逻辑
const onTab = (path: any) => {
	console.log(path, "=====path");
	ShopCatControlStore.setShopCatShow(false);
	clearStroe();
	if (tabActive.value == path.type) {
		return;
	}
	unSubSport();
	closeSportViewProcessWorker();
	//设置当前选中的tab 跳转到对应的路由
	tabActive.value = path.type;
	initSportPubsub();
	openSportViewProcessWorker();
	//开启体育推送
	openSportPush();
};

/**
 * @description: 刷新 初始化体育界面
 * @return {*}
 */
const onRefresh = () => {
	initSport();
};

const getMatchResult = async () => {
	// 获取当前日期
	const today = moment();
	// 获取当前日期往前12天
	const twelveDaysAgo = moment().subtract(11, "day");
	const format = "YYYY-MM-DD";
	const res = await sportsApi
		.GetSportResults({
			language: "zhcn",
			from: `${twelveDaysAgo.format(format)}T00:00:00`,
			until: `${today.format(format)}T23:59:59`,
		})
		.catch((err) => err);
	//获取赛果数量后 添加到sports中
	if (res.data) {
		const sportList = res.data.sportList;
		viewSportPubSubEventData.setSportData({
			...viewSportPubSubEventData.viewSportData,
			sports: formattingResultViewData(sportList),
		});
		//初始化球类路由状态
		// initRouter();
	}
};

//卸载体育
const unSport = () => {
	clearState();
	//关掉体育视图线程
	closeSportViewProcessWorker();
	//取消订阅体育事件
	unSubSport();
};

const openNotify = () => {
	NotifyModal.value = markRaw(defineAsyncComponent(() => import(`./components/Notify/index.vue`)));
	showNotifyModal.value = true;
};

const closeNotifyModal = () => {
	showNotifyModal.value = false;
};
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

			&.back-container {
				background-color: var(--Bg);
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
