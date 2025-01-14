<template>
	<div class="mt_36" v-if="gameList?.gameInfoList?.length">
		<div class="cardHeader">
			<div>
				<span class="flex-center" style="gap: 12px">
					<img v-lazy-load="newGame ? newGameIcon : gameList?.iconFileUrl" alt="" />
					<span class="Text_s fs_20">{{ title ? title : gameList?.name ? gameList?.name : $t(`home['热门推荐']`) }}</span>
				</span>
			</div>
			<div class="more Text1 fs_18 curp" v-if="gameList?.gameInfoList?.length !== 1">
				<span @click="gotoVenue(gameList)" class="mr_4">{{ $t(`home['更多']`) }}</span>
				<span class="arrow" @click="goToPrevSlide"> <svg-icon :name="isBeginning ? 'common-arrow_left' : 'common-arrow_left_on'" width="8" height="12" /></span>
				<span class="arrow" @click="goToNextSlide"> <svg-icon :name="isEnd ? 'common-arrow_right' : 'common-arrow_right_on'" width="8" height="12" /></span>
			</div>
		</div>
		<div class="lobbyGameList">
			<div class="onlyOneGame" v-if="bigOneItem && gameList?.gameInfoList?.length == 1" @click="Common.goToGame(gameList?.gameInfoList[0])">
				<img v-lazy-load="gameList?.gameInfoList[0].iconFileUrl" alt="" />
			</div>

			<div v-else>
				<Swiper :slidesPerView="8" :spaceBetween="15" :modules="modules" class="swiper-container curp" @swiper="onSwiper">
					<SwiperSlide v-for="(item, index) in gameList?.gameInfoList" :key="index" class="lobbyGameItem">
						<div class="cornerMark">
							<svg-icon name="new_game_icon" v-if="item.cornerLabels == 1" size="60" />
							<svg-icon name="hot_game_icon" v-else-if="item.cornerLabels == 2" size="60" />
						</div>
						<div class="imgBox">
							<img v-lazy-load="item.iconFileUrl" alt="" />
						</div>
						<div class="onHover">
							<svg-icon name="common-play_icon" size="44px" @click.self="Common.goToGame(item)" />
							<div class="gameName">{{ item.name }}</div>
						</div>
						<div class="collect" @click="collectGame(item)">
							<svg-icon :name="collectGamesStore.getCollectGamesList.some((game:any) => game.id === item.id) ? 'collect_on' : 'collect'" size="19.5px"></svg-icon>
						</div>
					</SwiperSlide>
				</Swiper>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { HomeApi } from "/@/api/home";
import showToast from "/@/hooks/useToast";
import router from "/@/router";
import { useModalStore } from "/@/stores/modules/modalStore";
import { useUserStore } from "/@/stores/modules/user";
import Common from "/@/utils/common";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useRoute } from "vue-router";
import { useCollectGamesStore } from "/@/stores/modules/collectGames";
import { ref } from "vue";
import { Autoplay, Navigation } from "swiper/modules";
import newGameIcon from "/@/assets/common/newGame_icon.png";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const collectGamesStore = useCollectGamesStore();
const modules = ref([Autoplay, Navigation]);
interface gameInfo {
	id: string;
	name: string;
	icon: string;
	status: number;
	remark: string;
	sort: number;
	venueCode: string;
	gameCode: string;
	label: string;
	cornerLabels: string;
	maintenanceStartTime: string;
	maintenanceEndTime: string;
	collect: boolean;
}
const isEnd = ref(false);
const isBeginning = ref(true);
const swiperRef: any = ref(null);
const route = useRoute();
const props = defineProps({
	gameList: {
		type: Object,
	},
	title: {
		type: String,
	},
	newGame: {
		type: Boolean,
		default: false,
	},
	bigOneItem: {
		type: Boolean,
		default: true,
	},
});

const collectGame = (game: gameInfo) => {
	if (useUserStore().getLogin) {
		const params = {
			gameId: game.id,
			type: !game.collect,
		};
		game.collect = !game.collect;
		HomeApi.collection(params).then((res) => {
			if (res.code === Common.ResCode.SUCCESS) {
				showToast(!game.collect ? $.t(`home['取消收藏成功']`) : $.t(`home['收藏成功']`));
			}
			collectGamesStore.setCollectGamesList();
		});
	} else {
		useModalStore().openModal("LoginModal");
	}
};
const gotoVenue = (gameInfo: any) => {
	if (route.query.gameOneId) {
		router.push({ path: "/game/venue", query: { gameOneId: route.query.gameOneId, gameTwoId: gameInfo.id } });
	} else {
		router.push({ path: "/game/venue", query: { gameOneId: gameInfo.gameOneId, gameTwoId: 0 } });
	}
};

const onSwiper = (swiper: any) => {
	swiperRef.value = swiper;
};
const goToNextSlide = () => {
	if (isEnd.value) return;
	isEnd.value = swiperRef.value.isEnd;
	isBeginning.value = swiperRef.value.isBeginning;
	swiperRef.value.slideNext();
};
const goToPrevSlide = () => {
	if (isBeginning.value) return;
	isEnd.value = swiperRef.value.isEnd;
	isBeginning.value = swiperRef.value.isBeginning;
	swiperRef.value.slidePrev();
};
</script>

<style scoped lang="scss">
.cardHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	img {
		height: 24px;
		width: 24px;
	}
	margin-bottom: 12px;
	.arrow {
		background-color: var(--Butter);
		width: 28px;
		height: 28px;
		display: inline-block;
		text-align: center;
		margin: 0 4px;
		line-height: 28px;
		border-radius: 4px;
	}
}
.lobbyGameList {
	.lobbyGameItem {
		padding-top: 4px;
		position: relative;
		.imgBox {
			width: 151px;
			height: 151px;
		}
		.cornerMark {
			position: absolute;
			top: 0px;
			left: -4px;
			z-index: 30;
		}

		.onHover {
			display: none;
		}
		.collect {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 20;
			cursor: pointer;
		}
		img {
			width: 151px;
			height: 151px;
			object-fit: cover;
			border-radius: 8px;
			pointer-events: none;
		}
		.gameInfo {
			width: 151px;
			height: 151px;
			background: var(--Bg-1);
			font-size: 14px;
			color: var(--Text-1);
			padding: 6px 12px;
			line-height: 22px;
			border-radius: 8px;
			word-break: break-all;
			display: -webkit-box; /* 必须使用 Webkit 特性布局 */
			-webkit-line-clamp: 2; /* 限制行数为 2 行 */
			-webkit-box-orient: vertical; /* 垂直排列盒子元素 */
			overflow: hidden; /* 隐藏超出部分 */
			text-overflow: ellipsis; /* 添加省略号 */
			white-space: normal; /* 允许换行 */
			display: flex;
			align-items: center;
		}
	}
	.lobbyGameItem:hover {
		.onHover {
			position: absolute;
			top: 4px;
			left: 0;
			width: 151px;
			height: 151px;
			background: rgba(0, 0, 0, 0.7);
			backdrop-filter: blur(5px);
			border-radius: 8px;
			display: block;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 14px;
			color: var(--Text-a);
			.gameName {
				margin-top: 10px;
			}
		}
	}

	.onlyOneGame {
		flex: 1;
		width: 100%;
		cursor: pointer;
		img {
			width: 100%;
			height: 334px;
			border-radius: 12px;
			object-fit: cover;
		}
	}
}
</style>
