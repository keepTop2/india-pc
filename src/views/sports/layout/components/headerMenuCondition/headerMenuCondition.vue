<template>
	<div class="heaerMenuCondition-container" v-if="!isSearch">
		<!-- 左侧分类和开关 -->
		<div class="left">
			<template v-for="(item, index) in MajorCategoriesMenu" :key="index">
				<!-- 今日分类特殊处理，包含开关 -->
				<template v-if="item.type == `todayContest`">
					<wButton :active="route.path == '/sports/todayContest/rollingBall' || route.path == '/sports/todayContest/notStarted'" @click="onType(item)"> {{ item.label }}</wButton>
					<wSwitch
						:switchObj="eventStatusData"
						:disabled="route.path != '/sports/todayContest/rollingBall' && route.path != '/sports/todayContest/notStarted'"
						@selected="onEventStatusData"
					></wSwitch>
				</template>
				<!-- 其他分类 -->
				<template v-else>
					<wButton :active="route.path == item.path" @click="onType(item)"> {{ item.label }}</wButton>
				</template>
			</template>
		</div>
		<!-- 右侧功能区 -->
		<div class="right">
			<div class="filter_operation">
				<!-- 搜索框占位 -->
				<div class="search">
					<div class="icon"><svg-icon name="sports-search" size="14px" /></div>
					<input type="text" placeholder="请输入赛事名称/球队名" @click="handleSearch(true)" />
				</div>
				<!-- 时间/热门开关，仅在特定条件下显示 -->
				<wSwitch v-if="isShowTime" :switchObj="switchObjRight" :disabled="switchDisable.right" @selected="wSwitchSelectRight"></wSwitch>
			</div>
			<!--  -->
			<!-- <span class="icon"><svg-icon name="sports-screening" size="20px"></svg-icon></span> -->
			<!-- 教程 -->
			<span class="icon"><svg-icon name="sports-tutorial" size="20px"></svg-icon></span>
		</div>

		<!-- 教程 -->
		<!-- <Modal v-if="showBettingRules" :before-close="closeBettingRules" @close="closeBettingRules">
			<component :is="bettingRulesModal" />
		</Modal> -->
	</div>
	<!-- 搜索框组件 -->
	<searchBar v-else @cancel="handleSearch(false)" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, DefineComponent, markRaw, onBeforeMount, onMounted, reactive, Ref, ref, watch } from "vue";
import { debounce } from "lodash-es";
import { wButton, wSwitch } from "./components";
import { useRouter, useRoute } from "vue-router";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useMatchEvents } from "/@/views/sports/hooks/eventMatch";
import sportsApi from "/@/api/sports/sports";
import searchBar from "./components/searchBar/searchBar.vue";
import Modal from "../Modal/index.vue";
import pubsub from "/@/pubSub/pubSub";
const sportsBetEvent = useSportsBetEventStore();
// 初始化所需的store
const isSearch = ref(false);
const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const popularLeague = usePopularLeague();
const SportMorningTradingStore = useSportMorningTradingStore();
const { searchMatches } = useMatchEvents();
const bettingRulesModal: any = ref(null);
const showBettingRules = ref(true);
// 展示热门联赛
popularLeague.showPopularLeague();

// 组件props定义
const props = withDefaults(
	defineProps<{
		/**
		 * @description: 选中的赛选类型
		 */
		sportsActive?: string;
	}>(),
	{
		sportsActive: "",
	}
);
// 定义组件事件
const emit = defineEmits(["onRefresh", "onExpand", "onCollapse", "onType"]);

// 分类数据
const MajorCategoriesMenu = ref([
	{ label: "今日", type: "todayContest", path: "/sports/todayContest" },
	{ label: "早盘", type: "morningTrading", path: "/sports/morningTrading" },
	{ label: "冠军", type: "champion", path: "/sports/champion" },
]);
// switch组件禁用状态
const switchDisable = ref({
	left: false,
	right: false,
});

// 今日下-按钮配置
const eventStatusData = ref({
	on: { label: "滚球", type: "rollingBall", active: route.path === "/sports/todayContest/rollingBall" ? true : false, path: "/sports/todayContest/rollingBall" },
	off: { label: "未开赛", type: "todayContest", active: route.path === "/sports/todayContest/notStarted" ? true : false, path: "/sports/todayContest/notStarted" },
});

// 热门-时间开关配置
const switchObjRight = ref({
	on: { label: "时间", type: "time", active: true },
	off: { label: "热门", type: "hot", active: false },
});

// 组件挂载后的初始化操作
onMounted(() => {});

onBeforeMount(() => {
	pubsub.subscribe("clearHotLeagueList", wSwitchSelectRight);
});

const handleSearch = (data: boolean) => {
	isSearch.value = data;
};

// 点击大类
const onType = (item: any) => {
	if (item.path === "/sports/todayContest") {
		// eventStatusData.value.on.active = true;
		const allInactive = Object.keys(eventStatusData.value).every((key) => !eventStatusData.value[key].active);
		if (allInactive) {
			eventStatusData.value.on.active = true;
		}
		if (route.path == "/sports/todayContest/rollingBall" || route.path == "/sports/todayContest/notStarted") return;
	} else {
		if (item.path === route.path) return;
		Object.keys(eventStatusData.value).forEach((key) => {
			eventStatusData.value[key as "off" | "on"].active = false;
		});
	}
	router.push(item.path);
	if (item.type === "todayContest") {
		const activeItem: any = Object.values(eventStatusData.value).find((item) => item.active);
		// console.log("activeItem", activeItem);
		emit("onType", activeItem.type);
	} else {
		emit("onType", item.type);
	}
};

const onEventStatusData = (e: "off" | "on") => {
	if (eventStatusData.value[e].path === route.path) return;
	const { sportType } = route.query;
	Object.keys(eventStatusData.value).forEach((key) => {
		eventStatusData.value[key as "off" | "on"].active = false;
	});
	// 将传入的 e 对应的对象 active 改为 true
	eventStatusData.value[e].active = true;
	// 跳转到对应路由
	const targetPath = eventStatusData.value[e].path;
	router.push({
		path: targetPath,
		query: { sportType: sportType },
	});
	// console.log("e=================>", e);

	emit("onType", eventStatusData.value[e].type);
};

/**
 * @description: 是否显示排序方式按钮
 */
const isShowTime = computed(() => {
	const sportType = route.query.sportType;
	// console.log(route, "======route");
	if ((sportType === "1" || sportType === "2") && route.meta?.type === "list") {
		return true;
	}
	return false;
});
/**
 * @description: 右侧热门时间变动处理
 * @param {boolean} checked 选中状态
 * @param {boolean} isMounted 是否是挂载时调用
 * on 时间 off 热门
 */
const wSwitchSelectRight = async (checked: string, isMounted: boolean = false) => {
	if (checked == "on") {
		sportsBetEvent.clearHotLeagueList();
		switchObjRight.value.on.active = true;
		switchObjRight.value.off.active = false;
	} else {
		switchObjRight.value.on.active = false;
		switchObjRight.value.off.active = true;
		await GetPromotions();
	}
	// !isMounted && onRefresh();
};

/**
 * @description 获取热门赛事
 */
const GetPromotions = async () => {
	let sportType = route.query.sportType;
	const params = {
		query: `$filter=sporttype eq ${sportType}`,
		includeMarkets: "none",
	};
	const res = await sportsApi.GetPromotions(params).catch((err) => err);
	console.log(res.data, "-----re");
	if (res.data) {
		const list = res.data.events;
		sportsBetEvent.setHotLeagueList(list);
		// SportSortStore.setIsActiveHot(true);
	}
};

// 输入框事件监听
const getFilterEvents = debounce((event) => {
	const query = event.target.value;
	console.log("event", query);
	if (!query) return;
	// 直接调用 searchMatches 方法
	searchMatches(query);
}, 500);
</script>

<style scoped lang="scss">
.heaerMenuCondition-container {
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	border-radius:  8px 8px 0 0;
	background: var(--Bg1);
	.left {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		gap: 10px;
		padding-left: 24px;
	}

	.right {
		height: 100%;
		display: flex;
		align-items: center;
		gap: 24px;
		padding-right: 20px;
		.filter_operation {
			display: flex;
			align-items: center;
			.search {
				width: 200px;
				height: 30px;
				display: flex;
				gap: 10px;
				align-items: center;
				margin-right: 12px;
				padding: 4px 10px;
				border-radius: 4px;
				background-color: var(--Bg2);
				.icon {
					width: 14px;
					height: 14px;
					display: flex;
					align-items: center;
				}
				input {
					flex: 1;
					background-color: transparent;
					border: 0px;
					color: var(--Text_a);
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
					&::placeholder {
						color: var(--Text1);
						font-family: "PingFang SC";
						font-size: 12px;
						font-weight: 400;
					}
				}
			}
		}
		.icon {
			width: 20px;
			height: 20px;
			cursor: pointer;
		}
	}
}
</style>
