<template>
	<div class="activityWrapper">
		<div class="activityHeader">
			{{ "任务" }}
			<span class="closeIcon curp" @click="useModalStore().closeModal"><img src="../../components/image/close_icon.png" alt="" /></span>
		</div>
		<div class="activityMain">
			<div class="activityImg pt_20 pb_10">
				<img v-lazy-load="mainImage" alt="" />
			</div>
			<div class="Content">
				<div class="rewardsBg">
					<div class="mb_11 Text_s">累计奖励</div>
					<div class="color_f1">{{ taskData?.platCurrencySymbol }} {{ taskData?.totalAmount }}</div>
				</div>
				<div class="tabs">
					<div class="tab" v-for="item in tasktype" @click="changeTab(item.value)" :class="item.value == currentTab ? 'active' : ''">
						{{ item.label }}
					</div>
				</div>
				<div class="taskList">
					<div v-if="currentTab == 0">
						<div v-for="item in taskData?.dailyTask" class="card">
							<div>
								<img v-lazy-load="item.taskPictureI18nCode" alt="" />
							</div>
							<div>
								<div class="fs_14 Text_s fw_500">{{ item.taskNameI18nCode }}</div>
								<div class="progress">
									<div class="value" :style="{ width: calculatePercentage(item.achieveAmount, item.minBetAmount) + '%' }"></div>
								</div>
								<div class="fs_12 Text_s bottom">
									<span
										>奖励：<span class="color_f1"> {{ item.platCurrencySymbol }} {{ item.rewardAmount }}</span></span
									>
									<span
										><span class="color_Theme">{{ item.achieveAmount || 0 }}</span
										>/{{ item.minBetAmount }}</span
									>
								</div>
							</div>
							<div>
								<div :class="'btnType btnType' + item.taskStatus" @click="HandleBtn(item)">{{ taskStatus[item.taskStatus] }}</div>
							</div>
							<div class="help_icon" @click="openDialog(item)">
								<img src="./image/help_icon.png" />
							</div>
						</div>
					</div>
					<div v-if="currentTab == 1">
						<div v-for="item in taskData?.weeklyTask" class="card">
							<div>
								<img v-lazy-load="item.taskPictureI18nCode" alt="" />
							</div>
							<div>
								<div class="fs_14 Text_s fw_500">{{ item.taskNameI18nCode }}</div>
								<div class="progress">
									<div class="value" :style="{ width: calculatePercentage(item.achieveAmount, item.minBetAmount) + '%' }"></div>
								</div>
								<div class="fs_12 Text_s bottom">
									<span
										>奖励：<span class="color_f1"> {{ item.platCurrencySymbol }} {{ item.rewardAmount }}</span></span
									>
									<span
										><span class="color_Theme">{{ item.achieveAmount || 0 }}</span
										>/{{ item.minBetAmount }}</span
									>
								</div>
							</div>
							<div>
								<div :class="'btnType btnType' + item.taskStatus" @click="HandleBtn(item)">{{ taskStatus[item.taskStatus] }}</div>
							</div>
							<div class="help_icon" @click="openDialog(item)">
								<img src="./image/help_icon.png" />
							</div>
						</div>
					</div>
					<div v-if="currentTab == 2">
						<div class="daojishiBg fs_14 mt_0 mb_14">
							<span class="Text_s">剩余时间：</span><span class="color_Theme">{{ Common.convertMilliseconds(countdown * 1000) }}</span>
						</div>
						<div v-for="item in taskData?.noviceTask" class="card" :class="item.subTaskType">
							<div>
								<img v-lazy-load="item.taskPictureI18nCode" alt="" />
							</div>

							<div>
								<div class="fs_14 Text_s fw_500">{{ item.taskNameI18nCode }}</div>
								<!-- <div class="fs_18 color_TB htmlDesc" v-html="item.taskDescI18nCode"></div> -->
								<div class="fs_12 Text_s ellipsis pr_5" v-html="item.taskDescriptionI18nCode"></div>
								<div class="fs_12 Text_s bottom">
									<span
										>奖励：<span class="color_f1"> {{ item.platCurrencySymbol }} {{ item.rewardAmount }}</span></span
									>
								</div>
							</div>
							<div>
								<div :class="'btnType btnType' + item.taskStatus" @click="HandleBtn(item)">{{ taskStatus[item.taskStatus] }}</div>
							</div>
							<div class="help_icon" @click="openDialog(item)">
								<img src="./image/help_icon.png" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<activityDialog v-model="showDialog" title="温馨提示" :closeIcon="false" type="task" :confirm="confirmDialog">
		<div>恭喜您获得</div>
		<div class="result">{{ dialogInfo.currencyName }} {{ dialogInfo.rewardAmount }}</div>
		<template v-slot:footer>关闭 </template>
	</activityDialog>
	<CommonDialog v-model="showRule">
		<div class="Dialog">
			<div class="title">
				<span>任务说明</span>
				<span @click="showRule = false"><img src="../../components/image/close_icon.png" alt="" /></span>
			</div>
			<div class="content">
				<div v-html="rule"></div>
			</div>
		</div>
	</CommonDialog>
</template>

<script setup lang="ts">
import "../../components/common.scss";
import { onMounted, ref, watch } from "vue";
import { activityApi } from "/@/api/activity";
import { useRouter } from "vue-router";
import { useModalStore } from "/@/stores/modules/modalStore";
import Common from "/@/utils/common";
import activityDialog from "../../components/activityDialog.vue";
const { countdown, startCountdown, stopCountdown } = useCountdown();
// import CommonDialog from "../../components/activityDialog.vue";
import mainImage from "./image/image.png";
import { useCountdown } from "/@/hooks/countdown";
import { useUserStore } from "/@/stores/modules/user";
const modalStore = useModalStore();
const tasktype = ref([
	{
		label: "每日任务",
		value: 0,
	},
	{
		label: "每周任务",
		value: 1,
	},
]);
const taskStatus: any = {
	3: "去完成",
	0: "去领取",
	1: "已领取",
	2: "已过期",
};
const router = useRouter();
const taskData: any = ref({});
const dialogInfo: any = ref({});
const showDialog = ref(false);
const showRule = ref(false);
const currentTab = ref(0);
const rule = ref("");
onMounted(() => {
	getTaskDetail();
});

watch(
	() => countdown.value,
	() => {
		if (countdown.value == 0) {
			getTaskDetail();
		}
	}
);
const calculatePercentage = (part: any, whole: any) => {
	return (part / whole) * 100 || 0;
};
const openDialog = (item: any) => {
	showRule.value = true;
	rule.value = item.taskDescI18nCode;
};
const getTaskDetail = () => {
	activityApi.getTaskDetail().then((res) => {
		taskData.value = res.data;
		if (taskData.value.noviceTask) {
			startCountdown(taskData.value?.noviceTask[0].expireTime);
			tasktype.value = [
				{
					label: "每日任务",
					value: 0,
				},
				{
					label: "每周任务",
					value: 1,
				},
				{
					label: "新手任务",
					value: 2,
				},
			];
		}
	});
};
const changeTab = (value: number) => {
	currentTab.value = value;
};

const HandleBtn = (item: any) => {
	if (item.subTaskType === "phone" && !useUserStore().getUserInfo.phone) {
		return modalStore.openModal("setPhone");
	} else if (item.subTaskType === "email" && !useUserStore().getUserInfo.email) {
		return modalStore.openModal("setEmail");
	}
	if (item.taskStatus == 0) {
		useModalStore().closeModal();
		router.push("/welfareCenter");
	} else if (item.taskStatus == 3) {
		useModalStore().closeModal();
		router.push("/");
	}
};

const confirmDialog = () => {
	showDialog.value = false;
};
</script>
<style scoped lang="scss">
.activityMain {
	background: linear-gradient(180deg, rgba(239, 139, 73, 0.3) -1.74%, rgba(27, 27, 27, 0) 101.62%);
}
.activityImg {
	img {
		height: 384px;
	}
}

.rewardsBg {
	height: 104px;
	background: url("./image/rewardsBg.png") no-repeat;
	background-size: 100% 100%;
	padding: 26px 28px;
	margin: 0 16px;
}
.tabs {
	display: flex;
	justify-content: space-around;
	gap: 10px;
	margin-top: 14px;
	margin: 14px 16px 0;
	.tab {
		flex: 1;
		text-align: center;
		border-radius: 14px 14px 0px 0px;
		background-color: var(--Bg-1);
		padding: 10px;
		position: relative;
		font-size: 14px;
		color: var(--Text-2-1);
		cursor: pointer;
	}
	.active {
		background-color: var(--Theme);
		color: var(--Text-s);
	}
	.active::after {
		content: "";
		position: absolute;
		top: calc(100% - 1px); /* 箭头在元素下方 */
		left: 50%;
		transform: translateX(-50%);
		border-width: 8px;
		border-style: solid;
		border-color: var(--Theme) transparent transparent transparent; /* 上边的三角形箭头 */
	}
}
.taskList {
	border-radius: 14px;
	background: var(--Bg-4);
	padding: 16px;
	min-height: 300px;
	.card {
		margin-bottom: 10px;
		height: 88px;
		background: url("./image/cardBg.png") no-repeat;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		padding: 16px 24px;
		> div:first-child {
			width: 68px;
			img {
				width: 44px;
				height: 48px;
			}
		}
		> div:nth-child(2) {
			flex: 1;
			display: flex;
			flex-direction: column;
			width: 226px;
			gap: 6px;
			.progress {
				background: url("./image/progress.png") no-repeat;
				background-size: 100% 100%;
				height: 8px;
				width: 226px;
				.value {
					margin-top: 1px;
					margin-left: 1.5px;
					height: 5px;
					max-width: calc(226px - 3px);
					border-radius: 8px;
					background-color: var(--success);
				}
			}
			.bottom {
				width: 226px;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}
	.btnType {
		width: 70px;
		height: 26px;
		line-height: 26px;
		text-align: center;
		font-size: 12px;
		color: var(--Text-s);
		cursor: pointer;
		border-radius: 6px 6px 5px 5px;
	}
	.btnType0 {
		background: linear-gradient(270deg, #fd6780 0%, #ff405e 100%);
	}
	.btnType1 {
		background: linear-gradient(270deg, #afafb3 0%, #87878b 100%);
	}
	.btnType2 {
		background: linear-gradient(270deg, #afafb3 0%, #87878b 100%);
	}
	.btnType3 {
		background: linear-gradient(270deg, #3fb8ff 0%, #1283e0 100%);
	}
	.card.welcome {
		background: url("./image/cardBg2.png") no-repeat;
		background-size: 100% 100%;
	}
	.card.currency {
		background: url("./image/cardBg3.png") no-repeat;
		background-size: 100% 100%;
	}
	.card.email {
		background: url("./image/cardBg3.png") no-repeat;
		background-size: 100% 100%;
	}
	.card.phone {
		background: url("./image/cardBg4.png") no-repeat;
		background-size: 100% 100%;
	}
	.daojishiBg {
		width: 240px;
		height: 25px;
		background: url("./image/daojishiBg.png") no-repeat;
		background-size: 100% 100%;
		line-height: 25px;
		padding-left: 30px;
		font-size: 14px;
	}
	.help_icon {
		position: absolute;
		right: 8px;
		top: 8px;
		cursor: pointer;
		img {
			height: 12px;
		}
	}
}
.Dialog {
	width: 448px;
	max-width: 70vh;
	border-radius: 12px;
	min-height: 300px;
	background-color: var(--Bg-1);
	.title {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid var(--Line-2);
		padding: 13px 20px;
		color: var(--Text-s);
		img {
			width: 24px;
			height: 24px;
			cursor: pointer;
		}
	}
	.content {
		padding: 10px 20px;
		color: var(--Text-1);
		:deep(img) {
			max-width: 100%;
		}
	}
}

.result {
	margin: 15px 0 0;
	height: 40px;
	line-height: 40px;
	color: var(--Theme);
	background: rgba(#ff284b, 0.2);
}
</style>
