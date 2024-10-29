<template>
	<div class="pr_10 pl_10">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<img v-lazy-load="hotGameIcon" alt="" />
					<span class="Text_s fs_20">热门推荐</span>
				</span>
			</div>
		</div>
		<slide class="hotGameList">
			<div v-for="(item, index) in hotGameList" :key="index" class="hotGameItem">
				<img v-lazy-load="item.icon ? item.icon : ''" alt="" />
				<div class="gameInfo Texta">
					<div class="fs_19">
						<img v-lazy-load="hotGameIcon" alt="" class="mr_6" /><span>{{ item.venueCode }}</span>
					</div>
					<div class="fs_13 mt_9">
						{{ item.name }}
					</div>
					<div class="gotoGameBtn mt_9">
						<button class="common_btn" @click="Common.goToGame(item)">进入游戏</button>
					</div>
				</div>
				<div class="collect" @click="collectGame(item)">
					<svg-icon :name="item.collect ? 'collect_on' : 'collect'" size="19.5px"></svg-icon>
				</div>
			</div>
		</slide>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import hotGameIcon from "./image/hotGameIcon.png";
import { HomeApi } from "/@/api/home";
import showToast from "/@/hooks/useToast";
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
	hotGameList: {
		type: Array<gameInfo>,
	},
});
const collectGame = (game: gameInfo) => {
	const params = {
		gameId: game.id,
		type: !game.collect,
	};
	game.collect = !game.collect;
	HomeApi.collection(params).then((res) => {
		if (res.code === Common.ResCode.SUCCESS) {
			showToast(!game.collect ? "取消收藏成功" : "收藏成功");
		}
	});
};
</script>

<style scoped lang="scss">
.cardHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
	img {
		height: 24px;
		width: 24px;
	}
}

.hotGameList {
	display: flex;
	.hotGameItem {
		margin-right: 15px;
		position: relative;
		border-radius: 12px;
		.collect {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 20;
			cursor: pointer;
		}
		img {
			width: 258px;
			height: 258px;
			border-radius: 12px;
			object-fit: cover;
			pointer-events: none;
		}
		.gameInfo {
			bottom: 0;
			left: 0;
			width: 100%;
			position: absolute;
			background: rgba(0, 0, 0, 0.05);
			backdrop-filter: blur(13.298970222473145px);
			padding: 12px 14px;
			img {
				height: 20px;
				width: 20px;
			}
			.gotoGameBtn {
				display: none;
			}
		}
	}
	.hotGameItem:hover {
		.gameInfo {
			.gotoGameBtn {
				display: block;
			}
		}
	}
}
</style>
