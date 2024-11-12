<template>
	<div class="home-wrapper">
		<bannerSkeleton v-if="isLoading" />
		<banner v-else></banner>

		<!--跑马灯-->
		<HorseRaceLamp />

		<div class="max-width">
			<!-- 热门推荐 -->
			<hotGameSkeleton :skeletonCount="5" v-if="isLoading" />
			<hotGame :hotGameList="hotGameList" v-else-if="hotGameList.length" />
			<!-- 我们的游戏 -->
			<SportGame />
			<!-- 收藏的游戏 -->
			<collectGames :gameList="collectGamesStore.getCollectGamesList" title="喜欢的游戏" v-if="collectGamesStore.getCollectGamesList?.length" />
			<div v-if="isLoading">
				<lobbyGameSkeleton v-for="(count, index) in [6, 3, 6, 1, 5]" :key="index" :skeletonCount="count" />
			</div>
			<div v-else>
				<lobbyGameCard v-for="(item, index) in lobbyGameList" :key="index" :gameList="item" :title="item.name" />
			</div>
			<redbagRainCountdown v-model="showCountdown" />
		</div>

		<!--公告-->
		<Announcement />
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import banner from "./components/banner.vue";
import bannerSkeleton from "./components/bannerSkeleton.vue";
import hotGame from "./components/hotGame.vue";
import hotGameSkeleton from "./components/hotGameSkeleton.vue";
import lobbyGameSkeleton from "./components/lobbyGameSkeleton.vue";
import lobbyGameCard from "./components/lobbyGameCard.vue";
import collectGames from "./components/collectGames.vue";
import { HomeApi } from "/@/api/home";
import pubsub from "/@/pubSub/pubSub";
import activitySocketService from "/@/utils/activitySocketService";
import HorseRaceLamp from "/@/views/home/components/horseRaceLamp.vue";
import Announcement from "/@/components/Announcement/Announcement.vue";
import { useActivityStore } from "/@/stores/modules/activity";
import { useCollectGamesStore } from "/@/stores/modules/collectGames";
import SportGame from "./components/SportGame.vue";
const activityStore = useActivityStore();
const collectGamesStore = useCollectGamesStore();
const websocketService: any = activitySocketService.getInstance();
const showCountdown = ref(false);
const isLoading = ref(true);
const lobbyGameList: any = ref([]);
const hotGameList = ref([]);
const queryGameInfoDetail = async () => {
	const params = {
		label: 1,
		pageSize: 10,
	};
	try {
		const res = await HomeApi.queryGameInfoDetail(params);
		hotGameList.value = res.data?.records || [];
	} catch (error) {
		console.error("Error fetching hot games:", error);
	}
};

const queryLobbyTopGame = async () => {
	try {
		const res = await HomeApi.queryLobbyTopGame();
		lobbyGameList.value = res.data;
	} catch (error) {
		console.error("Error fetching lobby games:", error);
	}
};

onMounted(async () => {
	isLoading.value = true;
	const startTime = Date.now();
	await queryGameInfoDetail(), queryLobbyTopGame();
	// 最少500毫秒loading
	const elapsedTime = Date.now() - startTime;
	const delay = Math.max(0, 500 - elapsedTime);
	const timer = setTimeout(() => {
		clearTimeout(timer);
		isLoading.value = false;
	}, delay);

	// 如果socket连接成功
	if (websocketService.socket?.readyState) {
		//直接发订阅
		websocketService.send("/activity/redBagRain");
	} else {
		// 如果socket连接不成功，等待成功指令
		pubsub.subscribe("websocketReady", () => {
			websocketService.send("/activity/redBagRain");
		});
	}

	pubsub.subscribe("/activity/redBagRain", (data) => {
		showCountdown.value = true;
		activityStore.setCurrentActivityData({ ...data });
	});
});
</script>

<style lang="scss" scoped></style>
