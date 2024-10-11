<template>
	<div class="activityWrapper">
		<div class="activityHeader">
			{{ activityData.activityNameI18nCode || "次存活动" }}
			<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="../components/image/close_icon.svg" alt="" /></span>
		</div>
		<div class="activityMain">
			<div class="activityImg">
				<img v-lazy-load="activityData.headPicturePcI18nCode" alt="" />
			</div>
			<div class="activityContent" v-if="activityData.participationMode == 0">
				<div class="bonus_card">
					<div class="bonus_card_title">红利赠送</div>
					<div class="bonus_card_content">
						<div>
							<div class="fs_12">存款金额</div>
							<div class="amount fs_14">{{ activityData.depositAmount || 0 }} {{ activityData.depositCurrencyCode }}</div>
						</div>
						<div class="line"></div>
						<div>
							<div class="fs_12">需打流水</div>
							<div class="amount fs_14">{{ activityData.runningWater || 0 }} {{ activityData.runningWaterCurrencyCode }}</div>
						</div>
					</div>
					<div class="bonus_card_footer">
						可得彩金: <span class="Theme_text">{{ activityData.activityAmount || 0 }}{{ activityData.activityAmountCurrencyCode }}</span>
					</div>
					<!-- <div>
						<button class="common_btn" @click="getActivityReward">立即申请</button>
					</div> -->
					<div class="apply_btn">
						<div class="curp" :class="activityData.status == 10000 ? 'active' : ''" @click="apply">{{ activityData.status == 30047 ? "您已申请" : "立即申请" }}</div>
					</div>
				</div>
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
						<div class="cellValue">{{ Common.parseTime(activityData.activityStartTime) }}～{{ Common.parseTime(activityData.activityEndTime) }}</div>
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
		</div>
	</div>
	<CommonDialog v-model="showCommonDialog" title="温馨提示" :confirm="confirmDialog">
		{{ dialogInfo.message }}
		<template v-slot:footer v-if="dialogInfo.status == 30049"> 去存款 </template>
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
import showToast from "/@/hooks/useToast";
const activityStore = useActivityStore();
const router = useRouter();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const dialogInfo: any = ref({});
const showCommonDialog = ref(false);
const apply = async () => {
	await activityApi.getToActivity({ id: activityData.value.id }).then((res: any) => {
		if (res.code === 10000) {
			if (res.code.status !== 10000) {
				dialogInfo.value = res.data;
				showCommonDialog.value = true;
			} else {
				activityApi.getActivityReward({ id: activityData.value.id }).then((res: any) => {
					showToast(res.data.message);
					activityStore.updateCurrentActivityData();
				});
			}
		}
	});
};
const confirmDialog = () => {
	if (dialogInfo.status == 30049) {
		router.push("/user/deposit");
	}
	showCommonDialog.value = false;
};
</script>
