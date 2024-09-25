<template>
	<component v-if="leagues" :is="sportsMap[Number(route.query.sportType)]" :listData="leagues" :matchedLeague="matchedLeague" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect, onBeforeUnmount, defineAsyncComponent, inject } from "vue";
import { cloneDeep, get } from "lodash-es";
import { useRouter, useRoute } from "vue-router";
import pubsub from "/@/pubSub/pubSub";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const route = useRoute();
const SidebarStore = useSidebarStore();

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
const leagues = computed(() => {
	// console.log(viewSportPubSubEventData.getSportData(),'===viewSportPubSubEventData.getSportData()')
	return viewSportPubSubEventData.getSportData();
});

// 用于存储匹配的联赛数据
const matchedLeague = ref([] as any);
const isDataHandled = ref(false); // 标志位，确保只处理一次数据

const openSportPush = inject("openSportPush") as () => void;

watchEffect(() => {
	const sportType = route.query.sportType;
	if (sportType) {
		// 清除选择联赛缓存
		matchedLeague.value = [];
		// 清除数据中心数据===列表数据
		// viewSportPubSubEventData.clearEventsState();
		// 清除侧边栏数据
		// SidebarStore.clearEventsInfo();
		// openSportPush();
	}
});

const selectFilterLeague = (value: number) => {
	// 遍历 leagues 数组，找到 leagueId 与传入的 value 匹配的对象
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
