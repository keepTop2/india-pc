<template>
	<component :is="sportsMap[route.query.sportType]" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { defineAsyncComponent } from "vue";
import { useRouter, useRoute } from "vue-router";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
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

// import NoData from "/@/views/sports/components/noData/noData.vue";

// const leagues = computed(() => viewSportPubSubEventData.getSportData(Number(route.query.sportType)));
// console.log("leagues------------------", leagues);

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
</script>

<style scoped></style>
