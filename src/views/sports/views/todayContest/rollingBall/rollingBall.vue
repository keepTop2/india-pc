<template>
	<component v-if="leagues" :is="sportsMap[Number(route.query.sportType)]" :listData="leagues" :matchedLeague="matchedLeague" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect, onBeforeUnmount, defineAsyncComponent } from "vue";
import { cloneDeep, get } from "lodash-es";
import { useRouter, useRoute } from "vue-router";
import pubsub from "/@/pubSub/pubSub";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const { toggleEventScoreboard, switchEventVideoSource } = useToolsHooks();
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
// console.log("rollingBall --  leagues", leagues);

// 用于存储匹配的联赛数据
const matchedLeague = ref([] as any);
const isDataHandled = ref(false); // 标志位，确保只处理一次数据

// 路由参数 sportType 变化
watch(
	() => route.query.sportType,
	(newValue, oldValue) => {
		// 清除选择联赛缓存
		matchedLeague.value = [];
		// 清除数据中心数据===列表数据
		viewSportPubSubEventData.clearState();
		// 清除侧边栏数据
		SidebarStore.clearEventsInfo();
	}
);

// 使用 watch 监听 sportData 数据变化
watch(
	() => viewSportPubSubEventData.getSportData().length, // 监听数据变化
	() => {
		console.log("数据变化触发数据监听", viewSportPubSubEventData.getSportData());
		// console.log("sportData", sportData);
		// sportType 切换时会清空数据，判断是否为空对象或空数组，避免处理
		if (
			(Array.isArray(leagues.value) && leagues.value.length === 0) || // 判断是否为空数组
			(typeof leagues.value === "object" && Object.keys(leagues.value).length === 0) // 判断是否为空对象
		) {
			return; // 空数据时不做逻辑处理
		}
		// console.log("SidebarStore.getEventsInfo", SidebarStore.getEventsInfo);
		if (Object.keys(SidebarStore.getEventsInfo).length === 0) {
			// 如果首次加载，获取第一条赛事并保存赛事 ID
			// console.log("首次加载数据");
			getSidebarData(leagues.value); // 获取第一个联赛的第一场赛事
		} else {
			// console.log("更新数据");
			updateEventScoreboard(leagues.value);
		}
	}
);

// 取第一个联赛的第一个赛事
const getSidebarData = (sportData: any) => {
	// console.error("开始处理数据");
	// console.log("sportData", sportData);
	// 检查 sportData 是否有数据以及第一个联赛是否存在
	const firstEvent = sportData[0]?.events[0]; // 获取第一个联赛的第一场赛事
	if (firstEvent) {
		console.log("rollingBall -- firstEvent", firstEvent);
		toggleEventScoreboard(firstEvent); // 传入赛事数据
		isDataHandled.value = true; // 标记数据已处理，防止重复执行
	}
};

// 更新之前获取的赛事数据
const updateEventScoreboard = (sportData: any) => {
	// console.log("更新数据开始");
	// 获取侧边栏联赛id与赛事id进行匹配
	const { leagueId, eventId } = SidebarStore.getEventsInfo;
	// console.log("看看eventId", leagueId, eventId);
	// 遍历所有联赛和赛事，找到匹配的赛事
	// console.log("leagues", leagues.value);
	// 匹配对应联赛
	const leaguesArray: any = leagues.value.find((item: any) => item.leagueId === leagueId);
	// console.log("leaguesArray", leaguesArray);
	// 匹配对应赛事
	const eventInfo = leaguesArray.events.find((item: any) => item.eventId === eventId);
	// 传入赛事数据
	toggleEventScoreboard(eventInfo);
};

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
