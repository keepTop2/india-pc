<template>
	<div>
		<venueBanner></venueBanner>
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
					<span :class="currentTab == 0 ? 'active tab' : 'tab'" @click="clickTab(0)">全部</span>
					<span v-for="(item, index) in gameData" class="tab" :class="currentTab == item.id ? 'active' : ''" @click="clickTab(item.id)" :key="index">{{ item.name }}</span>
				</div>
			</div>

			<!-- 查询展示 -->
			<div v-if="searchQuery">
				<venueGameCard :gameList="filteredResults"></venueGameCard>
			</div>
			<div v-else>
				<hotGame :hotGameList="gameData.find((item:any) => item.label == 1)?.gameInfoList" v-if="currentTab == 0 || currentTab == 1" />
				<lobbyGameCard :gameList="gameData.find((item:any) => item.label == 2)" title="新游戏" v-if="currentTab == 0 || currentTab == 2" />
				<div v-for="(item, index) in gameData.filter((item:any) => item.label == 0)" :key="index">
					<lobbyGameCard :gameList="item" v-if="currentTab == 0 || item.id == currentTab" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import bannerSkeleton from "../home/components/bannerSkeleton.vue";
import hotGame from "../home/components/hotGame.vue";
import lobbyGameCard from "../home/components/lobbyGameCard.vue";
import venueGameCard from "./components/venueGameCard.vue";
import { gameApi } from "/@/api/game";
import { useRoute } from "vue-router";
import router from "/@/router";
const isLoading = ref(true);
const searchinputFocus = ref(false);
const gameData: any = ref([]);
const currentTab: any = ref(0);
// 根据标签添加预定义的选项
onMounted(async () => {
	await queryGameInfoByOneClassId();
	currentTab.value = route.query.gameTwoId;
});
const route = useRoute();
const queryGameInfoByOneClassId = async () => {
	isLoading.value = true;
	const params = route.query.gameOneId;
	await gameApi
		.queryGameInfoByOneClassId({ gameOneId: params })
		.then((res) => {
			gameData.value = res.data.map((item: any) => {
				return {
					...item,
					id: item.label == 1 ? 1 : item.label == 2 ? 2 : item.id,
					name: item.label == 1 ? "热门推荐" : item.label == 2 ? "新游戏" : item.name,
				};
			});
		})
		.finally(() => {
			isLoading.value = false;
		})
		.catch((err) => {
			err;
		});
};
// 监听 query 参数变化
watch(
	() => route.query.gameOneId,
	async () => {
		await queryGameInfoByOneClassId();
		currentTab.value = route.query.gameTwoId;
	}
);
watch(
	() => route.query.gameTwoId,
	() => {
		currentTab.value = route.query.gameTwoId;
	}
);
const searchQuery = ref(""); // 搜索关键词
// 模糊查询
const filteredResults = computed(() => {
	if (!searchQuery.value) {
		return [];
	}
	let currentTabGameData = [];
	// 处理数据源
	if (currentTab.value == 0) {
		currentTabGameData = gameData.value
			.filter((item: any) => item.label == 0)
			.reduce((acc: any[], item: any) => {
				if (item.gameInfoList && item.gameInfoList.length > 0) {
					acc.push(...item.gameInfoList);
				}
				return acc;
			}, []);
	} else if (currentTab.value == 1) {
		currentTabGameData = gameData.value.find((item: any) => item.id == 1)?.gameInfoList;
	} else if (currentTab.value == 2) {
		currentTabGameData = gameData.value.find((item: any) => item.id == 2)?.gameInfoList;
	} else {
		currentTabGameData = gameData.value.find((item: any) => item.id == currentTab.value)?.gameInfoList;
	}
	return Array.from(
		new Set(
			currentTabGameData.filter((item: any) => item.name.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase())).map((item: any) => JSON.stringify(item)) // 转换对象为字符串以去重
		)
	).map((item: any) => JSON.parse(item)); // 将字符串转换回对象
});
const clickTab = (index: number) => {
	router.push({ path: "/game/venue", query: { gameOneId: route.query.gameOneId, gameTwoId: index } });
};
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
