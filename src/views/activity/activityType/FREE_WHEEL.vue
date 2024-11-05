<template>
	<div class="activityWrapper">
		<div class="activityHeader">
			{{ activityData.activityNameI18nCode || "免费旋转" }}
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
			<div class="apply_btn">
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
import { computed } from "vue";
import Common from "/@/utils/common";
import CommonDialog from "../components/activityDialog.vue";
import { useModalStore } from "/@/stores/modules/modalStore";
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
// .activityWrapper {
// 	background: url("./image/commonBg.png") no-repeat;
// 	background-size: 100% 100%;
// 	overflow: hidden;
// 	padding-right: 3px;
// 	border-radius: 12px;
// 	.activityHeader {
// 		background: url("./image/header_bg.svg") no-repeat;
// 		background-size: 100% 100%;
// 		height: 54px;
// 		width: 366px;
// 		margin: 0 auto;
// 		text-align: center;
// 		line-height: 54px;
// 		font-size: 16px;
// 		font-weight: 600;
// 		color: var(--Text_a);
// 		position: relative;
// 		.closeIcon {
// 			position: absolute;
// 			right: -30px;
// 			top: -1px;
// 			img {
// 				width: 30px;
// 				height: 30px;
// 			}
// 		}
// 	}
// 	.activityImg {
// 		img {
// 			width: 100%;
// 			height: 197px;
// 			object-fit: cover;
// 		}
// 	}
// 	.activityMain {
// 		overflow: auto;
// 		width: 480px;
// 		height: 80vh;
// 		min-height: 500px;

// 		.activityContent {
// 			color: var(--Text1);
// 			margin-top: 16px;
// 			padding: 0 16px;
// 			.activityContentHeader {
// 				height: 64px;
// 				padding-top: 30px;
// 				text-align: center;
// 				background: url("./image/activityContentHeader.png") no-repeat;
// 				background-size: 100% 100%;
// 				.flex-center {
// 					font-size: 16px;
// 					font-weight: 500;
// 					color: var(--Text_s);
// 				}
// 			}
// 			.activityContentCenter {
// 				background: url("./image/activityContentCenter.png");
// 				background-size: 100% auto;
// 				padding: 0 25px;
// 				position: relative;
// 				.activityContentImg {
// 					position: absolute;
// 					right: 14px;
// 					top: 40px;
// 					z-index: 0;
// 					img {
// 						z-index: -1;
// 						height: 152px;
// 						width: 149px;
// 						border-radius: 15px;
// 					}
// 				}
// 				.contentCell {
// 					z-index: 10;
// 					.cellLabel {
// 						height: 28px;
// 						background: url("./image/cellLabelBg.png") no-repeat;
// 						background-size: auto 100%;
// 						line-height: 28px;
// 						padding-left: 35px;
// 						color: var(--Text_s);
// 						font-size: 14px;
// 						font-weight: 600;
// 					}
// 					.cellValue {
// 						padding-left: 35px;
// 						margin: 12px 0;
// 						font-size: 14px;
// 						font-weight: 400;
// 					}
// 				}
// 				.contentCell:last-child {
// 					.cellValue {
// 						margin-bottom: 0;
// 					}
// 				}
// 				.ruleDetails {
// 					font-size: 12px;
// 				}
// 			}
// 			.activityContentFooter {
// 				height: 66px;
// 				text-align: center;
// 				background: url("./image/activityContentFooter.png") no-repeat;
// 				background-size: 100% 100%;
// 			}
// 		}
// 		.apply_btn {
// 			width: 320px;
// 			height: 36px;
// 			margin: 20px auto;
// 			div {
// 				height: 36px;
// 				background: url("./image/btn_bg.png");
// 				background-size: 100% 100%;
// 				line-height: 36px;
// 				text-align: center;
// 				color: var(--Text_a);
// 				font-size: 14px;
// 			}
// 			div.active {
// 				height: 36px;
// 				background: url("./image/btn_active_bg.png");
// 				background-size: 100% 100%;
// 				line-height: 36px;
// 				text-align: center;
// 				color: var(--Text_a);
// 				font-size: 14px;
// 			}
// 		}
// 	}
// 	.activityMain::-webkit-scrollbar {
// 		width: 6px;
// 	}
// 	.activityMain::-webkit-scrollbar-track {
// 		background-color: transparent;
// 	}
// 	.activityMain::-webkit-scrollbar-thumb {
// 		background: var(--icon);
// 		border-radius: 5px;
// 	}
// }
</style>
