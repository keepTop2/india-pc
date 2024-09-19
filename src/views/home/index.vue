<template>
	<div>
		<Fragment>
			<bannerSkeleton v-if="isLoading" />
			<banner v-else></banner>
		</Fragment>

		<div class="max-width">
			<!-- 热门推荐 -->
			<Fragment>
				<hotGameSkeleton :skeletonCount="5" v-if="isLoading" />
				<hotGame :hotGameList="hotGameList" v-else />
			</Fragment>
			<Fragment>
				<Fragment v-if="isLoading">
					<lobbyGameSkeleton :skeletonCount="6" />
					<lobbyGameSkeleton :skeletonCount="3" />
					<lobbyGameSkeleton :skeletonCount="6" />
					<lobbyGameSkeleton :skeletonCount="1" />
					<lobbyGameSkeleton :skeletonCount="5" />
				</Fragment>
				<Fragment v-else>
					<lobbyGameCard v-for="item in lobbyGameList" :gameList="item" />
				</Fragment>
			</Fragment>
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
const lobbyGameList = ref([]);
const hotGameList = ref([]);
onMounted(() => {
	queryGameInfoDetail();
	queryLobbyTopGame();
});
onMounted(() => {
	isLoading.value = true;
	setTimeout(() => {
		isLoading.value = false;
	}, 1500);
});
const queryGameInfoDetail = () => {
	const params = {
		label: 0,
		pageSize: 10,
	};
	HomeApi.queryGameInfoDetail(params).then((res) => {
		hotGameList.value = res.data.records;
		console.log(hotGameList.value);
	});
};
const queryLobbyTopGame = () => {
	HomeApi.queryLobbyTopGame().then((res) => {
		lobbyGameList.value = res.data;
	});
};
</script>

<style lang="scss" scoped>
.home-wrapper {
	padding-bottom: 40px;
}
</style>
