<template>
	<div>
		<bannerSkeleton v-if="isLoading" />
		<banner v-else></banner>
		<div class="max-width">
			<div class="mt_40 pr_10 pl_10">
				<input type="text" class="searchInput" />
				<div class="tabs curp">
					<span v-for="(item, index) in gameTab" class="tab" :class="currentTab == index ? 'active' : ''" @click="currentTab = index">{{ item.label }}</span>
				</div>
			</div>

			<!-- 热门推荐 -->
			<hotGameSkeleton :skeletonCount="5" v-if="isLoading" />
			<hotGame :hotGameList="hotGameObj.gameInfoList" v-else-if="hotGameObj.gameInfoList?.length" />
			<Fragment v-if="isLoading">
				<lobbyGameSkeleton :skeletonCount="6" />
				<lobbyGameSkeleton :skeletonCount="3" />
				<lobbyGameSkeleton :skeletonCount="6" />
				<lobbyGameSkeleton :skeletonCount="1" />
				<lobbyGameSkeleton :skeletonCount="5" />
			</Fragment>
			<Fragment v-else>
				<lobbyGameCard :gameList="newGameObj" title="新游戏" v-if="newGameObj.gameInfoList?.length" />
				<lobbyGameCard :gameList="allgameObj" title="全部游戏" v-if="allgameObj.gameInfoList?.length" />
			</Fragment>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import banner from "./components/venueBanner.vue";
import bannerSkeleton from "../home/components/bannerSkeleton.vue";
import hotGame from "../home/components/hotGame.vue";
import hotGameSkeleton from "../home/components/hotGameSkeleton.vue";
import lobbyGameSkeleton from "../home/components/lobbyGameSkeleton.vue";
import lobbyGameCard from "../home/components/lobbyGameCard.vue";

interface gameList {
	gameInfoList: [];
	id: number | null;
	label: string | number | null;
	name: string | number | null;
}

import { gameApi } from "/@/api/game";
import { useRoute } from "vue-router";
import { reactive } from "vue";
const isLoading = ref(false);
const GameList = ref([]);

const hotGameObj: any = reactive({});
const newGameObj: any = reactive({});
const allgameObj: any = reactive({});
const gameTab: any = ref([]);
const currentTab = ref(0);
// 根据标签添加预定义的选项

const labelSet = new Set<number | string | null>();
onMounted(() => {
	queryGameInfoByOneClassId();
});
const route = useRoute();
const queryGameInfoByOneClassId = () => {
	isLoading.value = true;
	const params = route.query.gameOneId;
	gameApi
		.queryGameInfoByOneClassId({ gameOneId: params })
		.then((res) => {
			// 遍历 res.data，收集标签
			res.data.forEach((item: gameList) => {
				labelSet.add(item.label);
			});
			const predefinedLabels: { [key: number]: string } = {
				0: "全部",
				1: "热门",
				2: "新游戏",
			};
			// 遍历预定义标签，将存在的标签添加到 gameTab 中
			Object.entries(predefinedLabels).forEach(([value, label]) => {
				if (labelSet.has(Number(value))) {
					gameTab.value.push({
						value: Number(value),
						label: label,
					});
				}
			});

			// 遍历 res.data，添加每个游戏的标签
			res.data.forEach((item: gameList, index: number) => {
				gameTab.value.push({
					value: gameTab.value.length, // Adjusting index to avoid collisions with predefined labels
					label: item.name,
				});
			});

			// 保存原始数据
			GameList.value = JSON.parse(JSON.stringify(res.data));

			// 热门推荐
			flatMapGame(res.data, 1, hotGameObj);
			// 新游戏
			flatMapGame(res.data, 2, newGameObj);
			// 全部游戏
			flatMapGame(res.data, 0, allgameObj);
		})
		.finally(() => {
			isLoading.value = false;
		})
		.catch((err) => {
			err;
		});
};
const flatMapGame = (orginData: any, labelBy: number, target: object) => {
	const gameList = orginData.filter((item: any) => item.label === labelBy);

	Object.assign(target, {
		...gameList[0],
		gameInfoList: gameList.reduce((acc: any, obj: any) => {
			return acc.concat(obj.gameInfoList);
		}, []),
	});
};
// 监听 query 参数变化
watch(
	() => route.query.gameOneId,
	() => {
		queryGameInfoByOneClassId();
	}
);
</script>

<style lang="scss" scoped>
.home-wrapper {
	padding-bottom: 40px;
}
.searchInput {
	width: 100%;
	height: 50px;
	background: var(--Bg2);
	border-radius: 6px;
	font-size: 14px;
	color: var(--Text2);
	border: 1px solid var(--Line_2);
}
.tabs {
	display: flex;
	margin-top: 12px;
	.tab {
		padding: 12px 22px;
		margin-right: 8px;
		background: var(--Bg2);
		font-size: 14px;
		color: var(--Text1);
		border-radius: 4px;
	}
	.active {
		background-color: var(--Theme);
		color: var(--Text_s);
	}
}
</style>
