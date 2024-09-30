<template>
	<div class="activityWrapper">
		<div class="activityHeader">{{ activityData.activityNameI18nCode || "红包雨" }}</div>

		<div class="activityMain">
			<div class="activityImg">
				<img src="./image/redBagRainImg.png" alt="" />
				<div class="shadow"></div>
			</div>
			<div class="bonus_card">
				<div class="bonus_card_title">红包雨</div>
				<div class="bonus_card_content">
					<div>距离下一场红包雨还有</div>
					<div class="countdownBg">00:08:08</div>
				</div>
				<div class="bonus_card_btn">
					<button class="common_btn" @click="getActivityReward" :disabled="false">立即申请</button>
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
						<div v-for="(item, index) in activityData.sessionInfoList" class="session">
							<div>{{ Common.parseHms(item.startTime) }}</div>
							<div class="sideBox">
								<img src="./image/sessionCricle.svg" alt="" v-if="item.status == 0" />
								<img src="./image/sessionCricle1.svg" alt="" v-if="item.status == 1" />
								<img src="./image/sessionCricle2.svg" alt="" v-if="item.status == 2" />
							</div>
							<div :class="'status' + item.status">{{ status[item.status] }}</div>
							<span class="side" v-if="index !== activityData.sessionInfoList.length - 1" :class="'type' + item.status"></span>
						</div>
					</slide>
				</div>
				<div class="activityContentFooter" />
			</div>
			<div class="activityContent">
				<div class="activityContentHeader">
					<div class="flex-center">
						<img src="../image/activityContentHeaderLeft.svg" alt="" />
						<span>中奖名单</span>
						<img src="./image/activityContentHeaderRight.svg" alt="" />
					</div>
				</div>
				<div class="activityContentCenter">
					<div class="winnerListTable">
						<div class="winnerListHeader">
							<div>会员账号</div>
							<div>获得红包</div>
							<div>时间</div>
						</div>
						<div class="winnerListBody" v-for="item in 5">
							<div>1****7</div>
							<div>8.6 BCD</div>
							<div>2023-09-06 23:59:59</div>
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
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { activityApi } from "/@/api/activity";
import { useRouter } from "vue-router";
import { useActivityStore } from "/@/stores/modules/activity";
import { computed } from "vue";
import Common from "/@/utils/common";
import { redbagRainSingleton } from "/@/hooks/useRedbagRain"; // 引入自定义 hook

const activityStore = useActivityStore();
const activityData: any = computed(() => activityStore.getCurrentActivityData);

const status: any = {
	0: "未开始",
	1: "进行中",
	2: "已结束",
};

const getActivityReward = () => {
	redbagRainSingleton.showRedbagRain();
};
</script>
<style scoped lang="scss">
.activityWrapper {
	background: url("../image/commonBg.png") no-repeat;
	background-size: 100% auto;
	overflow: hidden;
	.activityHeader {
		background: url("../image/header_bg.svg") no-repeat;
		height: 57px;
		width: 580px;
		margin: 0 auto;
		margin-top: 18px;
		text-align: center;
		line-height: 42px;
		font-size: 20px;
		font-weight: 600;
		color: var(--Text_a);
	}
	.activityImg {
		width: 100%;
		background: url("./image/redBagRainBg.png") no-repeat;
		background-size: 100% auto;
		position: relative;
		img {
			width: 100%;
			padding: 0 49px;
		}
		.shadow {
			height: 84px;
			background: linear-gradient(180deg, rgba(34, 36, 42, 0) 0%, #22242a 100%);
			position: absolute;
			bottom: 0;
			width: 100%;
		}
	}
	.activityMain {
		overflow: auto;
		width: 760px;
		height: 80vh;
		min-height: 500px;
		// padding-right: 0px !important;
		.bonus_card {
			height: 273px;
			margin-top: 15px;
			background: url("../image/bonus_card_bg.svg") no-repeat;
			background-size: 100% 100%;
			padding: 0 52px;
			.bonus_card_title {
				text-align: center;
				height: 41px;
				line-height: 41px;
				font-size: 20px;
				color: var(--Text_a);
			}
			.bonus_card_content {
				text-align: center;
				display: flex;
				flex-direction: column;
				justify-content: center;
				gap: 20px;
				height: 130px;
				color: var(--Text2);
				.countdownBg {
					height: 56px;
					line-height: 56px;
					font-weight: 600;
					font-size: 20px;
					color: var(--Theme);
					background: url("./image/countdownBg.png") no-repeat center;
				}
			}
			.bonus_card_btn {
				padding: 0 81px;
				.common_btn:disabled {
					height: 48px;
					background: url("./image/btnBg.png") no-repeat;
					background-size: 100% 100%;
				}
				.common_btn {
					height: 48px;
					background: url("./image/btnActiveBg.png") no-repeat;
					background-size: 100% 100%;
				}
			}
			.bonus_card_footer {
				text-align: center;
				padding: 13px 23px;
				font-size: 16px;
				font-size: 16px;
				color: var(--Text2);
				.Theme_text {
					font-size: 24px;
					font-weight: 700;
				}
			}
		}
		.activityContent {
			color: var(--Text1);
			margin-top: 16px;

			.activityContentHeader {
				height: 108px;
				padding-top: 30px;
				text-align: center;
				background: url("../image/activityContentHeader.png") no-repeat;
				background-size: 100% 100%;
				.flex-center {
					gap: 34px;
					font-size: 24px;
					font-weight: 500;
					color: var(--Text_s);
				}
			}
			.activityContentCenter {
				background: url("../image/activityContentCenter.png");
				background-size: 100% auto;
				padding: 0 25px;
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
				height: 108px;
				text-align: center;
				background: url("../image/activityContentFooter.png") no-repeat;
				background-size: 100% 100%;
			}
			.ruleCenter {
				padding: 0 35px;
			}
		}
	}
	.activityMain::-webkit-scrollbar {
		// width: 6px;
		display: none;
	}
	.activityMain::-webkit-scrollbar-track {
		background-color: transparent;
	}
	.activityMain::-webkit-scrollbar-thumb {
		background: var(--icon);
		border-radius: 5px;
	}
}
</style>
