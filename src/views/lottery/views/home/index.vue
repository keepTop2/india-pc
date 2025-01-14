<template>
	<div class="lottery-home">
		<div class="mt_24 pr_10 pl_10">
			<VenueBanner :bannerList="bannerList" />
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
					<svg-icon name="common-close" size="18px" @click="searchQuery = ''" v-hover-svg></svg-icon>
				</div>
			</div>
			<div class="tabs curp">
				<span :class="currentTab == '0' ? 'active tab' : 'tab'" @click="clickTab('0')">{{ $.t("lottery.全部") }}</span>
				<span v-for="(item, index) in gameData" class="tab" :class="currentTab == item._key ? 'active' : ''" @click="clickTab(item._key)" :key="index">{{ item.name }}</span>
			</div>

			<div v-ok-loading="isLoading" class="containers">
				<!-- 查询展示 -->
				<div v-if="searchQuery">
					<div class="games-module">
						<div class="content" v-if="searchGames.length">
							<LotteryCard :key="game._key" :data="game.data" :maxWin="game.data.maxWin" v-for="game in searchGames" @select="pushView(game)" />
						</div>
						<div class="empty" v-else-if="!searchGames.length && !isLoading">
							<svg-icon name="sports-empty" width="142px" height="120px" />
							<p>{{ $.t("lottery['哎呀！还没有数据！']") }}</p>
						</div>
					</div>
				</div>

				<div v-else class="games-module" v-for="item in games" :key="item._key">
					<div className="module-title" v-if="currentTab === '0'">
						<div style="display: flex; gap: 12px; align-items: center">
							<img :src="item.iconFileUrl" alt="" />
							<span className="name">{{ item.name }}</span>
						</div>
						<span @click="currentTab = item._key" class="more">{{ $.t("lottery.更多") }}</span>
					</div>
					<div class="content">
						<HotLotteryCard
							v-if="item.label === 1"
							:data="game.data || {}"
							:key="game.data.lotteryDate + index"
							:maxWin="game.data.maxWin"
							v-for="(game, index) in item.gameInfoList.slice(0, currentTab === '0' ? column : item.gameInfoList.length)"
							@select="pushView(game)"
						/>
						<LotteryCard
							v-else
							:data="game.data || {}"
							:maxWin="game.data.maxWin"
							v-for="(game, index) in item.gameInfoList?.slice(0, column)"
							:key="game.data.currentTime + index"
							@select="pushView(game)"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { debounce } from "lodash-es";
import { stringify } from "qs";
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { GameListItem } from "../../types/game";
import { bannerApi } from "/@/api/banner";
import { gameApi } from "/@/api/game";
import VenueBanner from "/@/components/venueBanner.vue";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n";
import useLotteryCard from "/@/views/lottery/components/LotteryCard/Index";
import { useWebSocket } from "/@/views/lottery/hooks/useWebSocket";
const $: any = i18n.global;

const { LotteryCard, HotLotteryCard } = useLotteryCard();
const route = useRoute();
const router = useRouter();

const currentTab = ref<string>("0");
const searchQuery = ref<string>("");
const searchinputFocus = ref(false);
const isLoading = ref(false);
const gameData = ref<any[]>([]);
const bannerList = ref([]);

// 获取 Banner 列表
const getBannerList = async () => {
	const { data } = await bannerApi.queryBannerList({ gameOneClassId: "ACELT" });
	bannerList.value = data;
};

// 根据分类 ID 查询游戏信息
const queryGameInfoByOneClassId = debounce(async () => {
	const gameOneId = route.query.gameOneId as string;
	const { data } = await gameApi.queryGameInfoByOneClassId({ gameOneId }, { showLoading: false });
	gameData.value = data.map((item: any) => ({
		...item,
		_key: item.label == 1 ? "1" : item.label == 2 ? "2" : item.id,
		name: item.label == 1 ? $.t("lottery['热门推荐']") : item.label == 2 ? $.t("lottery['新游戏']") : item.name,
		gameInfoList: item.gameInfoList
			.filter((game: any) => game.data)
			?.map((game: any) => ({
				...game,
				data: { ...game.data, seconds: Math.floor((game.data.lotteryDate - game.data.currentTime) / 1000) },
			})),
	}));
}, 200);

// 初始化 WebSocket，监听数据更新
const { close } = useWebSocket({
	callback: queryGameInfoByOneClassId,
	fallbackFn: () => {},
});

onUnmounted(() => close());

// 处理输入框内容变化
const handleSearchInput = debounce(() => {
	isLoading.value = true;
	filterGames();
}, 300);

// 过滤游戏列表（搜索功能）
const searchGames = ref<any[]>([]);
const filterGames = () => {
	if (!searchQuery.value.trim()) {
		searchGames.value = [];
	} else {
		const filteredData =
			currentTab.value === "0" ? gameData.value.flatMap((item) => item.gameInfoList) : gameData.value.find((item) => item._key === currentTab.value)?.gameInfoList || [];
		searchGames.value = filteredData.filter((game) => game.data.gameName.includes(searchQuery.value));
	}
	isLoading.value = false;
};

// 处理标签切换
const clickTab = (id: string) => {
	currentTab.value = id;
	filterGames();
};

// 游戏卡片数据展示
const games = computed(() => (currentTab.value === "0" ? gameData.value : gameData.value.filter((item) => item._key === currentTab.value)));

interface Maps {
	[key: string]: string;
}
const maps: Maps = {
	K3: "/lottery/kuaisan", // 快三
	SSQ: "/lottery/unionLotto",
	PK10: "/lottery/pk10",
	_28: "/lottery/lucky28", // 幸运 28
	SSC: "/lottery/shishicai",
	SYXW: "/lottery/elevenChooseFive", // 11 选 5
	_3D: "/lottery/3D",
};

const pushView = (game: GameListItem) => {
	const { gameCategoryCode, venueCode, gameCode } = game;
	const { maxWin = 0 } = game.data;
	const searchParams = { venueCode, gameCode, maxWin, lotteryIcon: game.data.iconPc };
	const targetView = maps[gameCategoryCode];
	if (targetView) {
		router.push(`${targetView}?${stringify(searchParams)}`);
	} else {
		showToast("Error: Path Not Found!");
	}
};

// 媒体查询 1920四列 1440三列  1024二列
const column = ref(4);
const changeColumn = () => {
	const screenWidth = window.screen.width;
	if (screenWidth >= 1920) {
		column.value = 4;
	} else if (screenWidth < 1920 && screenWidth >= 1440) {
		column.value = 3;
	} else {
		column.value = 2;
	}
};

// 页面加载时执行
onMounted(async () => {
	await getBannerList();
	await queryGameInfoByOneClassId();
	changeColumn();
	window.addEventListener("resize", changeColumn);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", changeColumn);
});

// 监听 query 参数变化
watch(
	() => route.query.gameTwoId,
	async () => {
		currentTab.value = route.query.gameTwoId as string;
	}
);
</script>

<style scoped lang="scss">
.lottery-home {
	width: 1308px;
	margin: 24px auto;
	:deep(.swiper-box) {
		padding: 0;
	}
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
		.lottery-card.hot-lottery-card:nth-child(2) {
			background: linear-gradient(180deg, #1e2127 0%, #2a3438 100%) !important;
		}
		.lottery-card.hot-lottery-card:nth-child(3) {
			background: linear-gradient(180deg, #1e2127 0%, #35382a 100%) !important;
		}
		.lottery-card.hot-lottery-card:nth-child(4) {
			background: linear-gradient(180deg, #1e2127 0%, #2a3833 100%) !important;
		}
	}
}

@media (min-width: 1440px) and (max-width: 1919px) {
	.lottery-home {
		width: 1176px !important;
	}
	.containers {
		.games-module {
			.content > div {
				width: calc((100% - 32px) / 3);
			}
		}
	}
}

@media (min-width: 1024px) and (max-width: 1439px) {
	.lottery-home {
		width: 931px !important;
	}
	.containers {
		.games-module {
			.content > div {
				width: calc((100% - 16px) / 2);
			}
		}
	}
}
</style>
