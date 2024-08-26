<!--
 * @Author: WangMingxin
 * @Description: 体育-关注收藏
-->

<template>
	<div class="box-content" v-show="isShowCollect">
		<div class="box_navigation">
			<div class="navigation_left" @click="$router.back()">
				<SvgIcon class="icon" iconName="arrowLeft" :size="14" />
				<div>返回</div>
			</div>

			<div class="icon2" @click="onExpandAndCollapse">
				<SvgIcon iconName="doubleArrowUp_sports" class="iconSvg" />
			</div>
		</div>

		<div v-for="(sport, index) in computedSportComponent" v-if="computedSportComponent.length" :key="index">
			<DynamicSportList :teamName="sport.name" :teamData="sport.data" :listComponent="sport.component" @oddsChange="oddsChange" :isExpand="expandAndCollapse" />
		</div>

		<div v-else class="no-data">
			<NoneData :showText="false">
				<el-button type="default" class="button" @click="selectEvent">选择赛事</el-button>
			</NoneData>
		</div>
	</div>
	<router-view />
</template>

<script setup lang="ts">
import { onMounted, watch, ref, watchEffect, Component, computed } from "vue";
import pubSub from "/@/pubSub/pubSub";
import { useRouter, useRoute } from "vue-router";
import { map, get, isArray, filter, xorWith } from "lodash-es";
import sportsApi from "/@/api/menu/sports/sports";
import { SportTypeEnum } from "/@/enum/sportEnum/sportEnum";
import viewSportPubSubEventData from "/@/hooks/sport/viewSportPubSubEventData";
import useSportPubSubEvents from "/@/hooks/sport/useSportPubSubEvents";
import { usePopularLeague } from "/@/stores/modules/sports/popularLeague";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import { WebToPushApi } from "/@/enum/sportEnum/sportEventSourceEnum";
import DynamicSportList from "/@/views/collect/dynamicSportList/dynamicSportList.vue";
import FootballList from "/@/views/football/components/footballCard/footballCard.vue";
import BasketballList from "/@/views/basketball/components/rollingCard/rollingCard.vue";
import TennisList from "/@/views/tennis/components/rollingCard/rollingCard.vue";
import ESportsList from "/@/views/eSports/components/rollingCard/rollingCard.vue";
import VolleyballList from "/@/views/volleyball/components/rollingCard/rollingCard.vue";
import IceHockeyList from "/@/views/iceHockey/components/rollingCard/rollingCard.vue";
import BilliardsList from "/@/views/billiards/components/rollingCard/rollingCard.vue";
import BaseballList from "/@/views/baseball/components/rollingCard/rollingCard.vue";
import BadmintonList from "/@/views/badminton/components/rollingCard/rollingCard.vue";
import AmericanSoccerList from "/@/views/americanSoccer/components/rollingCard/rollingCard.vue";
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

const listData = computed(() => {
	return viewSportPubSubEventData.getEvents();
});

const getAllEventIds = () => {
	let allEventIds: number[] = [];
	const allEvent = viewSportPubSubEventData.getEvents();

	map(allEvent, (league: any) => {
		const { events } = league;
		if (isArray(events) && events.length) {
			const list = map(events, "eventId");
			allEventIds = allEventIds.concat(list);
		}
	});
	return allEventIds;
};

const canUnFollow = ref(true);

const unFollowEvent = async (list: number[]) => {
	if (list.length) {
		// 防止重复
		if (!canUnFollow.value) {
			return;
		}
		await sportsApi.unFollow({
			thirdId: list,
		});

		const res = await sportsApi.getAttentionList();
		SportAttentionStore.setAttentionList(res.data);

		canUnFollow.value = true;
	}
};

watch(
	() => listData.value,
	(newVal) => {
		if (newVal.length > 0) {
			const getAllEventId = getAllEventIds();
			const diffIds = xorWith(computedEventId.value, getAllEventId);
			canUnFollow.value = !!diffIds.length;
			unFollowEvent(diffIds);
		}
	}
);

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

watchEffect(() => {
	//
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
	height: 840px;
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
			@include themeify {
				color: themed("Text1");
			}
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			.icon {
				margin-right: 10px;
				@include themeify {
					color: themed("icon");
				}
			}
		}
		.icon2 {
			width: 24px;
			height: 24px;
			@include themeify {
				color: themed("icon");
			}
		}
	}

	.no-data {
		height: 400px;

		.button {
			width: 220px;
			height: 48px;
			margin-top: 10px;
			background-color: var(--Icon, #67707b);

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
