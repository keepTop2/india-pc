<template>
	<div class="activityWrapper">
		<div class="activityCenter">
			<div class="activityHeader">
				{{ activityData?.activityNameI18nCode || "幸运转盘" }}
				<span class="closeIcon curp" @click="useModalStore().closeModal()"><img src="../../components/image/close_icon.png" alt="" /></span>
			</div>
			<div class="activityMain">
				<div class="spinContainer">
					<div class="tabs">
						<div v-for="(item, index) in tabs" :key="index" :class="currentTab == item.value ? 'tab tab' + item.value + '_active' : 'tab'" @click="selectTab(item.value)">
							{{ item.name }}
						</div>
					</div>
					<Spin
						@end-spinning-callback="spinEnd"
						@startVerification="startVerification"
						:reward="reward"
						:spinList="currentTab == '1' ? activityData?.bronze : currentTab == '2' ? activityData?.silver : activityData?.gold"
						:balanceCount="activityData?.balanceCount"
						ref="SpinRef"
					/>
					<div class="vipLevel color_TB fw_600" :class="'vip' + currentTab">{{ activityData?.vipRankConfig?.[currentTab - 1]?.minVipGradeName }}级或以上</div>
				</div>
				<div class="p_20 remaining_times_bg">剩余抽奖次数： {{ activityData?.balanceCount || 0 }}</div>
				<div class="flex_space-between">
					<div class="bonus">
						<div>转盘奖金总计</div>
						<div class="fs_14 color_Theme">{{ activityData?.totalAmount }}</div>
					</div>
					<div class="record" @click="handleRecord">我的抽奖记录 <svg-icon name="common-arrow_right" size="16px"></svg-icon></div>
				</div>
				<div class="activityContent">
					<div class="activityContentHeader">
						<div class="flex-center">
							<img src="../image/activityContentHeaderLeft2.svg" alt="" />
							<span>活动规则</span>
							<img src="../image/activityContentHeaderRight2.svg" alt="" />
						</div>
					</div>
					<div class="activityContentCenter ruleCenter">
						<div class="ruleDetails">
							<div v-html="activityData?.activityRuleI18nCode"></div>
						</div>
					</div>
					<div class="activityContentFooter" />
				</div>
			</div>
		</div>

		<!-- 中奖记录 -->
		<CommonDialog v-model="showRecord">
			<div class="dialogCenter">
				<div class="dialogHeader">抽奖记录</div>
				<div class="dialogTable" v-if="recordList.length > 0">
					<LazyLoadList :loadMore="getRecordList" :finished="recordFinished" :loading="recordIsLoading">
						<div class="dialogTableBody">
							<div class="dialogTableHeader">
								<span>转盘</span>
								<span>奖品名称</span>
								<span>奖品价值</span>
								<span>中奖时间</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ dayjs(item.receiveTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
							</div>
						</div>
					</LazyLoadList>
				</div>
				<div v-else class="nodata"><noneData></noneData></div>
			</div>
			<div class="closeRecord" @click="showRecord = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>
		<!-- 中奖了 -->
		<CommonDialog v-model="showbetResult">
			<div class="betResult">
				<img :src="reward.prizePictureUrl" alt="" />
				<div class="Text_s fs_20 fw_600">恭喜您获得</div>
				<div class="amunt mt_40 mb_33">{{ useUserStore().getUserInfo.platCurrencySymbol }}{{ reward.prizeAmount }}</div>
				<div class="againBtn">
					<div class="bubble">剩余次数 {{ activityData?.balanceCount }}</div>
					<button class="common_btn active" @click="palyAgain">再抽一次：1</button>
				</div>
			</div>
			<div class="closeRecord" @click="showbetResult = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>

		<!-- 没中奖 -->
		<CommonDialog v-model="showLosserbetResult">
			<div class="losserbetResult pt_240">
				<div class="Text_s fs_20 tishi">没有中奖</div>
				<div class="mt_80 mb_80 color_Theme fs_20">谢谢惠顾</div>
				<div class="againBtn">
					<div class="bubble">剩余次数 {{ activityData?.balanceCount }}</div>
					<button class="common_btn active" @click="startVerification">再抽一次：1</button>
				</div>
			</div>
			<div class="closeRecord" @click="showLosserbetResult = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>

		<!-- 抽奖次数不足 -->
		<CommonDialog v-model="showNoMoreBet">
			<div class="losserbetResult pt_240">
				<div class="Text_s fs_20 tishi">温馨提示</div>
				<div class="mt_80 mb_80 Text1">您的抽奖次数不足</div>
				<div class="againBtn">
					<button class="common_btn active fs_16" @click="goToDeposit">去获取</button>
				</div>
			</div>
			<div class="closeRecord" @click="showNoMoreBet = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>

		<!-- 验证不通过 -->
		<activityDialog v-model="showVerificationDialog" title="温馨提示">
			<div v-html="VerificationInfo.message"></div>
		</activityDialog>
		<!-- 需要登录 -->
		<activityDialog v-model="showNeedLogin" title="温馨提示" :nofooter="false">
			<div>您的账号暂未登录无法参与活动，如已有账号请登录，如还未有账号请前往注册</div>
		</activityDialog>
	</div>
</template>

<script setup lang="ts">
import { activityApi } from "/@/api/activity";
import { useActivityStore } from "/@/stores/modules/activity";
import { computed } from "vue";
import Common from "/@/utils/common";
import activityDialog from "../../components/activityDialog.vue";
import { ref, onMounted } from "vue";
import Spin from "./spin.vue";
import { useModalStore } from "/@/stores/modules/modalStore";
import "../../components/common.scss";
import router from "/@/router";
import { useUserStore } from "/@/stores/modules/user";
import dayjs from "dayjs";
const activityStore = useActivityStore();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const showRecord = ref(false);
const showbetResult = ref(false);
const showNoMoreBet = ref(false);
const showLosserbetResult = ref(false);
const showNeedLogin = ref(false);
const recordFinished = ref(false);
const recordIsLoading = ref(false);
const SpinRef: any = ref(null);
const recordList: any = ref([]);
const showVerificationDialog = ref(false);
const VerificationInfo: any = ref({});
// 奖项列表
const spinList = ref();
// 获得的奖励
const reward: any = ref({});
// 当前选中的标签
const currentTab: any = ref(activityData.value.vipRankCode >= 3 ? 3 : activityData.value.vipRankCode ? activityData.value.vipRankCode : 1);
// 标签列表
const tabs = ref([
	{
		name: "青铜",
		value: "1",
	},
	{
		name: "白银",
		value: "2",
	},
	{
		name: "黄金",
		value: "3",
	},
]);

onMounted(() => {
	// showbetResult.value = true;
});

const selectTab = (tabKey: string) => {
	if (SpinRef.value?.spinning) return;
	currentTab.value = tabKey;
};

const startVerification = () => {
	if (!useUserStore().getLogin) {
		showNeedLogin.value = true;
	} else {
		activityApi.getToSpinActivity().then((res) => {
			if (String(res.data.status).slice(0, 2) == "13") {
				SpinRef.value?.handleStartSpin();
				spinStart();
			} else {
				VerificationInfo.value = res.data;
				showVerificationDialog.value = true;
			}
		});
	}
	// showVerificationDialog.value = true;
};
const delay = (ms: any) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const spinStart = () => {
	const startTime = Date.now();
	activityApi
		.getSpinprizeResult({
			id: activityData.value.id,
			vipRankCode: currentTab.value,
		})
		.then(async (res) => {
			if (res.code === Common.ResCode.SUCCESS) {
				// 最少旋转3秒
				reward.value = res.data;
				const elapsedTime = Date.now() - startTime;
				const remainingTime = 3000 - elapsedTime;
				if (remainingTime > 0) {
					await delay(remainingTime);
				}

				SpinRef.value?.endSpinning();
			} else if (res.code === 80019) {
				VerificationInfo.value = res;
				showNoMoreBet.value = true;
				SpinRef.value?.endSpinning();
			} else {
				VerificationInfo.value = res;
				showVerificationDialog.value = true;
				SpinRef.value?.endSpinning();
			}
		});
};

const spinEnd = () => {
	showbetResult.value = true;
	activityApi.getSpindetail().then((res) => {
		activityStore.setCurrentActivityData(res.data);
	});
};
const palyAgain = () => {
	showbetResult.value = false;
	showLosserbetResult.value = false;
	SpinRef.value?.handleStartSpin();
	spinStart();
};

const handleRecord = async () => {
	if (!useUserStore().getLogin) {
		showNeedLogin.value = true;
	} else {
		await getRecordList();
		showRecord.value = true;
	}
};

const getRecordList = () => {
	activityApi.querySpinWheelOrderRecord().then((res) => {
		if (res.code === 10000) {
			recordList.value = res.data.records || [];
		}
	});
};

const goToDeposit = () => {
	showNoMoreBet.value = false;
	useModalStore().closeModal();
	router.push("/recharge");
};
</script>
<style scoped lang="scss">
.activityWrapper {
	background: none;
	.activityCenter {
		background: url("../image/commonBg2.png") no-repeat;
		background-size: 100% 100%;
		width: 444px;
	}
	.activityContent {
		width: 444px;
	}
	.activityHeader {
		background: none;
		height: 80px;
		line-height: 80px;
		font-size: 20px;
		margin: 0 auto;
	}
	.remaining_times_bg {
		width: 404px;
		height: 58px;
		line-height: 26px;
		background: url("./images/remaining_times_bg.png") no-repeat;
		background-size: 100% 100%;
		margin: 20px;
		color: var(--Text-s);
	}
	.common_btn {
		background-size: 100% 100%;
		height: 45px;
	}

	.flex_space-between {
		width: 444px;
		padding: 0 20px;
		color: var(--Text-s);
		> div {
			flex: 1;
			width: 50%;
			height: 68px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
		}
		.bonus {
			background: url("./images/bonus_bg.png") no-repeat;
			background-size: 100% 100%;
			flex-direction: column;
		}
		.record {
			background: url("./images/record_bg.png") no-repeat;
			background-size: 100% 100%;
		}
	}

	.common_btn.active {
		background: url("./images/btn_active_bg.png") no-repeat;
		background-size: 100% 100%;
	}

	.spinContainer {
		width: 404px;
		background: url("./images/contentBg.png") no-repeat;
		background-size: 100% 100%;
		background-position: 0 20px;
		margin: 0 20px;
		padding-bottom: 16px;
		position: relative;
		.tabs {
			display: flex;
			justify-content: space-around;
			height: 50px;
			line-height: 50px;
			color: var(--Text-s);
			border-radius: 16px 16px 0px 0px;
			background: linear-gradient(90deg, #a0b9b9 0%, #536a6a 100%);
			.tab {
				flex: 1;
				text-align: center;
				cursor: pointer;
			}
		}
		.tab1_active {
			background: url("./images/tab_bg1.png");
			background-size: 100% 100%;
		}
		.tab2_active {
			background: url("./images/tab_bg2.png");
			background-size: 100% 100%;
		}
		.tab3_active {
			background: url("./images/tab_bg3.png");
			background-size: 100% 100%;
		}
		.vipLevel {
			position: absolute;
			right: 0;
			top: 70px;
			width: 144px;
			height: 32px;
			line-height: 32px;
			text-align: center;
			font-size: 14px;
			color: var(--Text-s);
		}
		.vip1 {
			background: url("./images/vipbg_1.png");
			background-size: 100% 100%;
		}
		.vip2 {
			background: url("./images/vipbg_2.png");
			background-size: 100% 100%;
		}
		.vip3 {
			background: url("./images/vipbg_3.png");
			background-size: 100% 100%;
		}
	}

	.dialogCenter {
		width: 444px;
		margin: 0 auto;
		height: 80vh;
		min-height: 500px;
		background: url("./images/record_dialog_bg.png") no-repeat;
		background-color: var(--Bg-1);
		background-size: 100% 100%;
		position: relative;
		padding-top: 20px;
		overflow: hidden;
		.nodata {
			margin-top: 150px;
		}
		.dialogHeader {
			width: 330px;
			height: 64px;
			margin: 0 auto;
			background: url("./images/record_dialog_header_bg.png") no-repeat;
			background-size: 100% 100%;
			text-align: center;
			line-height: 64px;
			font-size: 20px;
			color: var(--Text-a);
		}
		.dialogTableHeader {
			display: flex;
			justify-content: space-around;
		}
		.dialogTableBody {
			margin-top: 24px;
			overflow: auto;
			height: calc(80vh - 110px);
			> div {
				display: flex;
				height: 56px;
				justify-content: space-around;
				color: var(--Text-s);
				font-size: 14px;
				span {
					flex: 1;
					font-weight: 400;
					text-align: center;
					border-right: 1px solid var(--Line-2);
					display: flex;
					justify-content: center;
					align-items: center;
				}
				span:last-child {
					border-right: none;
				}
			}
			.dialogTableHeader {
				background: linear-gradient(180deg, #1c1a1a 0%, #312222 100%);
				font-size: 16px;
			}
			.dialogTableItem:nth-child(odd) {
				background: var(--Bg-3);
			}
			.dialogTableItem:nth-child(even) {
				background: var(--Bg-2);
			}
		}
		.dialogTableBody::-webkit-scrollbar {
			// width: 6px;
			display: none;
		}
		.dialogTableBody::-webkit-scrollbar-track {
			background-color: transparent;
		}
		.dialogTableBody::-webkit-scrollbar-thumb {
			background: var(--Icon-1);
			border-radius: 5px;
		}
	}
	.closeRecord {
		text-align: center;
		margin-top: 15px;
		cursor: pointer;
		img {
			height: 40px;
			width: 40px;
		}
	}
	.losserbetResult {
		background: url("./images/losser_result_bg.png") no-repeat;
		background-size: 100% 100%;
		width: 400px;
		height: 544px;
		padding-top: 180px;
		text-align: center;
		.tishi {
			width: 334px;
			height: 42px;
			border-radius: 53px;
			margin: 0 auto;
			line-height: 42px;
			border: 1px solid #e2e2e2;
			background: linear-gradient(90deg, rgba(79, 73, 73, 0.3) 0%, rgba(56, 52, 52, 0.2) 100%);
			backdrop-filter: blur(15px);
		}
		img {
			width: 135px;
			height: 135px;
		}
		.common_btn {
			width: 314px;
			background-size: 100% 100%;
		}
	}
	.betResult {
		background: url("./images/result_bg.png") no-repeat;
		background-size: 100% 100%;
		width: 400px;
		height: 544px;
		padding-top: 180px;
		text-align: center;
		.amunt {
			width: 278px;
			height: 42px;
			line-height: 42px;
			border-radius: 30px;
			background: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(11, 4, 4, 0.2) 100%);
			box-shadow: 0px -2.222px 1.481px 0px rgba(255, 92, 92, 0.25) inset, 0px 2.963px 2.963px 0px rgba(0, 0, 0, 0.25) inset;
			backdrop-filter: blur(7.407407283782959px);
			margin: 0 auto;
			color: var(--Theme);
			font-size: 24px;
			font-weight: 700;
		}
		img {
			width: 135px;
			height: 135px;
		}
		.common_btn {
			width: 314px;
			background-size: 100% 100%;
		}
	}
	.againBtn {
		position: relative;
		width: 314px;
		margin: 0 auto;
		.bubble {
			position: absolute;
			right: 0;
			top: -18px;
			width: 105px;
			height: 37px;
			background: url("./images/bubble.png") no-repeat;
			background-size: 100% 100%;
			color: var(--Text-a);
			line-height: 27.5px;
			font-size: 14px;
		}
		// .common_btn {
		// 	background: url("../image/btn_bg.png") no-repeat;
		// 	background-size: 100% 100%;
		// }
	}
}
.ruleDetails {
	:deep(img) {
		max-width: 100%;
	}
}
</style>
