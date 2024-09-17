<template>
	<component v-if="leagues" :is="sportsMap[Number(route.query.sportType)]" :listData="leagues" :matchedLeague="matchedLeague" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import pubsub from "/@/pubSub/pubSub";
const route = useRoute();

// 足球列表
const Football = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/football/football.vue"));
// 篮球列表
const Basketball = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/basketball/basketball.vue"));
// 美式足球列表
const AmericanSoccer = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/americanSoccer/americanSoccer.vue"));
// 冰上曲棍球列表
const IceHockey = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/iceHockey/iceHockey.vue"));
// 网球列表
const Tennis = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/tennis/tennis.vue"));
// 排球列表
const Volleyball = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/volleyball/volleyball.vue"));
// 斯诺克
const Billiards = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/billiards/billiards.vue"));
// 棒球列表
const Baseball = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/baseball/baseball.vue"));
// 羽毛球列表
const Badminton = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/badminton/badminton.vue"));
// 电子竞技列表
const ESports = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/eSports/eSports.vue"));

const sportsMap = {
	1: Football,
	2: Basketball,
	3: AmericanSoccer,
	4: IceHockey,
	5: Tennis,
	6: Volleyball,
	7: Billiards,
	8: Baseball,
	9: Badminton,
	43: ESports,
};

// 获取到的数据
const leagues = computed(() => viewSportPubSubEventData.viewSportData.childrenViewData);

// 用于存储匹配的联赛数据
const matchedLeague = ref([] as any);

// 路由参数 sportType 变化 清空筛选的联赛
watch(
	() => route.query.sportType,
	(newValue, oldValue) => {
		matchedLeague.value = [];
	}
);

const selectFilterLeague = (value: number) => {
	// const leaguesData: any = computed(() => viewSportPubSubEventData.viewSportData.childrenViewData);
	// console.log("leaguesData.value", leaguesData.value);
	// 遍历 leagues 数组，找到 leagueId 与传入的 value 匹配的对象
	console.log("leagues.value -- morningTrading", leagues.value);
	if (value > 0) {
		const arr: any = [];
		const result = leagues.value.find((league: any) => league.leagueId === value);
		// 将匹配结果存储到 matchedLeague 变量中
		if (result) {
			arr.push(result);
			matchedLeague.value = arr;
			console.log("匹配的联赛：", matchedLeague.value);
		}
	} else {
		matchedLeague.value = [];
	}
};

onMounted(() => {
	// 订阅选择联赛事件
	pubsub.subscribe("selectFilterLeague", selectFilterLeague);
});

onBeforeUnmount(() => {
	// 取消订阅选择联赛事件
	pubsub.unsubscribe("selectFilterLeague", selectFilterLeague);
});
</script>

<style scoped></style>
