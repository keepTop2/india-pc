<template>
	<div class="activityWrapper">
		<div class="activityHeader">{{ activityData.activityNameI18nCode || "次存活动" }}</div>
		<div class="activityMain">
			<div class="activityImg">
				<img src="./image/image.png" alt="" />
			</div>
			<div class="bonus_card">
				<div class="bonus_card_title">红利赠送</div>
				<div class="bonus_card_content">
					<div>
						<div>存款金额</div>
						<div class="amount"><span class="Text3">$</span>{{ activityData.depositAmount || 0 }}</div>
					</div>
					<div class="line"></div>
					<div>
						<div>需打流水</div>
						<div class="amount"><span class="Text3">$</span>{{ activityData.runningWater || 0 }}</div>
					</div>
				</div>
				<div class="bonus_card_footer">
					可得金额: <span class="Theme_text"><span class="fs_20 mr_2">$</span>{{ activityData.activityAmount || 0 }}</span>
				</div>
				<div>
					<button class="common_btn" @click="getActivityReward">立即申请</button>
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
						<div class="cellValue">{{ activityData.userTypeName }}</div>
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
const activityStore = useActivityStore();
const router = useRouter();
const activityData: any = computed(() => activityStore.getCurrentActivityData);

const getActivityReward = () => {
	console.log(activityData.value);

	activityApi.getActivityReward({ id: activityData.value.id }).then((res) => {
		console.log(res);
	});
};
</script>
<style scoped lang="scss">
.activityWrapper {
	background: url("./image/commonBg.png") no-repeat;
	background-size: 100% auto;
	overflow: hidden;
	padding-right: 3px;
	.activityHeader {
		background: url("./image/header_bg.svg") no-repeat;
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
		img {
			width: 100%;
		}
	}
	.activityMain {
		overflow: auto;
		width: 760px;
		height: 80vh;
		min-height: 500px;
		padding: 0 24px;

		.bonus_card {
			height: 273px;
			margin-top: 15px;
			background: url("./image/bonus_card_bg.svg") no-repeat;
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
				display: flex;
				justify-content: space-around;
				border-bottom: 1px solid var(--Line_2);
				height: 92px;
				display: flex;
				align-items: center;
				color: var(--Text2);
				.amount {
					text-align: center;
					margin-top: 8px;
					font-size: 24px;
					font-weight: 700;
					.Text3 {
						font-size: 20px;
						margin-right: 3px;
					}
				}
				.line {
					width: 1px;
					height: 58px;
					background-color: var(--Line_2);
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
			.common_btn {
				height: 48px;
				background: linear-gradient(279deg, #ff284b 8.07%, #fd677f 104.14%);
			}
		}
		.activityContent {
			color: var(--Text1);
			margin-top: 16px;

			.activityContentHeader {
				height: 108px;
				padding-top: 30px;
				text-align: center;
				background: url("./image/activityContentHeader.png") no-repeat;
				background-size: 100% 100%;
				.flex-center {
					gap: 34px;
					font-size: 24px;
					font-weight: 500;
					color: var(--Text_s);
				}
			}
			.activityContentCenter {
				background: url("./image/activityContentCenter.png");
				background-size: 100% auto;
				padding: 0 25px;
				position: relative;
				.activityContentImg {
					position: absolute;
					right: 47px;
					top: 40px;
					img {
						height: 152px;
						width: 149px;
						border-radius: 15px;
					}
				}
				.contentCell {
					.cellLabel {
						height: 46px;
						background: url("./image/cellLabelBg.png") no-repeat;
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
						margin-bottom: 0;
					}
				}
			}
			.activityContentFooter {
				height: 108px;
				text-align: center;
				background: url("./image/activityContentFooter.png") no-repeat;
				background-size: 100% 100%;
			}
		}
	}
	.activityMain::-webkit-scrollbar {
		width: 6px;
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
