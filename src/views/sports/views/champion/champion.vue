<template>
	<div class="box-content" v-if="state.targetEvents?.length">
		<!-- 联赛数据统计 -->
		<SelectCard v-if="state.targetEvents?.length" :sportsActive="sportsActive" :teamData="state.targetEvents" />
		<VirtualScrollVirtualList
			ref="VirtualScrollVirtualListRef"
			bottomClass="card-container"
			minDivClass="card—header"
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
		<NoneData></NoneData>
	</div>
</template>
<script setup lang="ts">
import { computed, inject, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { cloneDeep, get } from "lodash-es";
import pubSub from "/@/pubSub/pubSub";
import { Sports, SportViewData } from "/@/views/sports/models/interface";

import { useRoute } from "vue-router";
import championCard from "./components/championCard/championCard.vue";
import SelectCard from "/@/views/sports/components/selectCard/selectCard.vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { SportViewModels } from "/@/views/sports/models/sportViewModels";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportLeagueSearchStore } from "/@/stores/modules/sports/sportLeagueSearch";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSportEvents } from "/@/views/sports/hooks/useSportEvents";
const { sportType, tabActive, handleSportEventsPush, openSportPush, handleSportPush } = useSportEvents();
const SidebarStore = useSidebarStore();
const { clearSportsOddsChange } = useSportPubSubEvents();
const sportsBetEvent = useSportsBetEventStore();
const leagueActiveList = ref(sportsBetEvent.getLeagueSelect);
const { getSidebarEventSSEPush, getSidebarMarketSSEPush } = useToolsHooks();

const route = useRoute();

const VirtualScrollVirtualListRef = ref();

const SportsBetEvent = useSportsBetEventStore();
/**选中的赛选类型；*/
const sportsActive = ref("rollingBall");

const state = reactive({
	targetEvents: [] as any, // 添加这个字段来保存目标事件数据数组
	/**赛选后的额数据（展示） */
	targetEventList: [],
});

onBeforeMount(() => {
	console.log("冠军生命周期钩子");
	state.targetEvents = [];
	/** 进入时获取一次页面数据 */
	state.targetEvents = viewSportPubSubEventData.getSportData();
	state.targetEventList = getList();
	setInitsportsActive();

	/** 只注重过程不在意结果的数据 响应获取  */
	watchEffect(() => {
		/** 最新数据响应接入  */
		state.targetEvents = viewSportPubSubEventData.getSportData();
		console.log("state.targetEvents", state.targetEvents);

		state.targetEventList = getList();
		setInitsportsActive();
	});
});

// 监听热门赛事
watch(
	() => viewSportPubSubEventData.sidebarData.promotionsViewData.length,
	(newValue, oldValue) => {
		// 只监听首次变化
		if (newValue > 0 && !oldValue) {
			// 取第一条热门赛事ID
			const eventInfo = viewSportPubSubEventData.sidebarData.promotionsViewData[0];
			// 设置状态
			SidebarStore.setEventsInfo(eventInfo); // 切换的时候获取当前赛事信息
			getSidebarEventSSEPush(); // 侧边赛事推送
			getSidebarMarketSSEPush(); // 每次更新侧边赛事时都需要重新推送对应的盘口详情
		}
	}
);

/**
 * @description: 获取筛选后的列表数据；
 * @return {*}2
 */
const getList = () => {
	let leagues = cloneDeep(state.targetEvents);
	const SportLeagueSearchStore = useSportLeagueSearchStore();
	const leagueSelect = SportLeagueSearchStore.getLeagueSelect;
	// 如果有筛选 则处理数据，只给出筛选的联赛列表。
	let newLeagues: never[] = [];
	if (leagues && leagueSelect.length > 0) {
		for (let index = 0; index < leagues.length; index++) {
			const item = leagues[index];
			let bool = leagueSelect.includes(item.leagueId);
			if (bool) {
				newLeagues.push(item);
			}
		}
		leagues = newLeagues;
	}
	SidebarStore.setEventsInfo(get(leagues, "[0].events.[0]", {}) as any);
	return leagues;
};

/**设置初始化分类选中值; */
const setInitsportsActive = () => {
	sportsActive.value = route.query.sportsActive as string;
};

/**
 * @description 赔率发生变化后 3秒动画 清理掉oddsChange状态
 */
const oddsChange = ({ marketId, selections }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

const toggleDisplay = (val?: number) => {
	VirtualScrollVirtualListRef.value.setlistDataEisExpand(val);
};
</script>

<style lang="scss" scoped>
.box-content {
	width: 100%;
	height: calc(100vh - 200px);
}

.card-container {
	margin-bottom: 5px;
}
.noData {
	height: 100%;
}
</style>
