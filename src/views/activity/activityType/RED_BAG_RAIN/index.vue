<template>
	<div class="activityWrapper">
		<div class="activityHeader">
			{{ activityData.activityNameI18nCode || "红包雨" }}
			<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="../../components/image/close_icon.png" alt="" /></span>
		</div>

		<div class="activityMain">
			<div class="activityImg">
				<img v-lazy-load="activityData.headPicturePcI18nCode" alt="" />
			</div>
			<div class="activityContent">
				<div class="bonus_card">
					<div class="bonus_card_title">红包雨</div>
					<div class="mt_20 mb_20">
						{{ activityData.clientStatus == 1 ? "距离本场红包雨结束" : "距离下一场红包雨还有" }}
					</div>
					<div class="countdown mb_20">
						<span>{{ Common.convertMilliseconds(countdown * 1000) }}</span>
					</div>
					<div class="apply_btn">
						<div class="curp" :class="activityData.clientStatus == 1 ? 'active' : ''" @click="getActivityReward">抢</div>
					</div>
				</div>
			</div>

			<div class="activityContent">
				<div class="activityContentHeader">
					<div class="flex-center">
						<img src="../image/activityContentHeaderLeft.svg" alt="" />
						<span>红包雨场次</span>
						<img src="../image/activityContentHeaderRight.svg" alt="" />
					</div>
				</div>
				<div class="activityContentCenter">
					<slide class="sessions">
						<div v-for="(item, index) in activityData.sessionInfoList" class="session" :key="index">
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
				<div class="activityContentFooter" />
			</div>
			<div class="activityContent" v-if="activityData?.winnerList.length > 1">
				<div class="activityContentHeader">
					<div class="flex-center">
						<img src="../image/activityContentHeaderLeft.svg" alt="" />
						<span>中奖名单</span>
						<img src="../image/activityContentHeaderRight.svg" alt="" />
					</div>
				</div>
				<div class="activityContentCenter">
					<div class="winnerListTable">
						<div class="winnerListHeader">
							<div>会员账号</div>
							<div>获得红包</div>
							<div>时间</div>
						</div>
						<div class="winnerListBody" v-for="(item, index) in activityData.winnerList" :key="index">
							<div>{{ item.userId }}</div>
							<div>{{ item.redBagAmount }}</div>
							<div>{{ item.hitTime }}</div>
						</div>
					</div>
				</div>
				<div class="activityContentFooter" />
			</div>
			<div class="activityContent">
				<div class="activityContentHeader">
					<div class="flex-center">
						<img src="../image/activityContentHeaderLeft.svg" alt="" />
						<span>活动规则</span>
						<img src="../image/activityContentHeaderRight.svg" alt="" />
					</div>
				</div>
				<div class="activityContentCenter ruleCenter">
					<div class="ruleDetails">
						<div v-html="activityData.ruleDesc"></div>
					</div>
				</div>
				<div class="activityContentFooter" />
			</div>
		</div>

		<!-- 结算弹窗 -->
		<RED_BAG_RAIN_Dialog v-model="showDialog" title="温馨提示" :confirm="confirmDialog" class="redBagRainResult">
			<div class="Text3">{{ dialogInfo.message }}</div>
			<template v-slot:footer v-if="[30045, 30053].includes(dialogInfo.status)"> 去绑定 </template>
		</RED_BAG_RAIN_Dialog>
	</div>
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
const { countdown, startCountdown, stopCountdown } = useCountdown();
const activityStore = useActivityStore();
const showDialog = ref(false);
const dialogInfo: any = ref({});
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const confirmDialog = () => {
	showDialog.value = false;
	if ([30045, 30053].includes(dialogInfo.value.status)) {
		router.push("/user/security_center");
	}
};
const status: any = {
	0: "未开始",
	1: "进行中",
	2: "已结束",
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
	if (activityData.value.clientStatus !== 1) return;
	await activityApi.redBagParticipate({ redbagSessionId: activityData.value.redbagSessionId }).then((res) => {
		if (res.code === 10000) {
			if (res.data.status === 10000) {
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
	// 	color: var(--Text_a);
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
				background-color: var(--Line_2);
				position: absolute;
				left: calc(50% + 15px);
				top: 50%;
				transform: translateY(-50%);
			}
			.type2 {
				background-color: var(--Theme);
			}
			.status2 {
				color: var(--Theme);
			}
			.status1 {
				color: var(--F1);
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
</style>
