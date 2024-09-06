<!--
 * @Author: WangMingxin
 * @Description: 体育-头部-条件区分
 * @Component: 头部菜单条件组件
 * @Features:
 *   - 左侧分类选择（今日、早盘、冠军）
 *   - 左侧开关（未开赛/滚球）
 *   - 右侧搜索框（待定）
 *   - 右侧开关（时间/热门）
 *   - 刷新和展开/收起功能
-->
<template>
	<div class="heaerMenuCondition-container">
		<!-- 左侧分类和开关 -->
		<div class="left">
			<template v-for="(item, index) in classification" :key="index">
				<!-- 今日分类特殊处理，包含开关 -->
				<template v-if="item.type == `today`">
					<wButton :active="item.active" @click="onType(item)"> {{ item.label }}</wButton>
					<wSwitch :switchObj="switchObj" :disabled="switchDisable.left" @selected="wSwitchSelect"></wSwitch>
				</template>
				<!-- 其他分类 -->
				<template v-else>
					<wButton :active="item.active" @click="onType(item)"> {{ item.label }}</wButton>
				</template>
			</template>
		</div>
		<!-- 右侧功能区 -->
		<div class="right">
			<div class="filter_operation">
				<!-- 搜索框占位 -->
				<div>搜索框待定，需要确认是否支持筛选</div>
				<!-- 时间/热门开关，仅在特定条件下显示 -->
				<wSwitch v-if="isShowTime" :switchObj="switchObjRight" :disabled="switchDisable.right" @selected="wSwitchSelectRight"></wSwitch>
			</div>
			<!-- 刷新按钮 -->
			<span class="icon" @click="onRefresh"><svg-icon name="sports-screening" size="20px"></svg-icon></span>
			<!-- 展开/收起按钮 -->
			<span class="icon" @click="onExpandAndCollapse"><svg-icon name="sports-tutorial" size="20px"></svg-icon></span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import moment from "moment";
import { wButton, wSwitch } from "./components";

import { useRouter, useRoute } from "vue-router";
import pubSub from "/@/pubSub/pubSub";
import sportsApi from "/@/api/sports/sports";
import SportsCommon from "/@/views/sports/utils/common";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
import { useSportSortStore } from "/@/stores/modules/sports/sportSort";
import { useSportMorningTradingStore } from "/@/stores/modules/sports/sportMorningTrading";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";

// 初始化所需的store
const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();
const SportLeagueSeachStore = useSportLeagueSeachStore();
const SportSortStore = useSportSortStore();
const popularLeague = usePopularLeague();
const SportMorningTradingStore = useSportMorningTradingStore();

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

// 监听路由变化，重置收起展开图标
watch(
	() => route.path,
	() => {
		SportAttentionStore.setIsFold(false);
	}
);

/**
 * @description: 设置默认选中项
 */
const setDefaultActive = () => {
	// 判断第一层赛选对象
	classification.value.forEach((item) => {
		if (item.type == props.sportsActive && !item.active) {
			onType(item);
		}
	});
	// 判断第二层赛选对象
	Object.keys(switchObj.value).forEach((key) => {
		if (switchObj.value[key].type == props.sportsActive) {
			switchObj.value[key].active = true;
		} else {
			switchObj.value[key].active = false;
		}
	});
};

/**
 * @description: 是否显示排序方式按钮
 */
const isShowTime = computed(() => {
	if (route.name?.indexOf("football") != -1 || route.name?.indexOf("basketball") != -1) {
		if (route?.query?.sportsActive == `champion`) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
});

// 组件挂载后的初始化操作
onMounted(() => {
	setDefaultActive();
	wSwitchSelectRight(!SportSortStore.getIsActiveHot && "on", true);
});

// 定义组件事件
const emit = defineEmits(["onRefresh", "onExpand", "onCollapse", "onType"]);

// switch组件禁用状态
const switchDisable = ref({
	left: false,
	right: false,
});

/**
 * @description: 分类数据
 */
const classification = ref([
	{ label: "今日", type: "today", active: true },
	{ label: "早盘", type: "morningTrading", active: false },
	{ label: "冠军", type: "champion", active: false },
]);

/**
 * @description: 今日下-按钮配置
 */
const switchObj = ref({
	on: { label: "未开赛", type: "todayContest", active: false },
	off: { label: "滚球", type: "rollingBall", active: true },
});

/**
 * @description: 左侧Switch选项处理
 * @param {boolean} checked 选中状态
 */
const wSwitchSelect = (checked: string) => {
	console.log(checked, "===cheked");
	if (checked == "on") {
		SportSortStore.setMenuIsLive(false);
		SportAttentionStore.setIsFold(false);
		switchObj.value.on.active = true;
		switchObj.value.off.active = false;
		emit("onType", switchObj.value.on);
	} else {
		SportSortStore.setMenuIsLive(true);
		SportAttentionStore.setIsFold(false);
		switchObj.value.on.active = false;
		switchObj.value.off.active = true;
		emit("onType", switchObj.value.off);
	}
};

/**
 * @description: 热门-时间开关配置
 */
const switchObjRight = ref({
	on: { label: "时间", type: "time", active: true },
	off: { label: "热门", type: "hot", active: false },
});

// 监听热门联赛列表变化
watch(
	() => SportSortStore.getHotLeagueList,
	(newValue, oldValue) => {
		if (!newValue.length) {
			switchObjRight.value.on.active = true;
			switchObjRight.value.off.active = false;
		} else {
			switchObjRight.value.on.active = false;
			switchObjRight.value.off.active = true;
		}
	}
);

/**
 * @description: 右侧热门时间变动处理
 * @param {boolean} checked 选中状态
 * @param {boolean} isMounted 是否是挂载时调用
 */
const wSwitchSelectRight = async (checked: string, isMounted: boolean = false) => {
	if (checked == "on") {
		SportSortStore.setIsActiveHot(false);
		SportSortStore.clearHotLeagueList();
		switchObjRight.value.on.active = true;
		switchObjRight.value.off.active = false;
	} else {
		switchObjRight.value.on.active = false;
		switchObjRight.value.off.active = true;
		await GetPromotions();
	}
	!isMounted && onRefresh();
};

/**
 * @description 获取热门赛事
 */
const GetPromotions = async () => {
	// 路由地址处理
	const splArr = route.path.split("/");
	let sportType = 0;
	// 查找当前球类型
	for (let i = 0; i < splArr.length; i++) {
		const num = Number(splArr[i]);
		if (num && num.toString() != "NaN") {
			sportType = num;
			break;
		}
	}

	const params = {
		query: `$filter=sporttype eq ${sportType}`,
		includeMarkets: "none",
	};
	const res = await sportsApi.GetPromotions(params).catch((err) => err);
	// 获取赛果数量后添加到sports中
	if (res.data) {
		const list = res.data.events;
		SportSortStore.setHotLeagueList(list);
		SportSortStore.setIsActiveHot(true);
	}
};

/**
 * @description: 体育游戏分类切换
 * @param {object} e 选中的分类对象
 */
const onType = (e: any) => {
	console.log(e, "======e....");
	SportSortStore.setMenuTab(e.type);
	classification.value.forEach((item) => {
		if (e.type == item.type) {
			SportAttentionStore.setIsFold(false);
			item.active = true;
		} else {
			item.active = false;
		}
	});
	if (e.type == "today") {
		switchDisable.value.left = false;
		switchDisable.value.right = false;
		// 直接调用下级switch赋值
		wSwitchSelect(SportSortStore.getMenuIsLive && "off");
	} else if (e.type == "morningTrading") {
		switchDisable.value.left = true;
		switchDisable.value.right = false;
		// 设置早盘时间范围
		const todayDate = moment(SportsCommon.todayDate()).add(1, "day").format("YYYY-MM-DD");
		const { startDate, endDate } = SportsCommon.getResultDateRange(todayDate, 15);
		const params = { startDate, endDate };
		SportMorningTradingStore.setTimeInterval(params);
		emit("onType", e);
	} else if (e.type == "champion") {
		switchDisable.value.left = true;
		switchDisable.value.right = true;
		emit("onType", e);
	}
};

/**
 * @description: 数据刷新
 */
const onRefresh = () => {
	emit("onRefresh");
};

/**
 * @description: 展开收缩控制函数
 */
const onExpandAndCollapse = () => {
	if (isFold.value) {
		// 展开
		SportAttentionStore.setIsFold(false);
	} else {
		// 收缩
		SportAttentionStore.setIsFold(true);
	}
	pubSub.publish(pubSub.PubSubEvents.SportEvents.onExpandAngCollapse.eventName, !isFold.value);
};
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
			div {
				color: var(--Text1, #98a7b5);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
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
