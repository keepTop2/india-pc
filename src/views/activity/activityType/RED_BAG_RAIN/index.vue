<template>
	<activityWrapper :title="activityData.activityNameI18nCode">
		<div class="activityImg">
			<img v-lazy-load="activityData?.headPicturePcI18nCodeFileUrl" alt="" />
		</div>
		<div class="activityContent">
			<div class="bonus_card">
				<div class="bonus_card_title">{{ $t(`activity['红包雨']`) }}</div>
				<div class="mt_20 mb_20">
					{{ activityData?.clientStatus == 1 ? $t(`activity['距离本场红包雨结束']`) : $t(`activity['距离下一场红包雨还有']`) }}
				</div>
				<div class="countdown mb_20">
					<span>{{ Common.convertMilliseconds(countdown * 1000) }}</span>
				</div>
				<div class="apply_btn">
					<div class="curp" :class="activityData?.clientStatus == 1 ? 'active' : ''" @click="getActivityReward">{{ $t(`activity['抢']`) }}</div>
				</div>
			</div>
		</div>

		<div class="activityContent">
			<div class="activityContentHeader" :style="{ background: `url(${Common.getThemeImgPath('activityContentHeader.png')}) no-repeat`, backgroundSize: '100% 100%' }">
				<div class="flex-center">
					<img :src="Common.getThemeImgPath('activityContentHeaderLeft.svg')" alt="" />
					<span>{{ $t(`activity['红包雨场次']`) }}</span>
					<img :src="Common.getThemeImgPath('activityContentHeaderRight.svg')" alt="" />
				</div>
			</div>
			<div class="activityContentCenter" :style="{ background: `url(${Common.getThemeImgPath('activityContentCenter.png')}) no-repeat`, backgroundSize: '100% 100%' }">
				<slide class="sessions">
					<div v-for="(item, index) in activityData?.sessionInfoList" class="session" :key="index">
						<div>{{ Common.parseHm(item.startTime) }}</div>
						<div class="sideBox">
							<img :src="sessionCricle" alt="" v-if="item.status == 0" />
							<img :src="sessionCricle1" alt="" v-if="item.status == 1" />
							<img :src="sessionCricle2" alt="" v-if="item.status == 2" />
						</div>
						<div :class="'status' + item.status">{{ status[item.status] }}</div>
						<span class="side" v-if="index !== activityData.sessionInfoList.length - 1" :class="'type' + item.status"></span>
					</div>
				</slide>
			</div>
			<div class="activityContentFooter" :style="{ background: `url(${Common.getThemeImgPath('activityContentFooter.png')}) no-repeat`, backgroundSize: '100% 100%' }" />
		</div>
		<div class="activityContent" v-if="activityData?.winnerList.length > 0">
			<div class="activityContentHeader">
				<div class="flex-center">
					<img src="../image/activityContentHeaderLeft.svg" alt="" />
					<span>{{ $t(`activity['中奖名单']`) }}</span>
					<img src="../image/activityContentHeaderRight.svg" alt="" />
				</div>
			</div>
			<div class="activityContentCenter">
				<div class="winnerListTable">
					<div class="winnerListHeader">
						<div>{{ $t(`activity['会员账号']`) }}</div>
						<div>{{ $t(`activity['获得红包']`) }}</div>
						<div>{{ $t(`activity['时间']`) }}</div>
					</div>
					<div class="winnerListBody" v-for="(item, index) in activityData.winnerList" :key="index">
						<div>{{ item.userAccount }}</div>
						<div>{{ item.redBagAmount }} {{ useUserStore().getUserInfo.platCurrencyName }}</div>
						<div>{{ Common.parseTime(item.hitTime) }}</div>
					</div>
				</div>
			</div>
			<div class="activityContentFooter" />
		</div>
		<activityRule :rule="activityData?.ruleDesc"></activityRule>
	</activityWrapper>

	<!-- 结算弹窗 -->
	<RED_BAG_RAIN_Dialog v-model="showDialog" :title="$t(`activity['温馨提示']`)" :confirm="confirmDialog" class="redBagRainResult">
		<div class="Text3">{{ dialogInfo.message }}</div>
	</RED_BAG_RAIN_Dialog>
</template>

<script setup lang="ts">
import "../../components/common.scss";
import { onMounted, ref, watch } from "vue";
import { activityApi } from "/@/api/activity";
import { useRouter } from "vue-router";
import { useActivityStore } from "/@/stores/modules/activity";
import RED_BAG_RAIN_Dialog from "./RED_BAG_RAIN_Dialog/index.vue";
import { computed } from "vue";
import Common from "/@/utils/common";
import { redbagRainSingleton } from "/@/hooks/useRedbagRain"; // 引入自定义 hook
import { useModalStore } from "/@/stores/modules/modalStore";
import { useCountdown } from "/@/hooks/countdown";
import router from "/@/router";
import showToast from "/@/hooks/useToast";
import sessionCricle from "./image/sessionCricle.png";
import sessionCricle1 from "./image/sessionCricle1.png";
import sessionCricle2 from "./image/sessionCricle2.png";
import activityWrapper from "../../components/activityWrapper.vue";
import activityBonusCard from "../../components/activityBonusCard.vue";
import activityContent from "../../components/activityContent.vue";
import activityRule from "../../components/activityRule.vue";
import { useUserStore } from "/@/stores/modules/user";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const { countdown, startCountdown, stopCountdown } = useCountdown();
const activityStore = useActivityStore();
const showDialog = ref(false);
const dialogInfo: any = ref({});
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const confirmDialog = () => {
	showDialog.value = false;
};
const status: any = {
	0: $.t(`activity['未开始']`),
	1: $.t(`activity['进行中']`),
	2: $.t(`activity['已结束']`),
};
onMounted(() => {
	initCountown();
});
watch(
	() => countdown.value,
	() => {
		if (countdown.value == 0) {
			stopCountdown();
			getRedBagInfo();
		}
	}
);
const getActivityReward = async () => {
	if (activityData.value?.clientStatus !== 1) return;
	await activityApi.redBagParticipate({ redbagSessionId: activityData.value.redbagSessionId }).then((res) => {
		if (res.code === 10000) {
			if (String(res.data.status).slice(0, 2) == "13" || res.data.status == 10000) {
				redbagRainSingleton.showRedbagRain();
			} else {
				dialogInfo.value = res.data;
				showDialog.value = true;
			}
		}
	});
};

const getRedBagInfo = async () => {
	stopCountdown();
	await activityApi.getRedBagInfo().then((res: any) => {
		if (res.code === 10000) {
			activityStore.setCurrentActivityData(res.data);
			initCountown();
		} else {
			showToast(res.message);
		}
	});
};
const initCountown = () => {
	if (activityData.value.clientStatus === 1) {
		// 进行中倒计时
		startCountdown(activityData.value.advanceTime);
		// 判断活动已活动已全部结束
	} else if (activityData.value.clientStatus === 2) {
		//  获取明天第一场的时间
		const time = activityData.value.sessionInfoList[0].startTime + 1000 * 60 * 60 * 24 - new Date().getTime();
		startCountdown(Math.floor(time / 1000));
	} else if (activityData.value.clientStatus === 0) {
		//  获取下一场比赛的时间
		const time = activityData.value.sessionInfoList.find((item: any) => item.redbagSessionId == activityData.value.redbagSessionId).startTime - new Date().getTime();
		startCountdown(Math.floor(time / 1000));
	}
};
</script>
<style scoped lang="scss">
.activityWrapper {
	// background: url("../image/commonBg.png") no-repeat;
	// background-size: 100% auto;
	// overflow: hidden;
	// .activityHeader {
	// 	background: url("../image/header_bg.svg") no-repeat;
	// 	height: 57px;
	// 	width: 580px;
	// 	margin: 0 auto;
	// 	margin-top: 18px;
	// 	text-align: center;
	// 	line-height: 42px;
	// 	font-size: 20px;
	// 	font-weight: 600;
	// 	color: var(--Text-a);
	// }

	.sessions {
		display: flex;
		justify-content: center;
		font-size: 14px;
		.session {
			min-width: 60px;
			text-align: center;
			position: relative;
			.sideBox {
				height: 24px;
				margin: 5px 0;
				img {
					height: 16px;
					pointer-events: none;
				}
			}
			.side {
				display: inline-block;
				width: 30px;
				height: 2px;
				background-color: var(--Line-2);
				position: absolute;
				left: calc(50% + 15px);
				top: 50%;
				transform: translateY(-50%);
			}
			.type2 {
				background-color: var(--success);
			}
			.status2 {
				color: var(--success);
			}
			.status1 {
				color: var(--F-2);
			}
		}
	}
	.winnerListTable {
		border: 2px solid rgba(255, 40, 75, 0.4);
		border-radius: 12px;
		.winnerListHeader,
		.winnerListBody {
			width: 100%;
			display: flex;
			height: 40px;
			justify-content: center;
			border-bottom: 2px solid rgba(255, 40, 75, 0.4);
			> div {
				line-height: 40px;
				text-align: center;
			}
			> div:first-child {
				width: 25%;
				border-right: 2px solid rgba(255, 40, 75, 0.4);
			}
			> div:nth-child(2) {
				width: 25%;
				border-right: 2px solid rgba(255, 40, 75, 0.4);
			}
			> div:nth-child(3) {
				width: 50%;
			}
		}
		.winnerListBody:last-child {
			border-bottom: none;
		}
		.winnerListHeader {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			background: linear-gradient(180deg, rgba(255, 40, 75, 0.7) 0%, rgba(255, 40, 75, 0.4) 100%);
		}
	}
	.bonus_card {
		text-align: center;
		color: var(--Theme);
		font-weight: 500;
		.countdown {
			width: 274px;
			height: 56px;
			margin: 0 auto;
			line-height: 56px;
			background: url("./image/countdownBg.png") no-repeat;
			background-size: 100% 100%;
			font-size: 20px;
			font-weight: 600;
		}
	}
}
.ruleDetails {
	:deep(img) {
		max-width: 100%;
	}
}
</style>
