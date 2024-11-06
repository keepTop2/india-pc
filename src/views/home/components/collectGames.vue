<template>
	<div class="mt_40 pr_10 pl_10" v-if="gameList?.length">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<img v-lazy-load="gameList?.icon" alt="" />
					<span class="Text_s fs_20">{{ "喜欢的游戏" }}</span>
				</span>
			</div>
		</div>
		<div class="lobbyGameList">
			<slide>
				<div v-for="(item, index) in gameList" :key="index" class="lobbyGameItem">
					<div class="cornerMark">
						<svg-icon name="new_game_icon" v-if="item.cornerLabels == 1" size="60" />
						<svg-icon name="hot_game_icon" v-else-if="item.cornerLabels == 2" size="60" />
					</div>
					<div class="imgBox">
						<img v-lazy-load="item.icon" alt="" />
					</div>
					<div class="gameInfo">{{ item.name }}</div>
					<div class="onHover">
						<div class="playBtn fs_15 Text_s" @click.self="Common.goToGame(item)">Play</div>
					</div>
					<div class="collect" @click="collectGame(item)">
						<svg-icon name="collect_on" size="19.5px"></svg-icon>
					</div>
				</div>
			</slide>
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
import { useRoute } from "vue-router";
import { useCollectGamesStore } from "/@/stores/modules/collectGames";
const collectGamesStore = useCollectGamesStore();
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
const route = useRoute();
const props = defineProps({
	gameList: {
		type: Object,
	},
	title: {
		type: String,
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
				showToast(!game.collect ? "取消收藏成功" : "收藏成功");
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
}
.lobbyGameList {
	display: flex;
	.lobbyGameItem {
		margin-right: 15px;
		padding-top: 4px;
		position: relative;
		.cornerMark {
			position: absolute;
			top: 0px;
			left: -4px;
			z-index: 30;
		}
		.imgBox {
			height: 190px;
			width: 190px;
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
			width: 190px;
			height: 190px;
			object-fit: cover;
			border-top-left-radius: 12px;
			border-top-right-radius: 12px;
			pointer-events: none;
		}
		.gameInfo {
			height: 52px;
			width: 190px;
			background: var(--Bg1);
			font-size: 14px;
			color: var(--Text1);
			padding: 6px 12px;
			line-height: 22px;
			border-bottom-left-radius: 12px;
			border-bottom-right-radius: 12px;
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
			width: 100%;
			height: 190px;
			background: rgba(0, 0, 0, 0.5);
			border-top-left-radius: 12px;
			border-top-right-radius: 12px;
			display: block;
			display: flex;
			.playBtn {
				border-radius: 4px;
				width: 130px;
				height: 34px;
				line-height: 34px;
				text-align: center;
				background: var(--Theme);
				margin: auto;
				cursor: pointer;
			}
		}
	}
	.lobbyGameItem:first-child {
		margin-left: 4px;
	}
	.onlyOneGame {
		flex: 1;
		width: 100%;
		cursor: pointer;
		img {
			width: 100%;
			height: 242px;
			border-radius: 12px;
			object-fit: cover;
		}
	}
}
</style>
