<template>
	<div>
		<Card :header="dialogType ? false : true" :class="{ half_round_corner: dialogType }">
			<template #header>
				<div class="header">
					<span class="label">{{ $t(`wallet['存款']`) }}</span>
					<svg-icon class="icon" name="wallet-header_arrow" />
					<span class="type_label">{{ getTitle }}</span>
				</div>
			</template>
			<div class="container">
				<div class="info">
					<div class="amount_info">
						<img class="icon" :src="amount_icon" alt="" />
						<span class="value">{{ depositOrderDetail.tradeCurrencyAmount }}</span>
						<span>&nbsp;</span>
						<span class="label">{{ UserStore.userInfo.mainCurrency }}</span>
					</div>
					<template v-if="depositOrderDetail.customerStatus == '0'">
						<div class="date">
							<span>{{ formattedTime }}</span>
						</div>
						<p class="tips">
							<span>{{ $t(`wallet['请在规定的时间内完成支付，如已完成支付']`) }}</span>
							<span>&nbsp;</span>
							<span v-if="depositOrderDetail.voucherFlag == 0" class="a" @click="openProofModal">{{ $t(`wallet['提供转账凭证']`) }}</span>
						</p>
					</template>
				</div>

				<div class="form_info">
					<div class="content">
						<div class="cell">
							<div class="label">{{ $t(`wallet['状态']`) }}</div>
							<div class="value" :class="getClass">{{ getStatusLabel() }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['存款金额']`) }}</div>
							<div class="value">{{ common.formatFloat(depositOrderDetail.applyAmount) }} {{ UserStore.userInfo.mainCurrency }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['手续费']`) }}</div>
							<div class="value">
								<span v-if="depositOrderDetail.feeAmount > 0">-</span>
								<span>{{ common.formatFloat(depositOrderDetail.feeAmount) }}</span>
								<span>{{ UserStore.userInfo.mainCurrency }}</span>
							</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['到账金额']`) }}</div>
							<div class="value">{{ common.formatFloat(depositOrderDetail.tradeCurrencyAmount) }} {{ UserStore.userInfo.mainCurrency }}</div>
						</div>
					</div>
					<div class="content">
						<div class="cell">
							<div class="label">{{ $t(`wallet['存款方式']`) }}</div>
							<div class="value">{{ depositOrderDetail.depositWithdrawWay }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['申请时间']`) }}</div>
							<div class="value">{{ common.getYMDHms(depositOrderDetail.createdTime, "YYYY/MM/DD HH:mm:ss") }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['订单号']`) }}</div>
							<div class="value">
								<span> {{ depositOrderDetail.orderNo }}</span>
								<svg-icon class="copy_icon curp ml_12" name="copy" size="16px" v-hover-svg @click="common.copy(depositOrderDetail.orderNo)" />
							</div>
						</div>
					</div>
				</div>

				<div class="progress">
					<div class="step">
						<div class="icon">
							<div class="content">
								<img :src="success" alt="" />
							</div>
							<div class="line line_success"></div>
						</div>
						<div class="label">{{ $t(`wallet['创建充值订单']`) }}</div>
						<div class="value">{{ common.getYMDHms(depositOrderDetail.createdTime, "YYYY/MM/DD HH:mm:ss") }}</div>
					</div>
					<div class="step">
						<div class="icon">
							<div class="content">
								<img :src="success" alt="" />
							</div>
							<div class="line" :class="{ line_success: depositOrderDetail.customerStatus != 0 }"></div>
						</div>
						<div class="label">{{ $t(`wallet['第三方商户处理中']`) }}</div>
						<div class="value">{{ $t(`wallet['更新于']`) }}{{ common.getYMDHms(depositOrderDetail.updatedTime, "YYYY/MM/DD HH:mm:ss") }}</div>
					</div>
					<div class="step">
						<div class="icon">
							<div class="content">
								<span v-if="depositOrderDetail.customerStatus == '0'">3</span>
								<img v-if="depositOrderDetail.customerStatus == '1'" :src="success" alt="" />
								<img v-if="depositOrderDetail.customerStatus == '2'" :src="error_icon" alt="" />
							</div>
						</div>
						<div class="label">{{ $t(`wallet['交易完成/失败']`) }}</div>
					</div>
				</div>

				<div class="upload_img_list" v-if="depositOrderDetail.voucherFlag === 1">
					<img v-for="(item, index) in depositOrderDetail.cashFlowFileList" v-lazy-load="item" alt="" class="item_img" />
				</div>

				<div class="btns">
					<!-- <div class="cancel" @click="onCancelDepositOrder">{{ $t(`wallet['取消充值']`) }}</div> -->
					<template v-if="depositOrderDetail.customerStatus == '0'">
						<template v-if="depositOrderDetail.voucherFlag === 0">
							<div class="cancel" @click="onCancelDepositOrder">{{ $t(`wallet['取消充值']`) }}</div>
							<div class="confirm" @click="onContinueRecharge">{{ $t(`wallet['继续充值']`) }}</div>
						</template>
						<template v-else-if="depositOrderDetail.voucherFlag === 1">
							<div class="cancel" @click="common.getSiteCustomerChannel">{{ $t(`wallet['联系客服']`) }}</div>
							<div v-if="depositOrderDetail.urgeOrder === 0" class="confirm" @click="onUrgeOrder">{{ $t(`wallet['我要催单']`) }}</div>
						</template>
					</template>
					<template v-else>
						<div class="cancel" @click="common.getSiteCustomerChannel">{{ $t(`wallet['联系客服']`) }}</div>
					</template>
				</div>
			</div>
		</Card>

		<!-- 上传凭证弹窗 -->
		<CommonDialog v-model="isProofModalVisible">
			<div class="Proof_container">
				<div class="Proof_header">
					<span>{{ $t(`wallet['上传凭证']`) }}</span>
					<i @click="isProofModalVisible = false">
						<svg-icon class="icon" name="close" />
					</i>
				</div>
				<div class="Proof_main">
					<p class="tips">
						<span>{{ $t(`wallet['请提供该笔充值成功信息截图，我们会尽快为您审核']`) }}</span>
						<span class="red">{{ $t(`wallet['（图片限制10MB）']`) }}</span>
					</p>
					<div class="list">
						<Upload :files="cashFlowFileList" :max="3" @update:files="updateFiles" :onUpload="uploadImg" @del="uploadDel" />
					</div>
					<div class="form">
						<div class="cell">
							<div class="label">{{ $t(`wallet['状态']`) }}</div>
							<div class="value" :class="getClass">{{ getStatusLabel() }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['金额']`) }}</div>
							<div class="value">{{ common.formatFloat(depositOrderDetail.applyAmount) }} {{ UserStore.userInfo.mainCurrency }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['时间']`) }}</div>
							<div class="value">{{ common.getYMDHms(depositOrderDetail.createdTime, "YYYY/MM/DD HH:mm:ss") }}</div>
						</div>
					</div>
					<div class="cell_input">
						<div class="label">
							<span>{{ $t(`wallet['留言']`) }}</span>
							<span class="s">{{ $t(`wallet['(最多个字符)']`, { value: cashFlowRemark.length }) }}</span>
						</div>
						<textarea v-model="cashFlowRemark" :placeholder="$t(`wallet['请输入']`)" :maxlength="500" />
					</div>
					<div class="button" @click="onSubmitProof">{{ $t(`wallet['提交']`) }}</div>
				</div>
			</div>
		</CommonDialog>

		<!-- 加速弹窗 -->
		<CommonDialog v-model="isUrgeModalVisible">
			<div class="urge_container">
				<div class="icon">
					<img :src="speed_up_success" alt="" />
				</div>
				<p class="text1">{{ $t(`wallet['订单提交成功']`) }}</p>
				<p class="text2">{{ $t(`wallet['我们会尽快查看您的充值订单']`) }}</p>
				<div class="button" @click="isUrgeModalVisible = false">{{ $t(`wallet['好的']`) }}</div>
			</div>
		</CommonDialog>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Card from "../components/card.vue";
import amount_icon from "/@/assets/zh-CN/wallet/amount_icon.png";
import success from "/@/assets/zh-CN/wallet/success.png";
import error_icon from "/@/assets/zh-CN/wallet/error.png";
import speed_up_success from "/@/assets/zh-CN/wallet/speed_up_success.png";
import { walletApi } from "/@/api/wallet";
import { uploadApi } from "/@/api/upload";
import common from "/@/utils/common";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useUserStore } from "/@/stores/modules/user";
import { i18n } from "/@/i18n/index";
import Upload from "./components/ImgUpload.vue";
import pubsub from "/@/pubSub/pubSub";
import { nextTick } from "process";

const $: any = i18n.global;
const route = useRoute();
const router = useRouter();
const UserStore = useUserStore();

interface depositOrderDetailRootObject {
	orderNo: string;
	depositWithdrawWay: string;
	depositWithdrawTypeCode: string;
	depositWithdrawChannelType: string;
	tradeCurrencyAmount: number;
	applyAmount: number;
	exchangeRate?: any;
	feeRate: number;
	feeAmount: number;
	customerStatus: string | number;
	customerStatusText: string;
	createdTime: number;
	updatedTime: number;
	remindTime: number;
	accountName: string;
	accountAddress?: any;
	voucherFlag: number;
	cashFlowFile?: any;
	cashFlowFileList?: any;
	thirdPayUrl?: any;
	urgeOrder: number;
}

const props = withDefaults(
	defineProps<{
		dialogType?: boolean;
	}>(),
	{
		dialogType: false, // 设置默认值为 false
	}
);

const emit = defineEmits<{
	(e: "CancelDepositOrder"): void;
	(e: "ContinueRecharge"): void;
}>();

const depositOrderDetail = ref({} as depositOrderDetailRootObject); // 订单接口详情
const formattedTime = ref<string>(""); // 格式化倒计时为时分秒格式的响应式变量
const isUrgeModalVisible = ref(false); // 订单加速弹窗
const isProofModalVisible = ref(false); // 上传凭证弹窗
const files = ref<Array<{ name: string; preview: string }>>([]); // 上传文件
const cashFlowFileList = ref([] as any); // 服务器上传文件
const cashFlowRemark = ref(""); // 留言

onMounted(() => {
	nextTick(() => {
		getDepositOrderDetail();
	});
	pubsub.subscribe("/wallet/rechargeSuccessFail", rechargeSuccessFail);
});

// 收到订单推送订阅
const rechargeSuccessFail = (data: depositOrderDetailRootObject) => {
	if (depositOrderDetail.value.orderNo !== data.orderNo) return; // 订单号不同则就退出
	Object.assign(depositOrderDetail.value, data);
	if (depositOrderDetail.value.customerStatus !== "0") {
		clearInterval(startCountdown);
	}
};

// 获取卡片标题
const getTitle = computed(() => {
	switch (depositOrderDetail.value.depositWithdrawTypeCode) {
		case "bank_card":
			return $.t("wallet['银行卡存款']");
		case "electronic_wallet":
			return $.t("wallet['电子钱包存款']");
		default:
			return ""; // 可以根据需求设定默认值
	}
});

// 点击上传凭证
const openProofModal = () => {
	isProofModalVisible.value = true;
};

// 获取订单详情
const getDepositOrderDetail = async () => {
	console.log("有触发吗？", route.query);
	const params = {
		orderNo: route.query.orderNo,
	};
	const res = await walletApi.depositOrderDetail(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		depositOrderDetail.value = res.data;
		startCountdown();
	}
};

// 提交上传凭证
const onSubmitProof = async () => {
	const urlString = cashFlowFileList.value.map((file) => file.fileKey).join(",");
	const params = {
		orderNo: route.query.orderNo,
		cashFlowFile: urlString,
		cashFlowRemark: cashFlowRemark.value,
	};
	const res = await walletApi.uploadVoucher(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		// 关闭弹窗
		isProofModalVisible.value = false;
		// 清空参数
		clearParams();
		// 重新获取订单状态
		getDepositOrderDetail();
	}
};

// 点击催单
const onUrgeOrder = async () => {
	const params = {
		orderNo: route.query.orderNo,
		channelType: depositOrderDetail.value.depositWithdrawChannelType,
		thirdPayUrl: depositOrderDetail.value.thirdPayUrl,
	};
	const res = await walletApi.urgeOrder(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		isUrgeModalVisible.value = true;
		// 重新获取订单状态
		getDepositOrderDetail();
	}
};

// 撤销充值订单
const onCancelDepositOrder = async () => {
	console.log("route.query.orderNo", route.query.orderNo);
	const params = {
		orderNo: route.query.orderNo,
		channelType: depositOrderDetail.value.depositWithdrawChannelType,
		thirdPayUrl: depositOrderDetail.value.thirdPayUrl,
	};
	const res = await walletApi.cancelDepositOrder(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		clearInterval(startCountdown);
		if (!props.dialogType) {
			router.push("/recharge");
		} else {
			emit("CancelDepositOrder");
		}
	}
};

// 继续充值
const onContinueRecharge = () => {
	if (!props.dialogType) {
		router.replace("/recharge");
	} else {
		emit("ContinueRecharge");
	}
};

// 获取更新后的本地图片
const updateFiles = (newFiles: Array<{ name: string; preview: string }>) => {
	console.log("newFiles", newFiles);
	files.value = newFiles;
	console.log("cashFlowFileList", cashFlowFileList.value);
};

// 上传图片
const uploadImg = async (file: any) => {
	console.log("file", file);

	const formData = new FormData();
	formData.append("file", file);
	const res = await uploadApi.upload(formData);
	if (res.code === common.ResCode.SUCCESS) {
		cashFlowFileList.value.push(res.data);
		console.log("cashFlowFileList", cashFlowFileList.value);
	}
};

// 图片删除
const uploadDel = (newFiles: any) => {
	cashFlowFileList.value = newFiles;
};

// 倒计时函数
function startCountdown() {
	formattedTime.value = formatTime(depositOrderDetail.value.remindTime);
	const timer = setInterval(() => {
		if (depositOrderDetail.value.remindTime > 0) {
			depositOrderDetail.value.remindTime--;
			formattedTime.value = formatTime(depositOrderDetail.value.remindTime);
		} else {
			clearInterval(timer); // 倒计时结束，停止计时
		}
	}, 1000);
}

// 将秒数转化为时分秒格式
function formatTime(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// 获取状态名称
const getStatusLabel = () => {
	if (depositOrderDetail.value.customerStatus == "0") {
		return $.t('wallet["处理中"]');
	} else if (depositOrderDetail.value.customerStatus == "1") {
		return $.t('wallet["成功"]');
	} else if (depositOrderDetail.value.customerStatus == "2") {
		return $.t('wallet["失败"]');
	}
};

// 根据状态返回对应的类名
const getClass = computed(() => {
	switch (depositOrderDetail.value.customerStatus) {
		case "0":
			return "hint"; // 处理中
		case "1":
			return "success"; // 成功
		case "2":
			return "error"; // 失败
		default:
			return ""; // 默认类
	}
});

// 清除参数
const clearParams = () => {
	files.value = [];
	cashFlowFileList.value = [];
	cashFlowRemark.value = "";
};

// 清除倒计时
onUnmounted(() => {
	clearInterval(startCountdown);
});
</script>

<style scoped lang="scss">
.half_round_corner {
	border-radius: 0px 0px 12px 12px;
}

.header {
	display: flex;
	align-items: center;
	gap: 10px;
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;

	.label {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 24px;
		font-weight: 500;
	}
	.type_label {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 18px;
		font-weight: 500;
	}
	.icon {
		width: 18px;
		height: 18px;
	}
}

.container {
	padding: 20px;
	.info {
		display: grid;
		justify-content: center;
		gap: 10px;
		margin-top: 10px;
		.amount_info {
			display: flex;
			align-items: center;
			justify-content: center;

			.icon {
				width: 26px;
				height: 26px;
				margin-right: 10px;
			}
			.value {
				color: var(--Text_s);
				font-family: "DIN Alternate";
				font-size: 26px;
				font-weight: 700;
			}
			.label {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 22px;
				font-weight: 500;
			}
		}
		.date {
			width: 120px;
			height: 120px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
			background: url("../../../assets/zh-CN/wallet/time_bg.png") center center / 100% 100% no-repeat;

			span {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 17px;
				font-weight: 400;
			}
		}
		.tips {
			color: var(--Text1);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			.a {
				color: var(--F2);
				text-decoration: underline;
				cursor: pointer;
			}
		}
	}

	.form_info {
		max-width: 922px;
		position: relative;
		display: flex;
		gap: 1px;
		margin: 30px auto 30px;
		border-radius: 12px;
		background: var(--Bg1);
		border: 1px solid var(--Line_2);
		&::after {
			position: absolute;
			content: "";
			top: 50%;
			left: 50%;
			width: 1px;
			height: 142px;
			transform: translate(-50%, -50%);
			background: var(--Line_2);
		}
		.content {
			flex: 1;
			display: grid;
			padding: 20px 24px;
			gap: 14px;
			grid-auto-rows: min-content;
			.cell {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.label {
					color: var(--Text1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.value {
					display: flex;
					align-items: center;
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}
		}
	}
	.progress {
		display: flex;
		justify-content: space-between;
		.step {
			flex: 1;
			padding: 0px 10px;
			text-align: center;
			.icon {
				position: relative;
				width: 100%;

				.content {
					width: 26px;
					height: 26px;
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 auto;
					border-radius: 50%;
					background-color: #7d8086;
					span {
						color: var(--Text_a);
						text-align: center;
						font-family: "PingFang SC";
						font-size: 16px;
						font-weight: 500;
					}
					img {
						width: 26px;
						height: 26px;
					}
				}

				.line {
					position: absolute;
					content: "";
					top: 50%;
					right: calc(-50% + 10px);
					width: calc(100% - 40px);
					height: 4px;
					transform: translateY(-50%);
					border-radius: 8px;
					background: var(--Line_2);
				}
				.line_success {
					background: var(--Success);
				}
			}
			.label {
				margin-top: 14px;
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.value {
				margin-top: 2px;
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
		}
	}

	.upload_img_list {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		margin: 40px 0px 0px;
		.item_img {
			width: 100px;
			height: 100px;
			border-radius: 12px;
			border: 1px solid var(--Line_2);
		}
	}

	.btns {
		display: flex;
		justify-content: center;
		gap: 40px;
		margin-top: 30px;
		.cancel,
		.confirm {
			width: 240px;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			border-radius: 4px;
			cursor: pointer;
		}
		.cancel {
			border: 1px solid var(--Theme);
			color: var(--Theme);
		}
		.confirm {
			background: var(--Theme);
			color: var(--Text_a);
		}
	}
}

.success {
	color: var(--Success) !important;
}
.error {
	color: var(--F1) !important;
}
.hint {
	color: var(--F2) !important;
}

// 凭证弹窗
.Proof_container {
	width: 520px;
	background-color: var(--Bg1);
	border-radius: 12px;
	overflow: hidden;
	.Proof_header {
		position: relative;
		padding: 24px;
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 20px;
		font-weight: 500;
		box-sizing: border-box;

		i {
			position: absolute;
			top: 0px;
			right: 0px;
			display: block;
			width: 77px;
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom-left-radius: 12px;
			background-color: var(--Bg2);
			cursor: pointer;
			.icon {
				width: 30px;
				height: 30px;
			}
		}
	}
	.Proof_main {
		padding: 6px 24px 40px;
		.tips {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			.red {
				color: var(--Warn);
			}
		}
		.list {
			margin-top: 16px;
		}
		.form {
			display: grid;
			gap: 8px;
			margin: 16px 0px;

			.cell {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.label {
					color: var(--Text1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.value {
					color: var(--Text_s);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
			}
		}
		.cell_input {
			margin-top: 16px;
			.label {
				margin-bottom: 8px;
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				.s {
					font-size: 12px;
				}
			}
			textarea {
				width: 100%;
				height: 120px;
				margin: 0px;
				padding: 12px;
				border: 1px solid var(--Line_2);
				border-radius: 12px;
				background-color: var(--Bg1);
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				resize: none; /* 禁止拖拽调整大小，并隐藏右下角的三角图标 */
				overflow-y: auto; /* 当内容超出高度时显示垂直滚动条 */
				overflow-x: hidden; /* 隐藏水平滚动条，强制换行 */
				word-wrap: break-word; /* 让文本在宽度超出时自动换行 */
				text-align: left; /* 确保文本从左对齐 */
				vertical-align: top; /* 保证文本从上方开始排列 */
			}
			textarea:focus-visible {
				outline: none;
			}
		}

		.button {
			width: 220px;
			height: 48px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 40px auto 0px;
			border-radius: 8px;
			background-color: var(--Theme);
			color: var(--Text_a);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
			cursor: pointer;
		}
	}
}

// 加速弹窗
.urge_container {
	position: relative;
	width: 380px;
	height: 260px;
	padding: 20px;
	border-radius: 20px;
	background: var(--Bg1);
	.icon {
		position: absolute;
		top: -46px;
		left: 50%;
		transform: translateX(-50%);
		width: 174px;
		height: 116px;
		img {
			width: 100%;
			height: 100%;
		}
	}
	.text1 {
		margin-top: 57px;
		text-align: center;
		color: var(--Text_s);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 500;
	}

	.text2 {
		margin-top: 22px;
		color: var(--Text1);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 14px;
		font-weight: 400;
	}

	.button {
		width: 220px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 30px auto 0px;
		background: var(--Theme);
		color: var(--Text_a);
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		border-radius: 4px;
		cursor: pointer;
	}
}
</style>
