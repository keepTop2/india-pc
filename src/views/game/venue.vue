<template>
	<div>
		<bannerSkeleton v-if="isLoading" />
		<banner v-else></banner>
		<div class="max-width">
			<div class="mt_40 pr_10 pl_10">
				<div class="search-component" ref="resultList">
					<!-- 搜索框 -->
					<div class="search_icon">
						<svg-icon name="search" size="18px"></svg-icon>
					</div>
					<input
						type="text"
						v-model="searchQuery"
						class="search-input"
						:class="searchinputFocus ? 'onFocus' : ''"
						@focus="searchinputFocus = true"
						@blur="searchinputFocus = false"
					/>
					<div class="close_icon curp" v-if="searchQuery">
						<svg-icon name="close" size="18px" @click="searchQuery = ''" v-hover-svg></svg-icon>
					</div>
				</div>
				<div class="tabs curp">
					<span v-for="(item, index) in gameTab" class="tab" :class="currentTab == index ? 'active' : ''" @click="currentTab = index">{{ item.label }}</span>
				</div>
			</div>
			<!-- 查询展示 -->
			<div v-if="searchQuery">
				<venueGameCard :gameList="hotGameObj.gameInfoList"></venueGameCard>
			</div>

			<!-- 默认展示 -->
			<div v-else>
				<!-- 热门推荐 -->
				<hotGameSkeleton :skeletonCount="5" v-if="isLoading" />
				<hotGame :hotGameList="hotGameObj.gameInfoList" v-else-if="hotGameObj.gameInfoList?.length" />
				<div v-if="isLoading">
					<lobbyGameSkeleton :skeletonCount="6" />
					<lobbyGameSkeleton :skeletonCount="3" />
					<lobbyGameSkeleton :skeletonCount="6" />
					<lobbyGameSkeleton :skeletonCount="1" />
					<lobbyGameSkeleton :skeletonCount="5" />
				</div>
				<div v-else>
					<lobbyGameCard :gameList="newGameObj" title="新游戏" v-if="newGameObj.gameInfoList?.length" />
					<lobbyGameCard :gameList="allgameObj" title="全部游戏" v-if="allgameObj.gameInfoList?.length" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import banner from "./components/venueBanner.vue";
import bannerSkeleton from "../home/components/bannerSkeleton.vue";
import hotGame from "../home/components/hotGame.vue";
import hotGameSkeleton from "../home/components/hotGameSkeleton.vue";
import lobbyGameSkeleton from "../home/components/lobbyGameSkeleton.vue";
import lobbyGameCard from "../home/components/lobbyGameCard.vue";
import venueGameCard from "./components/venueGameCard.vue";
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
const searchinputFocus = ref(false);
const GameList = ref([]);

const hotGameObj: any = reactive({});
const newGameObj: any = reactive({});
const allgameObj: any = reactive({});
const gameTab: any = ref([]);
const gameList = ref([
	{ id: 1, name: "游戏名称6026" },
	{ id: 2, name: "游戏名称3499" },
	{ id: 3, name: "游戏名称8942" },
	{ id: 4, name: "游戏名称7668" },
	{ id: 5, name: "游戏名称7404" },
	{ id: 6, name: "游戏名称4243" },
	{ id: 7, name: "游戏名称6430" },
	{ id: 8, name: "游戏名称9817" },
]);
const searchHistoryList = ref([
	{ id: 1, name: "游戏名称6026" },
	{ id: 2, name: "游戏名称3499" },
	{ id: 3, name: "游戏名称8942" },
	{ id: 4, name: "游戏名称7668" },
]);

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

const searchQuery = ref(""); // 搜索关键词
// 计算属性，用于筛选搜索结果
const filteredResults = computed(() => {
	if (!searchQuery.value) {
		return []; // 如果搜索框为空，则显示全部
	}
	return gameList.value.filter((item) => item.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});
</script>

<style lang="scss" scoped>
.home-wrapper {
	padding-bottom: 40px;
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
.search-component {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	position: relative;
	.search-input {
		width: 100%;
		height: 50px;
		background: var(--Bg2);
		border-radius: 6px;
		font-size: 14px;
		border: 1px solid var(--Line_2);
		padding-left: 54px;
		color: var(--Text_s);
	}

	.onFocus {
		border: 1px solid var(--Theme);
	}
	.search_icon {
		position: absolute;
		left: 12px;
		top: 16px;
		margin-right: 24px;
		padding-right: 12px;
		border-right: 1px solid var(--Line_2);
		display: flex;
		align-items: center;
	}
	.close_icon {
		position: absolute;
		right: 12px;
		top: 16px;
	}
}
</style>
