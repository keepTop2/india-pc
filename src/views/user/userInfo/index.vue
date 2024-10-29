<template>
	<div>
		<div class="wrapper" v-show="showMedal == 0">
			<div class="flex_space-between Text_s">
				<span class="fs_18">用户信息</span>
				<svg-icon name="close" size="30px" class="curp" @click="useModalStore().closeModal()"></svg-icon>
			</div>
			<div class="userinfo flex-center">
				<div>
					<img src="/@/assets/common/userIcon.png" alt="" />
				</div>
				<div class="Text_s mt_8">
					{{ useUserStore().getUserInfo.userAccount }}
				</div>
				<div class="userId fs_12 Text1 curp" @click="Common.copy(useUserStore().getUserInfo.userId)">
					ID: {{ useUserStore().getUserInfo.userId }}
					<svg-icon name="copy" size="12px" />
				</div>
			</div>
			<VipCard :vipInfo="vipInfo" class="mt_12"></VipCard>
			<medalCard :medalList="medalList" class="mt_12" v-model="showMedal"></medalCard>
			<walletCard class="mt_12 mb_82"></walletCard>
		</div>
		<medalPage :medalList="medalList" v-model="showMedal" v-if="showMedal == 1" @setCurrentMedal="setCurrentMedal" />
		<medalDetailsPage :medalList="medalList" v-model="showMedal" v-else-if="showMedal == 2" :currentMedal="currentMedal" />
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "/@/stores/modules/user";
import VipCard from "./compoents/vipCard.vue";
import medalCard from "./compoents/medalCard.vue";
import walletCard from "./compoents/walletCard.vue";
import medalPage from "../medal/index.vue";
import medalDetailsPage from "../medal/medalDetails.vue";
import { onMounted, ref } from "vue";
import { vipApi } from "/@/api/vip";
import { MedalApi } from "/@/api/medal";
import { useModalStore } from "/@/stores/modules/modalStore";
import Common from "/@/utils/common";
const vipInfo: any = ref({});
const medalList = ref([]);
const loading = ref(false);
const showMedal = ref(0);
const currentMedal = ref({});
const setCurrentMedal = (item) => {
	console.log(item);

	currentMedal.value = item;
};
onMounted(() => {
	getUserVipInfo();
	gettopNList();
});
const getUserVipInfo = () => {
	loading.value = true;
	vipApi
		.getUserVipInfo()
		.then((res) => {
			vipInfo.value = res.data;
		})
		.finally(() => {
			loading.value = false;
		});
};
const gettopNList = () => {
	MedalApi.topNList().then((res) => {
		console.log(res);
		medalList.value = res.data.userCenterMedalDetailRespVoList;
	});
};
</script>

<style scoped lang="scss">
.wrapper {
	width: 480px;
	padding: 24px;
	max-height: 720px;

	border-radius: 12px;
	background: url("./image/bg.png") no-repeat;
	background-size: 100% auto;
	.userinfo {
		flex-direction: column;
		gap: 0;
		.userId {
			background: var(--Bg3);
			padding: 2px 10px;
			border-radius: 50px;
			display: flex;
			align-items: center;
			gap: 3px;
			height: 22px;
		}
	}
}
</style>
