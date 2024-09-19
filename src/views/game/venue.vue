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
import banner from "./components/venueBanner.vue";
import bannerSkeleton from "../home/components/bannerSkeleton.vue";
import hotGame from "../home/components/hotGame.vue";
import hotGameSkeleton from "../home/components/hotGameSkeleton.vue";
import lobbyGameSkeleton from "../home/components/lobbyGameSkeleton.vue";
import lobbyGameCard from "../home/components/lobbyGameCard.vue";

import { gameApi } from "/@/api/game";
import { useRoute } from "vue-router";
const isLoading = ref(false);
const lobbyGameList = ref([]);
const hotGameList = ref([]);

onMounted(() => {
	queryGameInfoByOneClassId();
});
const queryGameInfoByOneClassId = () => {
	isLoading.value = true;
	const params = useRoute().query.gameOneId;
	gameApi
		.queryGameInfoByOneClassId({ gameOneId: params })
		.then((res) => {
			hotGameList.value = res.data.records;
		})
		.finally(() => {
			isLoading.value = false;
		})
		.catch((err) => {
			err;
		});
};
</script>

<style lang="scss" scoped>
.home-wrapper {
	padding-bottom: 40px;
}
</style>
