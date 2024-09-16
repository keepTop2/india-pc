<template>
	<div class="box-content" v-if="state.targetEvents?.length">
		<!-- 联赛数据统计 -->
		<SelectCard v-if="state.targetEvents?.length" :sportsActive="sportsActive" :teamData="state.targetEvents"></SelectCard>
		<!-- 滚球虚拟列表 -->
		<!--
				bottomClass: 可获取间隔-底部边距,
				minDivClass: 可获取缩小时展示的-标题高度,
				childrenDivClass: 可获取展开时-子集卡片高度,
			-->
		<VirtualScrollVirtualList
			v-if="sportsActive !== `champion`"
			ref="VirtualScrollVirtualListRef"
			bottomClass="card-container"
			minDivClass="card—header"
			childrenDivClass="league-content"
			:list-data="state.targetEventList"
		>
			<template #default="{ item, index, isExpand }">
				<!-- 滚球卡片 -->
				<RollingCard :IfOffTheBat="sportsActive" :teamData="item" :isExpand="isExpand" :dataIndex="index" @oddsChange="oddsChange" @toggleDisplay="toggleDisplay"></RollingCard>
			</template>
		</VirtualScrollVirtualList>

		<VirtualScrollVirtualList
			v-else
			ref="VirtualScrollVirtualListRef"
			bottomClass="card-container"
			minDivClass="card—header"
			childrenDivClass="league-content"
			:list-data="state.targetEvents"
			:childrenKey="'teams'"
		>
			<template #default="{ item, index, isExpand }">
				<!-- 冠军卡片 -->
				<ChampionshipCard :championData="item" :isExpand="isExpand" :dataIndex="index" @oddsChange="oddsChange" @toggleDisplay="toggleDisplay"></ChampionshipCard>
			</template>
		</VirtualScrollVirtualList>
	</div>
	<div class="nonedata" v-else>
		<NoneData></NoneData>
	</div>
</template>
<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, reactive, ref, watchEffect } from "vue";
import { cloneDeep, get } from "lodash-es";
import { Sports, SportViewData } from "/@/views/sports/models/interface";
import { useRoute } from "vue-router";
import { RollingCard, ChampionshipCard, SelectCard, VirtualScrollVirtualList } from "./components/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const SidebarStore = useSidebarStore();
const { clearSportsOddsChange } = useSportPubSubEvents();
const sportsBetEvent = useSportsBetEventStore();
const leagueActiveList = ref(sportsBetEvent.getLeagueSelect);
const route = useRoute();
const VirtualScrollVirtualListRef = ref();
const SportsBetEvent = useSportsBetEventStore();
/**选中的赛选类型；*/
const sportsActive = ref("rollingBall");

const state = reactive({
	/**
	 * @description Sports视图数据
	 */
	viewSportData: {
		/**
		 * @description 外层Sports组件视图数据
		 */
		sports: [] as Sports[],
		leagues: [],
		events: [],
		markets: [],
		outrights: [],
		results: [],
		/**
		 * @description 各个子路由视图数据
		 */
		childrenViewData: {},
	} as SportViewData,
	targetEvents: [], // 添加这个字段来保存目标事件数据数组
	/**赛选后的额数据（展示） */
	targetEventList: [],
});

onBeforeMount(() => {
	state.targetEvents = [];
	/** 进入时获取一次页面数据 */
	state.targetEvents = viewSportPubSubEventData.getSportData(6);
	state.targetEventList = getList();
	setInitsportsActive();

	/** 只注重过程不在意结果的数据 响应获取  */
	watchEffect(() => {
		/** 最新数据响应接入  */
		state.targetEvents = viewSportPubSubEventData.getSportData(6);
		state.targetEventList = getList();
		setInitsportsActive();
	});
});

onBeforeUnmount(() => {});

/**
 * @description: 获取筛选后的列表数据；
 * @return {*}
 */
const getList = () => {
	let leagues = cloneDeep(state.targetEvents);
	const SportLeagueSeachStore = useSportLeagueSeachStore();
	const leagueSelect = SportLeagueSeachStore.getLeagueSelect;
	// 如果有筛选 则处理数据，只给出筛选的联赛列表。
	let newleagues: never[] = [];
	if (leagues && leagueSelect.length > 0) {
		for (let index = 0; index < leagues.length; index++) {
			const item = leagues[index];
			let bool = leagueSelect.includes(item.leagueId);
			if (bool) {
				newleagues.push(item);
			}
		}
		leagues = newleagues;
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
	height: calc(100vh - 260px);
}

.card-container {
	margin-bottom: 5px;
}
.nonedata {
	margin-top: 20%;
}
</style>
