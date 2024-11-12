<template>
	<div style="height: 24px; width: 100%"></div>
	<div class="base-body sports-body">
		<!-- banner控制器 -->
		<BannerController />
		<!-- 体育 主体内容区域  -->
		<venueBanner :bannerList="bannerList"></venueBanner>
		<div class="main-container">
			<!-- 左侧 体育游戏列表 -->
			<div class="left-container">
				<div class="header">
					<!-- 条件选择菜单 -->
					<HeaderMenuCondition @onType="onTab" v-if="isShowCondition" />
					<!-- 下划线装饰，用于区分不同部分 -->
					<div class="line" v-if="isShowCondition"></div>
					<!-- 顶部菜单导航 -->
					<HeaderMenuNav :tabActive="tabActive" />
				</div>
				<div class="back-container">
					<!-- 主体路由页面显示区域 -->
					<transition name="fade">
						<div>
							<router-view v-cloak />
						</div>
					</transition>
					<!-- 搜索触发的遮罩 -->
					<div class="overlay" v-if="isShowMask"></div>
				</div>
			</div>

			<!-- 右边侧边栏，只有在特定条件下显示 -->
			<div class="right-container" v-if="popularLeague.visible && !hideSlider">
				<Sidebar v-if="SportsInfoStore.getSportsToken" />
			</div>
		</div>

		<!-- 购物车，特定条件下显示 -->
		<SportsShopCart v-if="popularLeague.visible" />
	</div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import { useSportsInfoStore } from "/@/stores/modules/sports/sportsInfo";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useUserStore } from "/@/stores/modules/user";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import pubSub from "/@/pubSub/pubSub";
import SportsApi from "/@/api/sports/sports";
import { HeaderMenuNav, HeaderMenuCondition, SportsShopCart, Sidebar } from "./components";
import { useSportEvents } from "/@/views/sports/hooks/useSportEvents";
import userBanner from "./components/banner";
import workerManage from "/@/webWorker/workerManage";
import { bannerApi } from "/@/api/banner";
const SportAttentionStore = useSportAttentionStore();
// 路由实例
const route = useRoute();
const router = useRouter();

// 各种 store 实例
const sportsBetEvent = useSportsBetEventStore();
const popularLeague = usePopularLeague();
const SportsInfoStore = useSportsInfoStore();
const UserStore = useUserStore();
const { openSportPush } = useSportEvents();
const { initSportPubsub, unSubSport, clearState, sportsLogin } = useSportPubSubEvents();

// 是否显示遮罩层
const isShowMask = ref(false);
// 体育相关事件 hooks
// 当前选中的标签，用于顶部菜单导航
const tabActive = ref("");
// 是否显示条件菜单，根据路由 meta 类型判断
const isShowCondition = computed(() => route.meta.type === "list");

const bannerList = ref([]);
const getBannerList = () => {
	bannerApi
		.queryBannerList({
			gameOneClassId: "SBA",
		})
		.then((res) => {
			bannerList.value = res.data;
		});
};
// 监听路由地址变化，切换推送
watch(
	() => route.fullPath,
	(newValue, oldValue) => {
		if (newValue !== oldValue) {
			// sportsBetEvent.clearHotLeagueList();
			pubSub.publish("SkeletonLoading", true);
			openSportPush(route.query.sportType as string, tabActive.value);
		}
	}
);
// 生命周期钩子函数
onBeforeMount(() => {
	// 订阅遮罩层显示事件
	pubSub.subscribe("showOverlay", (data) => {
		isShowMask.value = data;
	});
	// 订阅关注变化事件
	pubSub.subscribe(pubSub.PubSubEvents.SportEvents.attentionChange.eventName, getAttention);
	// 初始化体育请求
	initSportRequest();
	getBannerList();
});

onBeforeUnmount(() => {
	// 卸载体育相关事件
	unSport();
	// 暂停定时执行
	pauseInterval();
});

// 定时执行体育登录，间隔 8 分钟
const { pause: pauseInterval } = useIntervalFn(() => sportsLogin(), 8 * 60 * 1000);

// 初始化体育请求
const initSportRequest = async () => {
	// 判断token状态
	if (UserStore.getUserInfo.token) {
		// 获取关注列表
		await getAttention();
	}
	// 体育登录
	await sportsLogin();
	// 初始化体育订阅
	initSportPubsub();
	const sportType = (route.query.sportType as string) || "1";
	pubSub.publish("showSkeleton", true);
	openSportPush(sportType); // 恢复 openSportPush 调用
};

// 获取用户关注的体育列表
const getAttention = async (isLogin = true) => {
	if ((isLogin && UserStore.getUserInfo) || !isLogin) {
		const res = await SportsApi.getAttentionList();
		if (res.data) {
			SportAttentionStore.setAttentionList(res.data);
		}
	}
};

// 切换顶部标签
const onTab = (type: string) => {
	if (tabActive.value === type) return;
	tabActive.value = type;
};

// 卸载体育相关事件
const unSport = () => {
	// 清除当前体育的状态，重置所有相关状态变量
	clearState();
	// 取消体育推送订阅，停止接收新的体育数据更新
	unSubSport();
	// 清空热门联赛列表数据，避免残留数据影响后续操作
	sportsBetEvent.clearHotLeagueList();
	// 发布清除热门联赛列表的事件，通知其他组件进行相关处理
	pubSub.publish("clearHotLeagueList", "on");
	clearState();
	workerManage.stopWorker(workerManage.WorkerMap.sportViewProcessWorker.workerName);
};

const hideSlider = ref(false);
const handleScreenWidthChange = (event) => {
	if (event.matches) {
		// 窄屏处理逻辑
		hideSlider.value = true;
	} else {
		// 宽屏处理逻辑
		hideSlider.value = false;
	}
};

onBeforeMount(() => {
	const mediaQuery = window.matchMedia("(max-width: 1439px)"); // 设置需要的宽度
	// 添加监听器
	mediaQuery.addListener(handleScreenWidthChange);

	// 初次调用，检查当前宽度
	handleScreenWidthChange(mediaQuery);
});

const { Banner, BannerController } = userBanner();
</script>

<style lang="scss" scoped>
@import "./media/media-1440.scss";
@import "./media/media-1024.scss";
.base-body {
	width: 1308px;
	height: calc(100vh - 88px);
	margin: 0 auto;
	:deep(.banner-controller) {
		position: fixed;
		top: 60px;
		left: 50%;
		transform: translateX(-50%);
	}
	// overflow-x: auto;
}

.main-container {
	width: 100%;
	height: 100%;
	display: flex;
	overflow: hidden;
	overflow-x: auto;
	justify-content: center;
	.left-container {
		// width: 930px;
		flex: 1;
		height: 100%;
		overflow: hidden;

		.header {
			width: 100%;
			box-sizing: border-box;
			.line {
				width: 100%;
				height: 1px;
				background: var(--Line-1);
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
