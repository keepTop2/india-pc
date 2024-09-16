<template>
	<div class="heaerMenuCondition-container">
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
					<input type="text" placeholder="请输入赛事名称/球队名" @input="getFilterEvents" />
				</div>
				<!-- 时间/热门开关，仅在特定条件下显示 -->
				<wSwitch :switchObj="switchObjRight" :disabled="switchDisable.right"></wSwitch>
			</div>
			<!--  -->
			<span class="icon"><svg-icon name="sports-screening" size="20px"></svg-icon></span>
			<!-- 教程 -->
			<span class="icon"><svg-icon name="sports-tutorial" size="20px"></svg-icon></span>
		</div>

		<!-- 教程 -->
		<!-- <Modal v-if="showBettingRules" :before-close="closeBettingRules" @close="closeBettingRules">
			<component :is="bettingRulesModal" />
		</Modal> -->
	</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, DefineComponent, markRaw, onMounted, reactive, Ref, ref, watch } from "vue";
import { debounce } from "lodash-es";
import { wButton, wSwitch } from "./components";
import { useRouter, useRoute } from "vue-router";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { useMatchEvents } from "/@/views/sports/hooks/eventMatch";
import Modal from "../Modal/index.vue";

// 初始化所需的store
const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();
const SportLeagueSeachStore = useSportLeagueSeachStore();
const SportSortStore = useSportSortStore();
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
	on: { label: "滚球", type: "rollingBall", active: true, path: "/sports/todayContest/rollingBall" },
	off: { label: "未开赛", type: "todayContest", active: false, path: "/sports/todayContest/notStarted" },
});

// 热门-时间开关配置
const switchObjRight = ref({
	on: { label: "时间", type: "time", active: true },
	off: { label: "热门", type: "hot", active: false },
});

// 组件挂载后的初始化操作
onMounted(() => {});

const onType = (item: any) => {
	if (item.path === "/sports/todayContest") {
		// eventStatusData.value.on.active = true;
		const allInactive = Object.keys(eventStatusData.value).every((key) => !eventStatusData.value[key].active);
		if (allInactive) {
			eventStatusData.value.on.active = true;
		}
		if (route.path == "/sports/todayContest/rollingBall" || route.path == "/sports/todayContest/notStarted") return;
	} else {
		Object.keys(eventStatusData.value).forEach((key) => {
			eventStatusData.value[key as "off" | "on"].active = false;
		});
	}
	router.push(item.path);
	if (item.path === "/sports/todayContest") {
		const activeItem: any = Object.values(eventStatusData.value).find((item) => item.active);
		emit("onType", activeItem.type);
	} else {
		emit("onType", item.type);
	}
};

const onEventStatusData = (e: "off" | "on") => {
	console.log("e", e);

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
	emit("onType", eventStatusData.value[e].type);
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
