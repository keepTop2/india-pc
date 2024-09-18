<template>
	<div class="mt_40 pr_10 pl_10">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<img :src="gameList?.icon" alt="" />
					<span class="Text_s fs_20">{{ gameList?.name }}</span>
				</span>
			</div>
			<div class="more Text1 fs_18 curp">更多</div>
		</div>
		<div class="lobbyGameList">
			<div class="onlyOneGame" v-if="gameList?.gameInfoList.length == 1">
				<img :src="gameList?.gameInfoList[0].icon" alt="" />
			</div>
			<slide v-else>
				<div v-for="(item, index) in gameList?.gameInfoList" :key="index" class="lobbyGameItem" @click="Common.goToGame(item)">
					<div>
						<img :src="item.icon" alt="" />
					</div>
					<div class="gameInfo">{{ item.name }}</div>
					<div class="onHover">
						<div class="playBtn fs_15 Text_s">Play</div>
					</div>
					<div class="collect" @click="collectGame(item)">
						<svg-icon :name="item.collect ? 'collect_on' : 'collect'" size="19.5px"></svg-icon>
					</div>
				</div>
			</slide>
		</div>
	</div>
</template>

<script setup lang="ts">
import slide from "./slide.vue";
import { gameApi } from "/@/api/game";
import { HomeApi } from "/@/api/home";
import showToast from "/@/hooks/useToast";
import { useUserStore } from "/@/stores/modules/user";
import Common from "/@/utils/common";
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
const props = defineProps({
	gameList: {
		type: Object,
	},
});
const collectGame = (game: gameInfo) => {
	const params = {
		gameId: game.id,
		type: !game.collect,
	};
	HomeApi.collection(params).then((res) => {
		if (res.code === Common.ResCode.SUCCESS) {
			showToast(game.collect ? "取消收藏成功" : "收藏成功");
			game.collect = !game.collect;
		}
	});
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
		position: relative;
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
			top: 0;
			left: 0;
			width: 100%;
			height: 190px;
			background: rgba(0, 0, 0, 0.5);
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
