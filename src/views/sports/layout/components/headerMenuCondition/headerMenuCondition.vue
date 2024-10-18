<template>
	<div class="heaerMenuCondition-container" v-if="!isSearch">
		<!-- 左侧分类和开关 -->
		<div class="left">
			<template v-for="(item, index) in MajorCategoriesMenu" :key="index">
				<!-- 今日分类特殊处理，包含开关 -->
				<template v-if="item.type == 'todayContest'">
					<wButton :active="isTodayContestActive(item)" @click="onType(item)"> {{ item.label }}</wButton>
					<wSwitch :switchObj="eventStatusData" :disabled="!isTodayContestRoute" @selected="onEventStatusData"></wSwitch>
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
				<div class="search" @click="handleSearch(true)">
					<div class="icon"><svg-icon name="sports-search" size="14px" /></div>
					<input type="text" placeholder="请输入赛事名称/球队名" />
				</div>
				<!-- 时间/热门开关，仅在特定条件下显示 -->
				<wSwitch v-if="isShowTime" class="ml_12" :switchObj="switchObjRight" :disabled="switchDisable.right" @selected="wSwitchSelectRight"></wSwitch>
			</div>
			<!-- 教程按钮 -->
			<span class="icon"><svg-icon name="sports-tutorial" size="20px"></svg-icon></span>
		</div>
	</div>

	<!-- 搜索框组件 -->
	<searchBar v-else @cancel="handleSearch(false)" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onBeforeMount, onMounted } from "vue";
import { debounce } from "lodash-es";
import { wButton, wSwitch } from "./components";
import { useRouter, useRoute } from "vue-router";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useMatchEvents } from "/@/views/sports/hooks/eventMatch";
import sportsApi from "/@/api/sports/sports"; // 保留引用
import searchBar from "./components/searchBar/searchBar.vue";
import pubsub from "/@/pubSub/pubSub";

const sportsBetEvent = useSportsBetEventStore();
const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const popularLeague = usePopularLeague();
const SportMorningTradingStore = useSportMorningTradingStore();
const { searchMatches } = useMatchEvents();

// 控制是否显示搜索框
const isSearch = ref(false);

// 热门联赛展示
popularLeague.showPopularLeague();

// 开关组件禁用状态
const switchDisable = ref({
	left: false,
	right: false,
});

// 分类数据，用于左侧按钮生成
const MajorCategoriesMenu = ref([
	{ label: "今日", type: "todayContest", path: "/sports/todayContest" },
	{ label: "早盘", type: "morningTrading", path: "/sports/morningTrading" },
	{ label: "冠军", type: "champion", path: "/sports/champion" },
]);

// 今日赛事下的开关状态配置
const eventStatusData = ref({
	on: { label: "滚球", type: "rollingBall", active: route.path === "/sports/todayContest/rollingBall", path: "/sports/todayContest/rollingBall" },
	off: { label: "未开赛", type: "todayContest", active: route.path === "/sports/todayContest/notStarted", path: "/sports/todayContest/notStarted" },
});

// 热门/时间开关状态配置
const switchObjRight = ref({
	on: { label: "时间", type: "time", active: true },
	off: { label: "热门", type: "hot", active: false },
});

// 组件挂载前的初始化
onBeforeMount(() => {
	// 订阅热门联赛列表清除事件
	pubsub.subscribe("clearHotLeagueList", wSwitchSelectRight);
});

// 处理搜索框的显示/隐藏
const handleSearch = (data: boolean) => {
	isSearch.value = data;
};

// 判断是否是今日赛事路由
const isTodayContestRoute = computed(() => {
	return route.path === "/sports/todayContest/rollingBall" || route.path === "/sports/todayContest/notStarted";
});

// 判断今日赛事按钮是否激活
const isTodayContestActive = (item: any) => {
	return route.path == "/sports/todayContest/rollingBall" || route.path == "/sports/todayContest/notStarted";
};

// 点击分类切换
const onType = (item: any) => {
	//  sportsBetEvent.clearHotLeagueList();
	pubsub.publish("clearHotLeagueList", "on");
	// 检查点击的分类是否是 "今日比赛"
	if (item.path === "/sports/todayContest") {
		// 判断 "今日比赛" 下的所有状态是否都是非激活状态
		const allInactive = Object.keys(eventStatusData.value).every((key) => !eventStatusData.value[key].active);
		// 如果所有状态均未激活，默认激活 "on" 状态
		if (allInactive) {
			eventStatusData.value.on.active = true;
		}
		// 如果当前路由已经是 "今日比赛" 页面，则无需做进一步操作
		if (isTodayContestRoute.value) return;
	} else {
		// 对于非 "今日比赛" 的其他分类
		// 如果当前点击的分类和当前路由相同，则不进行任何操作
		if (item.path === route.path) return;
		// 将 "今日比赛" 下的所有状态都设置为非激活状态
		Object.keys(eventStatusData.value).forEach((key) => {
			eventStatusData.value[key as "off" | "on"].active = false;
		});
	}

	// 跳转到所选分类对应的路径
	router.push(item.path);
};

// 切换今日赛事下的滚球/未开赛
const onEventStatusData = (e: "off" | "on") => {
	// 如果当前的路径与所选状态的路径相同，直接返回，不执行任何操作
	if (eventStatusData.value[e].path === route.path) return;
	// 从当前路由中提取 sportType 查询参数
	const { sportType } = route.query;
	// 将 eventStatusData 中所有状态的 active 属性设置为 false，确保只有一个状态处于激活状态
	Object.keys(eventStatusData.value).forEach((key) => {
		eventStatusData.value[key as "off" | "on"].active = false;
	});
	// 将传入的 e 对应的对象 active 设置为 true，激活用户选择的状态
	eventStatusData.value[e].active = true;
	// 跳转到激活状态对应的路径，并保留查询参数 sportType
	router.push({
		path: eventStatusData.value[e].path,
		query: { sportType: sportType },
	});
};

// 是否显示时间/热门开关
const isShowTime = computed(() => {
	// 在路由上获取球类标识参数
	const sportType = route.query.sportType;
	// 只有足球篮球显示热门切换按钮 其余赛事统一显示时间赛事
	if ((sportType === "1" || sportType === "2") && route.meta?.showHotSwitch) {
		return true;
	}
	return false;
});

// 处理右侧热门时间的切换
const wSwitchSelectRight = async (checked: string) => {
	if (checked == "on") {
		sportsBetEvent.clearHotLeagueList();
		switchObjRight.value.on.active = true;
		switchObjRight.value.off.active = false;
	} else {
		switchObjRight.value.on.active = false;
		switchObjRight.value.off.active = true;
		await GetPromotions();
	}
};

// 获取热门赛事
const GetPromotions = async () => {
	let sportType = route.query.sportType;
	const params = {
		query: `$filter=sporttype eq ${sportType}`,
		includeMarkets: "none",
	};
	const res = await sportsApi.GetPromotions(params).catch((err) => err);
	if (res.data) {
		const list = res.data.events?.filter((item: any) => item.sportType === 1);
		sportsBetEvent.setHotLeagueList(list);
	}
};
</script>

<style scoped lang="scss">
.heaerMenuCondition-container {
	width: 100%;
	height: 48px;
	display: flex;
	align-items: center;
	border-radius: 8px 8px 0 0;
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
				padding: 4px 10px;
				border-radius: 4px;
				background-color: var(--Bg2);
				cursor: pointer;
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
