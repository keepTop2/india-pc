<template>
	<div class="home-wrapper">
		<bannerSkeleton v-if="isLoading" />
		<banner v-else></banner>

		<div class="max-width">
			<!-- 热门推荐 -->
			<hotGameSkeleton :skeletonCount="5" v-if="isLoading" />
			<hotGame :hotGameList="hotGameList" v-else-if="hotGameList.length" />
			<div v-if="isLoading">
				<lobbyGameSkeleton v-for="(count, index) in [6, 3, 6, 1, 5]" :key="index" :skeletonCount="count" />
			</div>
			<div v-else>
				<lobbyGameCard v-for="(item, index) in lobbyGameList" :key="index" :gameList="item" :title="item.name" />
			</div>
			<redbagRainCountdown />
		</div>
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
import { HomeApi } from "/@/api/home";

const isLoading = ref(false);
const lobbyGameList: any = ref([]);
const hotGameList = ref([]);

const queryGameInfoDetail = async () => {
	const params = {
		label: 0,
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
	await Promise.all([queryGameInfoDetail(), queryLobbyTopGame()]);
	// 最少500毫秒loading
	const elapsedTime = Date.now() - startTime;
	const delay = Math.max(0, 500 - elapsedTime);
	setTimeout(() => {
		isLoading.value = false;
	}, delay);
});
</script>

<style lang="scss" scoped></style>
