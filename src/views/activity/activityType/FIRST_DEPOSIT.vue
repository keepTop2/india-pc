<template>
	<activityWrapper :title="activityData.activityNameI18nCode">
		<div class="activityImg">
			<img v-lazy-load="activityData.headPicturePcI18nCode" alt="" />
		</div>
		<activityBonusCard :activityData="activityData" @apply="apply"></activityBonusCard>
		<activityContent :activityData="activityData"></activityContent>
		<activityRule :rule="activityData.activityRuleI18nCode"></activityRule>
	</activityWrapper>
	<CommonDialog v-model="showCommonDialog" title="温馨提示" :confirm="confirmDialog">
		{{ dialogInfo.message }}
		<template v-slot:footer v-if="dialogInfo.status == 30049"> 去存款 </template>
	</CommonDialog>
	<CommonDialog v-model="showNeedLogin" title="温馨提示" :confirm="confirmDialog" :nofooter="false">
		<div>您的账号暂未登录无法参与活动， 如已有账号请登录，如还未有账号 请前往注册</div>
	</CommonDialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { activityApi } from "/@/api/activity";
import { useRouter } from "vue-router";
import { useActivityStore } from "/@/stores/modules/activity";
import { computed } from "vue";
import Common from "/@/utils/common";
import CommonDialog from "../components/activityDialog.vue";
import { useModalStore } from "/@/stores/modules/modalStore";
import activityWrapper from "../components/activityWrapper.vue";
import activityBonusCard from "../components/activityBonusCard.vue";
import activityContent from "../components/activityContent.vue";
import activityRule from "../components/activityRule.vue";
import { useUserStore } from "/@/stores/modules/user";
const activityStore = useActivityStore();
const router = useRouter();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const dialogInfo: any = ref({});
const showNeedLogin = ref(false);
const showCommonDialog = ref(false);
const apply = async () => {
	if (!useUserStore().getLogin) {
		showNeedLogin.value = true;
		return;
	}
	await activityApi.getToActivity({ id: activityData.value.id }).then((res: any) => {
		if (String(res.data.status).slice(0, 2) !== "13" || res.data.status !== 1000) {
			dialogInfo.value = res.data;
			showCommonDialog.value = true;
		}
		// else {
		// 	activityApi.getActivityReward({ id: activityData.value.id }).then((res: any) => {
		// 		showToast(res.data.message);
		// 		activityStore.updateCurrentActivityData();
		// 	});
		// }
	});
};
const confirmDialog = () => {
	if (dialogInfo.value.status == 30049) {
		router.push("/recharge");
		useModalStore().closeModal();
	} else {
		showCommonDialog.value = false;
	}
};
</script>
