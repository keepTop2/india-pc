<template>
	<div class="box-content" v-show="isShowCollect">
		<div v-for="(sport, index) in computedSportComponent" v-if="computedSportComponent.length" :key="index">
			<DynamicSportList :teamName="$t(`sports['${sport.name}']`)" :teamData="sport.data" :listComponent="sport.component" @oddsChange="oddsChange" :isExpand="expandAndCollapse" />
		</div>

		<div v-else class="no-data">
			<NoneData :showText="false">
				<el-button type="default" class="button" @click="selectEvent">{{ $t(`sports['选择赛事']`) }}</el-button>
			</NoneData>
		</div>
	</div>
	<router-view />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { map, get, isArray, filter, xorWith } from "lodash-es";
import { SportTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import DynamicSportList from "/@/views/sports/views/collect/dynamicSportList/dynamicSportList.vue";
import FootballList from "/@/views/sports/tournamentViews/football/components/footballCard/footballCard.vue";
import BasketballList from "/@/views/sports/tournamentViews/basketball/components/rollingCard/rollingCard.vue";
import TennisList from "/@/views/sports/tournamentViews/tennis/components/rollingCard/rollingCard.vue";
import ESportsList from "/@/views/sports/tournamentViews/eSports/components/rollingCard/rollingCard.vue";
import VolleyballList from "/@/views/sports/tournamentViews/volleyball/components/rollingCard/rollingCard.vue";
import IceHockeyList from "/@/views/sports/tournamentViews/iceHockey/components/rollingCard/rollingCard.vue";
import BilliardsList from "/@/views/sports/tournamentViews/billiards/components/rollingCard/rollingCard.vue";
import BaseballList from "/@/views/sports/tournamentViews/baseball/components/rollingCard/rollingCard.vue";
import BadmintonList from "/@/views/sports/tournamentViews/badminton/components/rollingCard/rollingCard.vue";
import AmericanSoccerList from "/@/views/sports/tournamentViews/americanSoccer/components/rollingCard/rollingCard.vue";
import { useLoading } from "/@/directive/loading/hooks";

const { startLoading, stopLoading } = useLoading();
const popularLeague = usePopularLeague();
popularLeague.showPopularLeague();

const { clearSportsOddsChange } = useSportPubSubEvents();
const SportAttentionStore = useSportAttentionStore();
const router = useRouter();
const route = useRoute();

type Enum = { [s: number]: string };
// 判断值是否在enum中
const isEnumValue = <T extends Enum>(enumSrc: T, value: unknown): value is T[keyof T] => {
	return Number.isInteger(enumSrc[enumSrc[value as keyof T] as any as keyof T]);
};

const computedEventId = computed(() => {
	return SportAttentionStore.getAttentionType === "event" ? SportAttentionStore.getAttentionEventIdList : SportAttentionStore.getAttentionLeagueIdList;
});

const isShowCollect = computed(() => route.name === "sportsCollect");

const getEventData = () => {
	const newEvents = map(viewSportPubSubEventData.getEvents(), (league: any) => {
		const { events } = league;
		if (isArray(events) && events.length) {
			const filterEvents = filter(events, (event) => computedEventId.value.includes(event.eventId));
			const sportType = get(filterEvents, "[0].sportType", -1) as SportTypeEnum;
			return {
				...league,
				sportType,
				events: filterEvents,
			};
		}
		const sportType = get(league?.events, "[0].sportType", -1) as SportTypeEnum;
		return {
			...league,
			sportType,
		};
	});

	return filter(newEvents, (item) => {
		return item?.events.length && isEnumValue(SportTypeEnum, item.sportType);
	});
};

const computedSportComponent = computed(() => {
	stopLoading();
	const eventData = getEventData();
	return [
		{
			name: "足球",
			component: FootballList,
			data: filter(eventData, { sportType: SportTypeEnum.FootBall }),
		},
		{
			name: "篮球",
			component: BasketballList,
			data: filter(eventData, { sportType: SportTypeEnum.Basketball }),
		},
		{
			name: "网球",
			component: TennisList,
			data: filter(eventData, { sportType: SportTypeEnum.Tennis }),
		},
		{
			name: "排球",
			component: VolleyballList,
			data: filter(eventData, { sportType: SportTypeEnum.Volleyball }),
		},
		{
			name: "电子竞技",
			component: ESportsList,
			data: filter(eventData, { sportType: SportTypeEnum.ESports }),
		},
		{
			name: "羽毛球",
			component: BadmintonList,
			data: filter(eventData, { sportType: SportTypeEnum.Badminton }),
		},
		{
			name: "棒球",
			component: BaseballList,
			data: filter(eventData, { sportType: SportTypeEnum.Baseball }),
		},
		{
			name: "台球",
			component: BilliardsList,
			data: filter(eventData, { sportType: SportTypeEnum.Billiards }),
		},
		{
			name: "冰球",
			component: IceHockeyList,
			data: filter(eventData, { sportType: SportTypeEnum.IceHockey }),
		},
		{
			name: "美式足球",
			component: AmericanSoccerList,
			data: filter(eventData, { sportType: SportTypeEnum.AmericanSoccer }),
		},
	].filter((item) => !!item.data?.length);
});

/**
 * @description 赔率发生变化后 3秒动画 清理掉oddsChange状态
 */
const oddsChange = ({ marketId, selections }: any) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

/**
 * @description: 展开收缩标记
 */
const expandAndCollapse = ref(true);

const onExpandAndCollapse = () => {
	expandAndCollapse.value = !expandAndCollapse.value;
};

/**
 * 选择赛事
 */
const selectEvent = () => {
	router.push({ path: "/" });
};
</script>

<style scoped lang="scss">
.box-content {
	height: calc(100vh - 227px);

	overflow-y: auto;
	.box_navigation {
		margin: 16px 0;
		display: flex;
		width: 100%;
		height: 40px;
		justify-content: space-between;
		align-items: center;
		flex-shrink: 0;
		.navigation_left {
			display: flex;
			align-items: center;
			cursor: pointer;
			color: var(--Text-1);
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			.icon {
				margin-right: 10px;
				color: var(--Icon-1);
			}
		}
		.icon2 {
			width: 24px;
			height: 24px;
			color: var(--Icon-1);
		}
	}

	.no-data {
		height: 100%;

		.button {
			width: 220px;
			height: 48px;
			margin-top: 10px;
			background-color: var(--Icon-1);

			&:hover {
				color: var(--text-s, #fff);
				background: var(--Theme-, #3bc116);
			}
		}
	}
}

.box-content::-webkit-scrollbar {
	width: 0; /* 设置滚动条宽度 */
}

.box-content::-webkit-scrollbar-track {
	background-color: transparent; /* 设置滚动条轨道背景色 */
}
</style>
