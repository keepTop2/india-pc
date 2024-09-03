<!--
 * @Author: WangMingxin
 * @Description: 台球
-->
<template>
	<div class="box-content" v-if="state.targetEvents?.length">
		<!-- 联赛数据统计 -->
		<SelectCard v-if="state.targetEvents?.length" :sportsActive="sportsActive" :teamData="state.targetEvents"></SelectCard>
		<!-- /** 可获取间隔-底部边距 class    */
	bottomClass: "card-item",
	/** 可获取缩小时展示的-标题高度 class    */
	minDivClass: "tournament-header",
	/** 可获取展开时-子集卡片高度 class    */
	childrenDivClass: "content", -->
		<VirtualScrollVirtualList
			v-if="sportsActive !== `champion`"
			ref="VirtualScrollVirtualListRef"
			bottomClass="card-container"
			minDivClass="box"
			childrenDivClass="box_two"
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
			minDivClass="box"
			childrenDivClass="box_two"
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
import { computed, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { cloneDeep, get } from "lodash-es";
import pubSub from "/@/pubSub/pubSub";
import { Sports, SportViewData } from "/@/models/interface";

import { useRoute } from "vue-router";
import { RollingCard, ChampionshipCard, SelectCard, VirtualScrollVirtualList } from "./components/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { SportViewModels } from "/@/models/sportViewModels";
import useSportPubSubEvents from "/@/hooks/sport/useSportPubSubEvents";
import viewSportPubSubEventData from "/@/hooks/sport/viewSportPubSubEventData";
import { useSportLeagueSeachStore } from "/@/stores/modules/sports/sportLeagueSeach";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";

const sportHotStore = useSportHotStore();
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
	state.targetEvents = viewSportPubSubEventData.getSportData(7);
	state.targetEventList = getList();
	setInitsportsActive();

	/** 只注重过程不在意结果的数据 响应获取  */
	watchEffect(() => {
		/** 最新数据响应接入  */
		state.targetEvents = viewSportPubSubEventData.getSportData(7);
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
	sportHotStore.setInitEvent(get(leagues, "[0].events.[0]", {}) as any);
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
	clearSportsOddsChange({ marketId, selections });
};

const toggleDisplay = (val?: number) => {
	VirtualScrollVirtualListRef.value.setlistDataEisExpand(val);
};
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content) {
	padding: 0;
}

.box-content {
	width: 100%;
	height: 840px;

	:deep(.el-collapse-item__wrap) {
		width: 100%;

		border: none;

		@include themeify {
			background-color: themed("Bg1");
		}
	}

	:deep(.el-collapse) {
		border: none;
	}
}

:deep(.el-collapse-item__header) {
	padding: 0;
	border: none;
	height: 40px;
	flex-shrink: 0;
	border-radius: 8px 8px 0px 0px;

	@include themeify {
		background: themed("Bg6");
	}

	i {
		display: none;
	}
}

.box {
	width: 100%;
	margin-bottom: 16px;
}

.card-container {
	margin-bottom: 16px;
}
.nonedata {
	margin-top: 20%;
}
</style>
