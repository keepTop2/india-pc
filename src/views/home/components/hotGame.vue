<template>
	<div class="mt_40 pr_10 pl_10">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<img src="./image/hotGameIcon.png" alt="" />
					<span class="Text_s fs_20">热门推荐</span>
				</span>
			</div>
		</div>
		<slide class="hotGameList">
			<div v-for="(item, index) in hotGameList" :key="index" class="hotGameItem">
				<img :src="item.icon" alt="" />
				<div class="gameInfo Texta">
					<div class="fs_19">
						<img src="./image/hotGameIcon.png" alt="" class="mr_6" /><span>{{ item.venueCode }}</span>
					</div>
					<div class="fs_13 mt_9">
						{{ item.name }}
					</div>
					<div class="gotoGameBtn">
						<button class="common_btn" @click="Common.goToGame(item)">进入游戏</button>
					</div>
				</div>
			</div>
		</slide>
	</div>
</template>

<script setup lang="ts">
import { gameApi } from "/@/api/game";
import { useUserStore } from "/@/stores/modules/user";
import Common from "/@/utils/common";
import slide from "./slide.vue";
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

const goToGame = (gameinfo: any) => {
	console.log(gameinfo, 99999);
	const params = {
		userAccount: useUserStore().getUserInfo.userAccount,
		venueCode: gameinfo.venueCode,
		gameCode: gameinfo.gameCode,
		ip: "",
		currencyCode: useUserStore().getUserInfo.mainCurrency,
	};
	gameApi.loginGame(params).then((res) => {
		console.log(res);
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
	overflow: hidden;
	.hotGameItem {
		margin-right: 15px;
		position: relative;
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
