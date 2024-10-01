<template>
	<div class="activityWrapper">
		<div class="activityCenter">
			<div class="activityHeader">
				{{ activityData.activityNameI18nCode || "幸运转盘" }}
			</div>
			<div class="activityMain">
				<div class="spinContainer">
					<div class="tabs">
						<div v-for="(item, index) in tabs" :key="index" :class="currentTab === item.value ? 'tab tab' + item.value + '_active' : 'tab'" @click="currentTab = item.value">
							{{ item.name }}
						</div>
					</div>
					<Spin @start-spinning-callback="spinStart" @end-spinning-callback="spinEnd" :reward="reward" :spinList="spinList" ref="SpinRef" />
				</div>
				<div class="p_20">
					<button class="common_btn active">剩余抽奖次数： 1</button>
				</div>
				<div class="flex_space-between">
					<div class="bonus">
						<div>转盘奖金总计</div>
						<div class="fs_14 Theme_text">987,654,321.00</div>
					</div>
					<div class="record" @click="showRecord = true">我的抽奖记录 <svg-icon name="arrow_right" size="16px"></svg-icon></div>
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
						<div class="ruleCell">
							<span>活动时间</span>
							<span>2023-12-12 00:00:00～2023-12-31 23:59:59</span>
						</div>
						<div class="ruleCell">
							<span>活动对象</span>
							<span>首存会员</span>
						</div>
						<div class="ruleDetails">
							<div>
								1、活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活
								动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则
							</div>
							<div>
								2、活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活
								动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则
							</div>
							<div>
								3、活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活
								动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则
							</div>
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
				<div class="dialogTable">
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
								<span>{{ item.receiveTime }}</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>

							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>
							<div v-for="(item, index) in recordList" :key="index" class="dialogTableItem">
								<span>{{ item.rewardRankText }}</span>
								<span>{{ item.prizeName }}</span>
								<span>{{ item.activityAmount }}</span>
								<span>{{ item.receiveTime }}</span>
							</div>
						</div>
					</LazyLoadList>
				</div>
			</div>
			<div class="closeRecord" @click="showRecord = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>

		<!-- 中奖了 -->
		<CommonDialog v-model="showbetResult">
			<div class="betResult">
				<img src="./images/result_img.png" alt="" />
				<div class="Text_s fs_20 fw_600">恭喜您获得</div>
				<div class="amunt mt_40 mb_33">$9.03121</div>
				<div class="againBtn">
					<div class="bubble">剩余次数</div>
					<button class="common_btn active" @click="handleStartSpin">再抽一次：1</button>
				</div>
			</div>
			<div class="closeRecord" @click="showbetResult = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>
		<!-- 没中奖 -->

		<CommonDialog v-model="showLosserbetResult">
			<div class="losserbetResult">
				<img src="./images/result_img.png" alt="" />
				<div class="Text_s fs_20 fw_600">恭喜您获得</div>
				<div class="amunt mt_40 mb_33">$9.03121</div>
				<div class="againBtn">
					<div class="bubble">剩余次数</div>
					<button class="common_btn active" @click="handleStartSpin">再抽一次：1</button>
				</div>
			</div>
			<div class="closeRecord" @click="showLosserbetResult = false">
				<img src="../../activityType/image/close.png" alt="" />
			</div>
		</CommonDialog>
	</div>
</template>

<script setup lang="ts">
import { activityApi } from "/@/api/activity";
import { useActivityStore } from "/@/stores/modules/activity";
import { computed } from "vue";
import Common from "/@/utils/common";
import { ref, onMounted } from "vue";
import Spin from "./spin.vue";
import { mockDoGetReward, mockGetSpinList } from "./api";
const activityStore = useActivityStore();
const activityData: any = computed(() => activityStore.getCurrentActivityData);
const showRecord = ref(false);
const showbetResult = ref(false);
const showLosserbetResult = ref(false);
const recordFinished = ref(false);
const recordIsLoading = ref(false);
const SpinRef: any = ref(null);
const recordList = [
	{
		receiveTime: "2022-05-12 14:11:23",
		rewardRankText: "青铜",
		prizeName: "手机",
		activityAmount: "9999",
	},
	{
		receiveTime: "2022-05-12 14:11:23",
		rewardRankText: "青铜",
		prizeName: "手机",
		activityAmount: "9999",
	},
	{
		receiveTime: "2022-05-12 14:11:23",
		rewardRankText: "青铜",
		prizeName: "手机",
		activityAmount: "9999",
	},
];
// 奖项列表
const spinList = ref();
// 获得的奖励
const reward = ref();
// 当前选中的标签
const currentTab = ref("1");
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
	/**
	 * @description 获取奖项列表
	 */
	mockGetSpinList().then((res: any) => {
		spinList.value = res.data;
	});
});

/**
 * @description 选择标签
 * @param {string} tabKey - 选中的标签值
 */
const selectTab = (tabKey: string) => {
	currentTab.value = tabKey;
};

/**
 * @description 抽奖开始
 */
const spinStart = () => {
	mockDoGetReward().then((res: any) => {
		reward.value = res.data;
	});
};

/**
 * @description 处理转盘停止后的逻辑
 */
const spinEnd = () => {
	// 处理转盘停止后的逻辑
	showLosserbetResult.value = true;
};
const handleStartSpin = () => {
	showbetResult.value = false;
	showLosserbetResult.value = false;
	SpinRef.value?.handleStartSpin();
};

const getRecordList = () => {
	console.log(9999);
};
</script>
<style scoped lang="scss">
.activityWrapper {
	background-size: 100% auto;
	overflow: hidden;
	.activityCenter {
		width: 444px;
		margin: 0 auto;
		background: url("../image/commonBg2.png") no-repeat;
		background-color: var(--Bg1);
		background-size: 100% 100%;
		position: relative;
		border-radius: 15px;
	}
	.activityHeader {
		height: 57px;
		margin: 0 auto;
		text-align: center;
		line-height: 42px;
		font-size: 20px;
		padding-top: 8px;
		font-weight: 600;
		color: var(--Text_a);
		.close {
			position: absolute;
			right: 20px;
			top: 23px;
			cursor: pointer;
		}
	}
	.activityMain {
		overflow-y: auto;
		overflow-x: hidden;
		height: 80vh;
		min-height: 500px;
	}
	.common_btn {
		background: url("./images/btn_bg.png") no-repeat;
		background-size: 100% 100%;
		height: 45px;
	}

	.flex_space-between {
		padding: 0 20px;
		color: var(--Text_s);
		> div {
			flex: 1;
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
		background: url("./images/contentBg.png") no-repeat;
		background-size: 100% 100%;
		background-position: 0 20px;
		margin: 0 20px;
		padding-bottom: 16px;
		.tabs {
			display: flex;
			justify-content: space-around;
			height: 50px;
			line-height: 50px;
			color: var(--Text_s);
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
	}

	.activityContent {
		color: var(--Text1);
		margin: 16px 15px 16px;
		.activityContentHeader {
			height: 78px;
			padding-top: 30px;
			text-align: center;
			background: url("../image/activityContentHeader.png") no-repeat;
			background-size: 100% 100%;
			.flex-center {
				gap: 30px;
				font-size: 20px;
				font-weight: 500;
				color: var(--Text_s);
			}
		}
		.activityContentCenter {
			background: url("../image/activityContentCenter.png");
			background-size: 100% auto;
			padding: 0 15px;
			position: relative;
			.sessions {
				display: flex;
				justify-content: center;
				.session {
					min-width: 115px;
					text-align: center;
					position: relative;
					.sideBox {
						height: 24px;
						margin: 12px 0;
					}
					.side {
						display: inline-block;
						width: 70px;
						height: 6px;
						background-color: var(--Line_2);
						position: absolute;
						left: calc(50% + 21px);
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
				margin: 0 45px;
				border: 2px solid rgba(255, 40, 75, 0.4);
				border-radius: 12px;
				.winnerListHeader,
				.winnerListBody {
					width: 100%;
					display: flex;
					height: 48px;
					line-height: 48px;
					justify-content: center;
					border-bottom: 2px solid rgba(255, 40, 75, 0.4);
					> div {
						flex: 1;
						text-align: center;
					}
					> div:first-child {
						border-right: 2px solid rgba(255, 40, 75, 0.4);
					}
					> div:nth-child(2) {
						border-right: 2px solid rgba(255, 40, 75, 0.4);
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
			.contentCell {
				.cellLabel {
					height: 46px;
					background: url("../image/cellLabelBg.png") no-repeat;
					background-size: auto 100%;
					line-height: 46px;
					padding-left: 67px;
					color: var(--Text_s);
					font-size: 16px;
					font-weight: 600;
				}
				.cellValue {
					padding-left: 67px;
					margin: 12px 0;
					font-weight: 400;
					width: 500px;
				}
			}
			.contentCell:last-child {
				.cellValue {
					margin: 0;
				}
			}
		}
		.activityContentFooter {
			height: 48px;
			text-align: center;
			background: url("../image/activityContentFooter.png") no-repeat;
			background-size: 100% 100%;
		}
		.ruleCenter {
			padding: 0 25px;
		}
	}
	.activityMain::-webkit-scrollbar {
		width: 6px;
		display: none;
	}
	.activityMain::-webkit-scrollbar-track {
		background-color: transparent;
	}
	.activityMain::-webkit-scrollbar-thumb {
		background: var(--icon);
		border-radius: 5px;
	}
	.dialogCenter {
		width: 444px;
		margin: 0 auto;
		height: 80vh;
		min-height: 500px;
		background: url("./images/record_dialog_bg.png") no-repeat;
		background-color: var(--Bg1);
		background-size: 100% 100%;
		position: relative;
		padding-top: 20px;
		overflow: hidden;
		.dialogHeader {
			width: 330px;
			height: 64px;
			margin: 0 auto;
			background: url("./images/record_dialog_header_bg.png") no-repeat;
			background-size: 100% 100%;
			text-align: center;
			line-height: 64px;
			font-size: 20px;
			color: var(--Text_a);
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
				color: var(--Text_s);
				font-size: 14px;
				span {
					flex: 1;
					font-weight: 400;
					text-align: center;
					border-right: 1px solid var(--Line_2);
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
				background: var(--Bg3);
			}
			.dialogTableItem:nth-child(even) {
				background: var(--Bg2);
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
			background: var(--icon);
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
			color: var(--Text_a);
			line-height: 27.5px;
			font-size: 14px;
		}
	}
}
</style>
