<template>
	<SelectCard v-if="state.targetEvents?.length" :sportsActive="sportsActive" :teamData="state.targetEvents" />
	<div class="box-content" v-if="state.targetEvents?.length">
		<VirtualScrollVirtualList
			ref="VirtualScrollVirtualListRef"
			bottomClass="card-container"
			minDivClass="card-header"
			childrenDivClass="league-content"
			:list-data="state.targetEvents"
			:childrenKey="'teams'"
		>
			<template #default="{ item, index, isExpand }">
				<!-- 冠军卡片 -->
				<championCard :championData="item" :isExpand="isExpand" :dataIndex="index" @oddsChange="oddsChange" @toggleDisplay="toggleDisplay" />
			</template>
		</VirtualScrollVirtualList>
	</div>
	<div class="nonedata" v-else>
		<NoneData />
	</div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount, reactive, ref, watch, watchEffect } from "vue";
import { cloneDeep, get } from "lodash-es";
import { useRoute } from "vue-router";
import SelectCard from "/@/views/sports/components/selectCard/selectCard.vue";
import championCard from "./components/championCard/championCard.vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSportEvents } from "/@/views/sports/hooks/useSportEvents";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";

// Store, hooks, and route
const route = useRoute();
const sportsBetEvent = useSportsBetEventStore();
const SidebarStore = useSidebarStore();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const { clearSportsOddsChange } = useSportPubSubEvents();
const { getSidebarEventSSEPush, getSidebarMarketSSEPush } = useToolsHooks();

// Reference for Virtual Scroll
const VirtualScrollVirtualListRef = ref();

// Reactive State
const sportsActive = ref("rollingBall");
const state = reactive({
	targetEvents: [] as any, // 保存目标事件数据
	targetEventList: [], // 筛选后的展示数据
});

// 生命周期钩子 - 组件挂载前
onBeforeMount(() => {
	state.targetEvents = viewSportPubSubEventData.getSportData();
	state.targetEventList = getFilteredList();
	setInitialSportsActive();

	// 使用 watchEffect 来监听响应式的数据变化
	watchEffect(() => {
		state.targetEvents = viewSportPubSubEventData.getSportData();
		state.targetEventList = getFilteredList();
		setInitialSportsActive();
	});
});

// 监听热门赛事的变化
watch(
	() => viewSportPubSubEventData.sidebarData.promotionsViewData.length,
	(newValue, oldValue) => {
		if (newValue > 0 && !oldValue) {
			const eventInfo = viewSportPubSubEventData.sidebarData.promotionsViewData[0];
			SidebarStore.setEventsInfo(eventInfo);
			getSidebarEventSSEPush();
			getSidebarMarketSSEPush();
		}
	}
);

/**
 * @description 获取筛选后的联赛列表数据
 * @returns {Array} 筛选后的联赛列表
 */
const getFilteredList = () => {
	let leagues = cloneDeep(state.targetEvents);
	const leagueSelect = SportLeagueSearchStore.getLeagueSelect;

	if (leagues && leagueSelect.length > 0) {
		leagues = leagues.filter((item) => leagueSelect.includes(item.leagueId));
	}

	// 设置侧边栏的赛事信息
	SidebarStore.setEventsInfo(get(leagues, "[0].events.[0]", {}) as any);
	return leagues;
};

/**
 * @description 设置初始化分类选中值
 */
const setInitialSportsActive = () => {
	sportsActive.value = route.query.sportsActive as string;
};

/**
 * @description 赔率发生变化后，3秒动画清理掉 oddsChange 状态
 * @param {Object} param 参数对象，包含 marketId 和 selections
 */
const oddsChange = ({ marketId, selections }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

/**
 * @description 切换展开状态
 * @param {number} val 要展开的索引值
 */
const toggleDisplay = (val?: number) => {
	VirtualScrollVirtualListRef.value.setlistDataEisExpand(val);
};
</script>

<style lang="scss" scoped>
.box-content {
	width: 100%;
	height: calc(100vh - 227px);
}

.noData {
	height: 100%;
}
</style>
