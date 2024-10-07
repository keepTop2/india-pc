<template>
	<Skeleton>
		<template #skeleton>
			<ChampionSkeletonList />
		</template>
		<template #default>
			<SelectCard v-show="state.targetEvents?.length" :sportsActive="sportsActive" :teamData="state.targetEvents" />
			<div class="box-content" v-show="state.targetEvents?.length">
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
			<!-- <div class="nonedata" v-show="!state.targetEvents?.length">
				<NoneData />
			</div> -->
		</template>
	</Skeleton>
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
import Skeleton from "/@/components/Skeleton/Skeleton.vue";
import ChampionSkeletonList from "./components/ChampionSkeletonList/ChampionSkeletonList.vue";
import pubsub from "/@/pubSub/pubSub";

/*** @description 初始化Store、hooks和路由 */
const route = useRoute();
const sportsBetEvent = useSportsBetEventStore();
const SidebarStore = useSidebarStore();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const { clearSportsOddsChange } = useSportPubSubEvents();
const { getSidebarEventSSEPush, getSidebarMarketSSEPush } = useToolsHooks();

/*** @description 虚拟滚动列表引用 */
const VirtualScrollVirtualListRef = ref();

/*** @description 响应式状态 */
const sportsActive = ref("rollingBall");
const state = reactive({
	targetEvents: [] as any[], // 保存目标事件数据
	targetEventList: [] as any[], // 筛选后的展示数据
});

/*** @description 组件挂载前的生命周期钩子 */
onBeforeMount(() => {
	initializeData();
	setupWatchers();
});

/*** @description 初始化数据 */
const initializeData = () => {
	state.targetEvents = viewSportPubSubEventData.getSportData();
	state.targetEventList = getFilteredList();
	setInitialSportsActive();
};

/*** @description 设置观察者 */
const setupWatchers = () => {
	watchEffect(() => {
		state.targetEvents = viewSportPubSubEventData.getSportData();
		state.targetEventList = getFilteredList();
		setInitialSportsActive();
	});

	watchEffect(() => {
		if (state.targetEvents.length > 0) {
			pubsub.publish("SkeletonLoading", false);
		}
	});

	watch(
		() => viewSportPubSubEventData.sidebarData?.promotionsViewData?.length,
		(newValue, oldValue) => {
			if (newValue != null && newValue > 0 && !oldValue) {
				const eventInfo = viewSportPubSubEventData.sidebarData?.promotionsViewData?.[0];
				SidebarStore.setEventsInfo(eventInfo);
				getSidebarEventSSEPush();
				getSidebarMarketSSEPush();
			}
		}
	);
};

/*** @description 获取筛选后的联赛列表数据 */
const getFilteredList = () => {
	let leagues = cloneDeep(state.targetEvents);
	const leagueSelect = SportLeagueSearchStore.getLeagueSelect;

	if (leagues && leagueSelect.length > 0) {
		leagues = leagues.filter((item: any) => leagueSelect.includes(item.leagueId));
	}

	SidebarStore.setEventsInfo(get(leagues, "[0].events.[0]", {}) as any);
	return leagues;
};

/*** @description 设置初始化分类选中值 */
const setInitialSportsActive = () => {
	sportsActive.value = route.query.sportsActive as string;
};

/*** @description 处理赔率变化 */
const oddsChange = ({ marketId, selections }: { marketId: string; selections: any[] }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

/*** @description 切换展开状态 */
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
