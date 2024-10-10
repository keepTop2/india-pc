<template>
	<Skeleton>
		<template #skeleton>
			<ChampionSkeletonList />
		</template>
		<template #default>
			<SelectCard
				v-show="state.targetEvents?.length"
				@handleClick="handleToggleAll"
				:sportsActive="sportsActive"
				:teamData="state.targetEvents"
				:expandedCount="expandedPanels.size"
			/>
			<div class="box-content" v-show="state.targetEvents?.length">
				<championCard
					v-for="(item, index) in state.targetEvents"
					:key="index"
					:championData="item"
					:dataIndex="index"
					@oddsChange="oddsChange"
					@toggleDisplay="toggleDisplay"
					:isExpanded="!expandedPanels.has(index)"
				/>
			</div>
		</template>
	</Skeleton>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeMount, reactive, ref, watch, watchEffect } from "vue";
import { cloneDeep, get } from "lodash-es";
import { useRoute } from "vue-router";
import SelectCard from "/@/views/sports/views/champion/components/selectCard.vue";
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

const route = useRoute();
const sportsBetEvent = useSportsBetEventStore();
const SidebarStore = useSidebarStore();
const SportLeagueSearchStore = useSportLeagueSearchStore();
const { clearSportsOddsChange } = useSportPubSubEvents();
const { getSidebarEventSSEPush, getSidebarMarketSSEPush } = useToolsHooks();

const sportsActive = ref("rollingBall");
const state = reactive({
	targetEvents: [] as any[],
	targetEventList: [] as any[],
});
const expandedPanels = ref(new Set<number>());

onBeforeMount(() => {
	initializeData();
	setupWatchers();
});

const initializeData = () => {
	state.targetEvents = viewSportPubSubEventData.getSportData();
	state.targetEventList = getFilteredList();
	setInitialSportsActive();
};

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

	watch(
		() => route.query.sportType,
		() => {
			expandedPanels.value.clear();
		}
	);
};

const handleToggleAll = () => {
	if (expandedPanels.value.size === state.targetEvents.length) {
		expandedPanels.value.clear();
	} else {
		expandedPanels.value = new Set(state.targetEvents.map((_, index) => index));
	}
};

const getFilteredList = () => {
	let leagues = cloneDeep(state.targetEvents);
	const leagueSelect = SportLeagueSearchStore.getLeagueSelect;

	if (leagues && leagueSelect.length > 0) {
		leagues = leagues.filter((item: any) => leagueSelect.includes(item.leagueId));
	}

	SidebarStore.setEventsInfo(get(leagues, "[0].events.[0]", {}) as any);
	return leagues;
};

const setInitialSportsActive = () => {
	sportsActive.value = route.query.sportsActive as string;
};

const oddsChange = ({ marketId, selections }: { marketId: string; selections: any[] }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

const toggleDisplay = (index: number) => {
	if (expandedPanels.value.has(index)) {
		expandedPanels.value.delete(index);
	} else {
		expandedPanels.value.add(index);
	}
};
</script>

<style lang="scss" scoped>
.box-content {
	width: 100%;
	height: calc(100vh - 285px);
	overflow-y: scroll;
}

.noData {
	height: 100%;
}
</style>
