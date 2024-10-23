<template>
	<Skeleton>
		<template #skeleton>
			<SkeletonList />
		</template>
		<template #default>
			<DateSelector :daysNumber="7" :other="true" :direction="true" />
			<SelectCard :listData="leagues" :matchedLeague="matchedLeague" />
		</template>
	</Skeleton>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import pubsub from "/@/pubSub/pubSub";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import SkeletonList from "/@/views/sports/layout/components/SkeletonList/SkeletonList.vue";
import SelectCard from "/@/views/sports/tournamentViews/index.vue";
const route = useRoute();

// 获取数据中心处理好的列表数据
const leagues = computed(() => viewSportPubSubEventData.getSportData());

// 用于存储匹配的联赛数据
const matchedLeague = ref<any[]>([]);

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
