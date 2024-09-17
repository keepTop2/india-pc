<template>
	<div class="mt_40 pr_10 pl_10">
		<div class="cardHeader">
			<div>
				<span class="flex-center">
					<img src="./image/hotGameIcon.png" alt="" />
					<span class="Text_s fs_20">热门推荐</span>
				</span>
			</div>
			<div class="more Text1 fs_18 curp">更多</div>
		</div>
		<div class="hotGameList">
			<div v-for="(item, index) in hotGameList" :key="index" class="hotGameItem">
				<img :src="item.icon" alt="" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
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
	gap: 15px;
	overflow: hidden;
	.hotGameItem {
		img {
			width: 258px;
			height: 258px;
			border-radius: 12px;
			object-fit: cover;
			pointer-events: none;
		}
	}
}
</style>
