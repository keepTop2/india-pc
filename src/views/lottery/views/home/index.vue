<template>
	<div class="lottery-home">
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
			<!-- 查询展示 -->
			<div v-if="searchQuery"></div>
			<div class="hot-recommend">
				<div className="module-title">
					<svg-icon size="24px" name="sports-hot" />
					<span className="name">热门推荐</span>
				</div>
				<div class="content">
					<HotLotteryCard v-bind="item" v-for="item in hotGame.slice(0, 4)" />
				</div>
			</div>
			<div class="new-games"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { gameApi } from "/@/api/game";
import useLotteryCard from "/@/views/lottery/components/LotteryCard/Index";
import { useRoute } from "vue-router";

const { LotteryCard, HotLotteryCard } = useLotteryCard({});
const currentTab = ref<number>(0);
const searchQuery = ref<string>(""); // 搜索关键词
const searchinputFocus = ref(false);

const gameData = ref<any[]>([
	{ id: 0, name: "全部" },
	{ id: 1, name: "热门推荐" },
	{ id: 2, name: "新游戏" },
	{ id: 3, name: "独家" },
]);

const clickTab = (id: number) => {
	currentTab.value = id;
};
const isLoading = ref(false);
// 根据标签添加预定义的选项
onMounted(async () => {
	await queryGameInfoByOneClassId();
	currentTab.value = Number(route.query.gameTwoId);
});
const route = useRoute();
const queryGameInfoByOneClassId = async () => {
	isLoading.value = true;
	const gameOneId = route.query.gameOneId;
	await gameApi
		.queryGameInfoByOneClassId({ gameOneId })
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
// 热门游戏
const hotGame = computed(() => {
	const games: any = [];
	gameData.value.forEach((item) => {
		if (item.label === 1) {
			item.gameInfoList.forEach((game) => {
				const {
					data: { lotteryDate, lotteryTime, gameName, gameDesc, iconPc, maxWin },
				} = game;

				games.push({ gameName, gameDesc, iconPc, maxWin, seconds: Math.floor((lotteryDate - lotteryTime) / 1000) });
			});
		}
	});
	return games;
});
// 监听 query 参数变化
watch(
	() => route.query.gameOneId,
	async () => {
		await queryGameInfoByOneClassId();
		currentTab.value = Number(route.query.gameTwoId);
	}
);
</script>

<style scoped lang="scss">
.lottery-home {
	width: 1308px;
	margin: 24px auto;
}
.tabs {
	display: flex;
	margin-top: 12px;
	.tab {
		padding: 7px 12px;
		margin-right: 8px;
		background: var(--button);
		font-size: 14px;
		color: var(--Text1);
		border-radius: 4px;
		transition: background-color 0.3s ease;
		&.active {
			background-color: var(--Theme);
			color: var(--Text_s);
		}
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
		transition: border-color 0.3s ease;
		&.onFocus {
			border: 1px solid var(--Theme);
		}
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
.hot-recommend {
	.module-title {
		display: flex;
		align-items: center;
		column-gap: 12px;
		margin-bottom: 20px;
		.name {
			font-size: var(--title-text-size);
			color: var(--Text_a);
		}
	}
	.content {
		display: flex;
		column-gap: 16px;
		align-items: center;
		flex-wrap: wrap;
		> div {
			width: calc((100% - 48px) / 4);
		}
	}
}
</style>
