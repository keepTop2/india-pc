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
					@input="
						() => {
							isLoading = true;
							filterGames();
						}
					"
				/>
				<div class="close_icon curp" v-if="searchQuery">
					<svg-icon name="close" size="18px" @click="searchQuery = ''" v-hover-svg></svg-icon>
				</div>
			</div>
			<div class="tabs curp">
				<span :class="currentTab == '0' ? 'active tab' : 'tab'" @click="clickTab('0')">全部</span>
				<span v-for="(item, index) in gameData" class="tab" :class="currentTab == item._key ? 'active' : ''" @click="clickTab(item._key)" :key="index">{{ item.name }}</span>
			</div>

			<div v-ok-loading="isLoading" class="containers">
				<!-- 查询展示 -->
				<div v-if="searchQuery">
					<div class="games-module">
						<div class="content" v-if="searchGames.length">
							<LotteryCard :key="game._key" :data="game.data" v-for="game in searchGames" @select="pushView(game)" />
						</div>
						<div class="empty" v-else-if="!searchGames.length && !isLoading">
							<svg-icon name="sports-empty" width="142px" height="120px" />
							<p>哎呀！还没有数据！</p>
						</div>
					</div>
				</div>

				<div v-else class="games-module" v-for="item in games" :key="item._key">
					<div className="module-title" v-if="currentTab === '0'">
						<div style="display: flex; gap: 12px; align-items: center">
							<img :src="item.iconFileUrl" alt="" />
							<span className="name">{{ item.name }}</span>
						</div>
						<span @click="currentTab = item._key" class="more">更多</span>
					</div>
					<div class="content">
						<HotLotteryCard v-if="item.label === 1" :data="game.data" :key="item._key" v-for="game in item.gameInfoList.slice(0, 4)" @select="pushView(game)" />
						<LotteryCard v-else :data="game.data" v-for="game in item.gameInfoList?.slice(0, 4)" @select="pushView(game)" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { stringify } from "qs";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { gameApi } from "/@/api/game";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n/index";
import useLotteryCard from "/@/views/lottery/components/LotteryCard/Index";
import { useWebSocket } from "/@/views/lottery/hooks/useWebSocket";
import Common from "/@/views/sports/utils/common";

const $: any = i18n.global;

const { LotteryCard, HotLotteryCard } = useLotteryCard();

const currentTab = ref<string | undefined>("0");
const searchQuery = ref<string>(""); // 搜索关键词
const searchinputFocus = ref(false);

useWebSocket({});

const gameData = ref<any[]>([]);

const clickTab = (id: string) => {
	currentTab.value = id;
	filterGames();
};
const isLoading = ref(false);
// 根据标签添加预定义的选项
onMounted(async () => {
	await queryGameInfoByOneClassId();
	currentTab.value = route.query.gameTwoId as string;
});
const route = useRoute();
const router = useRouter();
const queryGameInfoByOneClassId = async () => {
	const gameOneId = route.query.gameOneId;
	await gameApi
		.queryGameInfoByOneClassId({ gameOneId })
		.then((res) => {
			gameData.value = res.data.map((item: any) => {
				const _key = (item.id || "") + "-" + item.label;
				return {
					...item,
					_key: item.label == 1 ? 1 : item.label == 2 ? 2 : item.id,
					name: item.label == 1 ? "热门推荐" : item.label == 2 ? "新游戏" : item.name,
					gameInfoList: item.gameInfoList?.map((game) => ({ ...game, data: { ...game.data, seconds: Math.floor((game.data.lotteryDate - game.data.lotteryTime) / 1000) } })),
				};
			});
		})
		.finally(() => {})
		.catch((err) => {
			err;
		});
};
// 模糊查询
const searchGames = ref<any[]>([]);
const filterGames = Common.debounce(() => {
	isLoading.value = true;
	if (!searchQuery.value.trim()) {
		searchGames.value = [];
		isLoading.value = false;
	} else {
		const curData =
			currentTab.value === "0"
				? gameData.value.flatMap((item) => item.gameInfoList)
				: gameData.value.filter((item) => item._key === currentTab.value).flatMap((item) => item.gameInfoList);

		searchGames.value = curData.filter((game) => game.data.gameName.includes(searchQuery.value));
	}

	setTimeout(() => {
		isLoading.value = false;
	}, 500);
}, 300);

const games = computed(() => {
	if (currentTab.value === "0") return gameData.value;
	console.log(
		gameData.value.filter((game) => game._key === currentTab.value),
		"=======currentTab.value"
	);
	return gameData.value.filter((game) => game._key === currentTab.value);
});

const handleSelect = (game) => {};

// 监听 query 参数变化
watch(
	() => route.query.gameTwoId,
	async () => {
		currentTab.value = route.query.gameTwoId as string;
	}
);

interface Maps {
	[key: string]: string;
}
const maps: Maps = {
	K3: "/lottery/kuaisan",
	SSQ: "/lottery/unionLotto",
};

const pushView = (game) => {
	console.log("game", game);
	const { gameCategoryCode, venueCode, gameCode } = game;
	const { maxWin = 0 } = game.data;
	const searchParams = { venueCode, gameCode, maxWin };
	const targetView = maps[gameCategoryCode];
	if (!targetView) {
		showToast("Error: Path Not Found!");
		return;
	}
	router.push(`${targetView}?${stringify(searchParams)}`);
};
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
		background: var(--Button);
		font-size: 14px;
		color: var(--Text-1);
		border-radius: 4px;
		transition: background-color 0.3s ease;
		&.active {
			background-color: var(--Theme);
			color: var(--Text-s);
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
		background: var(--Bg-2);
		border-radius: 6px;
		font-size: 14px;
		border: 1px solid var(--Line-2);
		padding-left: 54px;
		color: var(--Text-s);
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
		border-right: 1px solid var(--Line-2);
		display: flex;
		align-items: center;
	}
	.close_icon {
		position: absolute;
		right: 12px;
		top: 16px;
	}
}
.containers {
	height: calc(100vh - 200px);
	position: relative;
	.games-module {
		margin-top: 24px;
		.module-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			column-gap: 12px;
			margin-bottom: 20px;
			img {
				width: 24px;
				height: 24px;
			}
			.name {
				font-size: var(--title-text-size);
				color: var(--Text-a);
			}
			.more {
				color: var(--Text-1);
				font-size: 18px;
				cursor: pointer;
			}
		}
		.content {
			display: flex;
			gap: 16px;
			align-items: center;
			flex-wrap: wrap;
			> div {
				width: calc((100% - 48px) / 4);
			}
		}
		.empty {
			text-align: center;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			p {
				color: var(--Text-1);
			}
		}
	}
}
</style>
