<template>
	<div class="activityWrapper">
		<div class="activityHeader">
			{{ activityData.activityNameI18nCode || "指定日期存款" }}
			<span class="closeIcon curp" @click="useModalStore().closeModal()"><img src="../components/image/close_icon.png" alt="" /></span>
		</div>
		<div class="activityMain">
			<div class="activityImg">
				<img v-lazy-load="activityData.headPicturePcI18nCode" alt="" />
			</div>
			<div class="activityContent">
				<div class="activityContentHeader">
					<div class="flex-center">
						<img src="./image/activityContentHeaderLeft.svg" alt="" />
						<span>活动内容</span>
						<img src="./image/activityContentHeaderRight.svg" alt="" />
					</div>
				</div>
				<div class="activityContentCenter">
					<div class="activityContentImg">
						<img src="./image/activityContentImg.png" alt="" />
					</div>
					<div class="contentCell">
						<div class="cellLabel">活动对象</div>
						<div class="cellValue">{{ activityData.userTypeText }}</div>
					</div>
					<div class="contentCell">
						<div class="cellLabel">活动时间</div>
						<div class="cellValue" v-if="activityData.activityDeadline !== 1">
							{{ Common.parseTime(activityData.activityStartTime) }}～{{ Common.parseTime(activityData.activityEndTime) }}
						</div>
						<div class="cellValue" v-else>长期活动</div>
					</div>
					<div class="contentCell">
						<div class="cellLabel">活动描述</div>
						<div class="cellValue">
							{{ activityData.activityDescI18nCode }}
						</div>
					</div>
				</div>
				<div class="activityContentFooter" />
			</div>
			<div class="activityContent">
				<div class="activityContentHeader">
					<div class="flex-center">
						<img src="./image/activityContentHeaderLeft.svg" alt="" />
						<span>活动规则</span>
						<img src="./image/activityContentHeaderRight.svg" alt="" />
					</div>
				</div>
				<div class="activityContentCenter">
					<div class="ruleDetails">
						<div v-html="activityData.activityRuleI18nCode"></div>
					</div>
				</div>
				<div class="activityContentFooter" />
			</div>
			<div class="apply_btn" v-if="activityData.participationMode == 0">
				<div class="curp" :class="activityData.status == 10000 ? 'active' : ''" @click="apply">{{ activityData.status == 10000 ? "立即申请" : "您已申请" }}</div>
			</div>
		</div>
	</div>
	<CommonDialog v-model="showCommonDialog" title="温馨提示" :confirm="confirmDialog">
		{{ dialogInfo.message }}
	</CommonDialog>
	<CommonDialog v-model="showNeedLogin" title="温馨提示" :confirm="confirmDialog" :nofooter="false">
		<div>您的账号暂未登录无法参与活动， 如已有账号请登录，如还未有账号 请前往注册</div>
	</CommonDialog>
</template>

<script setup lang="ts">
import "../components/common.scss";
import { onMounted, ref } from "vue";
import { activityApi } from "/@/api/activity";
import { useRouter } from "vue-router";
import { useActivityStore } from "/@/stores/modules/activity";
import { useModalStore } from "/@/stores/modules/modalStore";
import { computed } from "vue";
import Common from "/@/utils/common";
import showToast from "/@/hooks/useToast";
import CommonDialog from "../components/activityDialog.vue";
const activityStore = useActivityStore();
const router = useRouter();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const dialogInfo: any = ref({});
const showCommonDialog = ref(false);
const showNeedLogin = ref(false);
const apply = () => {
	activityApi.getToActivity({ id: activityData.value.id }).then((res: any) => {
		if (res.code === 10007) {
			showNeedLogin.value = true;
			return;
		}
		if (res.code.status !== 10000) {
			dialogInfo.value = res.data;
			showCommonDialog.value = true;
		} else {
			showToast(res.data.message);
			activityStore.updateCurrentActivityData;
		}
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
