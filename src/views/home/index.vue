<template>
	<div>
		<banner></banner>
		<div class="max-width">
			<!-- 热门推荐 -->

			<hotGame :hotGameList="hotGameList" />
			<lobbyGameCard v-for="item in lobbyGameList" :gameList="item" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import banner from "./components/banner.vue";
import hotGame from "./components/hotGame.vue";
import lobbyGameCard from "./components/lobbyGameCard.vue";
import { HomeApi } from "/@/api/home";

const lobbyGameList = ref([]);
const hotGameList = ref([]);
onMounted(() => {
	queryGameInfoDetail();
	queryLobbyTopGame();
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
.textMain {
	background-color: var(--Bg);
}
</style>
