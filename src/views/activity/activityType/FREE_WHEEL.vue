<template>
	<activityWrapper :title="activityData.activityNameI18nCode">
		<div class="activityImg">
			<img v-lazy-load="activityData.headPicturePcI18nCode" alt="" />
		</div>
		<activityContent :activityData="activityData"></activityContent>
		<activityRule :rule="activityData.activityRuleI18nCode"></activityRule>
		<div class="apply_btn">
			<div class="curp" :class="activityData.status == 10000 ? 'active' : ''" @click="apply">
				{{ activityData.status == 10000 ? $t(`activity['立即申请']`) : $t(`activity['您已申请']`) }}
			</div>
		</div>
	</activityWrapper>

	<CommonDialog v-model="showCommonDialog" :title="$t(`activity['温馨提示']`)" :confirm="confirmDialog">
		{{ dialogInfo.message }}
	</CommonDialog>
	<CommonDialog v-model="showNeedLogin" :title="$t(`activity['温馨提示']`)" :confirm="confirmDialog" :nofooter="false">
		<div>{{ $t(`activity['您的账号暂未登录无法参与活动， 如已有账号请登录，如还未有账号 请前往注册']`) }}</div>
	</CommonDialog>
</template>

<script setup lang="ts">
import "../components/common.scss";
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
import "../components/common.scss";
import showToast from "/@/hooks/useToast";
const activityStore = useActivityStore();
const router = useRouter();
const dialogInfo: any = ref({});
const showNeedLogin = ref(false);
const activityData: any = computed(() => activityStore.getCurrentActivityData);

const showCommonDialog = ref(false);
const apply = () => {
	activityApi.getToActivity({ id: activityData.value.id }).then((res: any) => {
		activityStore.updateCurrentActivityData;
		dialogInfo.value = res.data;
		showCommonDialog.value = true;
	});
};
const confirmDialog = () => {
	showCommonDialog.value = false;
};
</script>
<style scoped lang="scss">
.ruleDetails {
	:deep(img) {
		max-width: 100%;
	}
}
</style>
