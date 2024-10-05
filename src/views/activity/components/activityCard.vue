<template>
	<div class="cardList">
		<div v-for="(item, index) in activityList" :key="index" class="cardBox">
			<div>
				<img v-lazy-load="item.entrancePicturePcI18nCode" alt="" />
			</div>
			<div class="itemDetails">
				<div>
					<p class="fs_14 Text2">截止时间：{{ Common.parseTime(item.activityEndTime) }}</p>
					<p class="fs_14">{{ item.activityNameI18nCode }}</p>
				</div>
				<div class="btn" @click="showDetails(item)">查看详情</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import { useActivityStore } from "/@/stores/modules/activity";
import { activityApi } from "/@/api/activity";
import { useModalStore } from "/@/stores/modules/modalStore";

import { onMounted, ref } from "vue";

const modalStore = useModalStore();
const activityStore = useActivityStore();
const showDetails = async (item: any) => {
	await getConfigDetail(item);
	modalStore.openModal(item.activityTemplate);
};
defineProps({
	activityList: {
		type: Object,
	},
});
onMounted(() => {
	// modalStore.openModal("LOSS_IN_SPORTS");
});
const getConfigDetail = async (item: any) => {
	const params = {
		activityTemplate: item.activityTemplate,
		id: item.id,
	};
	await activityApi.getConfigDetail(params).then((res) => {
		activityStore.setCurrentActivityData({ ...item, ...res.data });
	});
};
</script>

<style scoped lang="scss">
.cardList {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(430px, 1fr)); /* 自动填充，最小宽度100px */
	grid-gap: 15px; /* 每个格子的间距 */
	width: 100%; /* 父容器的宽度 */
	padding: 0 10px;
	.btn {
		border-radius: 4px;
		padding: 8px 22px;
		color: var(--Text_s);
		font-weight: 400;
		cursor: pointer;
		background: linear-gradient(0deg, rgba(255, 40, 75, 0.6) 0%, rgba(255, 40, 75, 0.1) 100%);
	}
}
.cardBox {
	background: var(--Bg1);
	border-radius: 12px;
	color: var(--Text1);
	img {
		width: 100%;
		height: 188px;
		border-radius: 4px;
		object-fit: cover;
	}
	.itemDetails {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 70px;
		padding: 0 14px;
	}
}
</style>
