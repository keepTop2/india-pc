<template>
	<div class="mt_40 pr_10 pl_10 gamelist" v-if="gameList?.length">
		<div v-for="(item, index) in gameList" :key="index" class="gameListItem">
			<img v-lazy-load="item.iconFileUrl ? item.iconFileUrl : ''" alt="" />
			<div class="gameInfo Texta">
				<div class="fs_13">
					{{ item.name }}
				</div>
			</div>
			<div class="onHover">
				<div class="playBtn fs_15 Text_s" @click.self="Common.goToGame(item)">Play</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import hotGameIcon from "./image/hotGameIcon.png";
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
		type: Array<any>,
	},
});
</script>

<style scoped lang="scss">
.gamelist {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); /* 自动填充，最小宽度100px */
	grid-gap: 10px; /* 每个格子的间距 */
	width: 100%; /* 父容器的宽度 */

	.gameListItem {
		position: relative;
		width: 180px;
		img {
			width: 100%;
			height: 180px;
			border-top-left-radius: 12px;
			border-top-right-radius: 12px;
			object-fit: cover;
			pointer-events: none;
		}
		.onHover {
			display: none;
		}
		.gameInfo {
			height: 52px;
			width: 180px;
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
	.gameListItem:hover {
		.onHover {
			position: absolute;
			top: 0px;
			left: 0;
			width: 100%;
			height: 180px;
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
	.lastOneItem {
		flex: 1;
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
