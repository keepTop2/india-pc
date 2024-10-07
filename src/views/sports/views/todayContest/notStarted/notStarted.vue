<template>
	<Skeleton>
		<template #skeleton>
			<SkeletonList />
		</template>
		<template #default>
			<component v-show="leagues && selectedComponent" :is="selectedComponent" :listData="leagues" :matchedLeague="matchedLeague" />
		</template>
	</Skeleton>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import pubsub from "/@/pubSub/pubSub";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import SkeletonList from "/@/views/sports/layout/components/SkeletonList/SkeletonList.vue";

const route = useRoute();

// 懒加载球类列表组件
const sportsMap: Record<number, ReturnType<typeof defineAsyncComponent>> = {
	1: defineAsyncComponent(() => import(/* webpackChunkName: "football" */ "/@/views/sports/tournamentViews/football/football.vue")),
	2: defineAsyncComponent(() => import(/* webpackChunkName: "basketball" */ "/@/views/sports/tournamentViews/basketball/basketball.vue")),
	3: defineAsyncComponent(() => import(/* webpackChunkName: "americanSoccer" */ "/@/views/sports/tournamentViews/americanSoccer/americanSoccer.vue")),
	4: defineAsyncComponent(() => import(/* webpackChunkName: "iceHockey" */ "/@/views/sports/tournamentViews/iceHockey/iceHockey.vue")),
	5: defineAsyncComponent(() => import(/* webpackChunkName: "tennis" */ "/@/views/sports/tournamentViews/tennis/tennis.vue")),
	6: defineAsyncComponent(() => import(/* webpackChunkName: "volleyball" */ "/@/views/sports/tournamentViews/volleyball/volleyball.vue")),
	7: defineAsyncComponent(() => import(/* webpackChunkName: "billiards" */ "/@/views/sports/tournamentViews/billiards/billiards.vue")),
	8: defineAsyncComponent(() => import(/* webpackChunkName: "baseball" */ "/@/views/sports/tournamentViews/baseball/baseball.vue")),
	9: defineAsyncComponent(() => import(/* webpackChunkName: "badminton" */ "/@/views/sports/tournamentViews/badminton/badminton.vue")),
	43: defineAsyncComponent(() => import(/* webpackChunkName: "eSports" */ "/@/views/sports/tournamentViews/eSports/eSports.vue")),
};

// 获取数据中心处理好的列表数据
const leagues = computed(() => viewSportPubSubEventData.getSportData());

// 用于存储匹配的联赛数据
const matchedLeague = ref<any[]>([]);

// 根据 route.query.sportType 选择对应组件
const selectedComponent = computed(() => {
	const sportType = Number(route.query.sportType);
	return sportsMap[sportType] || null;
});

// 监听路由变化，清空选择的联赛
watch(
	() => route.query.sportType,
	() => {
		matchedLeague.value = [];
	}
);

const selectFilterLeague = (value: number) => {
	if (value > 0) {
		const result = leagues.value?.find((league: any) => league.leagueId === value);
		matchedLeague.value = result ? [result] : [];
	} else {
		matchedLeague.value = [];
	}
};

onMounted(() => {
	pubsub.subscribe("selectFilterLeague", selectFilterLeague);
});

onBeforeUnmount(() => {
	pubsub.unsubscribe("selectFilterLeague", selectFilterLeague);
});
</script>

<style scoped></style>
