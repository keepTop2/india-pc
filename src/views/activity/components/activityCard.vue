<template>
	<div class="cardList">
		<div v-for="(item, index) in activityList" :key="index" class="cardBox">
			<div>
				<img v-lazy-load="item.entrancePicturePcI18nCode" alt="" />
			</div>
			<div class="itemDetails">
				<div>
					<p class="fs_14 Text2" v-if="item.activityDeadline !== 1">{{ Common.parseTime(item.activityStartTime) }}～{{ Common.parseTime(item.activityEndTime) }}</p>
					<p class="fs_14 Text2" v-else>长期活动</p>
					<p class="fs_14">{{ item.activityNameI18nCode }}</p>
				</div>
				<div class="btn" @click="showDetails(item)">查看详情</div>
			</div>
		</div>
	</div>
	<activityDialog v-model="showCommonDialog" title="温馨提示" :confirm="confirmDialog" :nofooter="false">
		<div>您的账号暂未登录无法参与活动， 如已有账号请登录，如还未有账号 请前往注册</div>
	</activityDialog>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import { useActivityStore } from "/@/stores/modules/activity";
import { activityApi } from "/@/api/activity";
import { useModalStore } from "/@/stores/modules/modalStore";
import activityDialog from "./activityDialog.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "/@/stores/modules/user";

const modalStore = useModalStore();
const activityStore = useActivityStore();
const showCommonDialog = ref(false);
const confirmDialog = () => {};
const showDetails = async (item: any) => {
	// 红包雨
	if (item.activityTemplate == "RED_BAG_RAIN") {
		if (useUserStore().getLogin) {
			activityApi.getRedBagInfo().then((res) => {
				activityStore.setCurrentActivityData(res.data);
				modalStore.openModal(item.activityTemplate);
			});
		} else {
			showCommonDialog.value = true;
		}
		// 转盘
	} else if (item.activityTemplate == "SPIN_WHEEL") {
		if (useUserStore().getLogin) {
			activityApi.getSpindetail().then((res) => {
				activityStore.setCurrentActivityData(res.data);
				modalStore.openModal(item.activityTemplate);
			});
		} else {
			showCommonDialog.value = true;
		}
		// 每日竞赛
	} else if (item.activityTemplate == "DAILY_COMPETITION") {
		if (useUserStore().getLogin) {
			modalStore.openModal(item.activityTemplate);
		} else {
			showCommonDialog.value = true;
		}
		// 其他活动
	} else {
		await getConfigDetail(item);
		modalStore.openModal(item.activityTemplate);
	}
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
