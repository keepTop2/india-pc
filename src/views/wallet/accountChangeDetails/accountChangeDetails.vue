<template>
	<div>
		<Card :header="dialogType ? false : true" :class="{ half_round_corner: dialogType }">
			<template #header>
				<div class="header">
					<span class="label" @click="router.back()">{{ !route.query.tradeType ? $t(`wallet['存款']`) : "" }}</span>
					<span class="label" @click="router.back()">{{ route.query.tradeType ? $t(`wallet['交易记录']`) : "" }}</span>
					<svg-icon class="icon" name="wallet-header_arrow" />
					<span class="type_label">{{ navTitle }}</span>
				</div>
			</template>
			<div class="container">
				<div class="info">
					<div class="amount_info" v-if="displayedAmount">
						<img class="icon" :src="amount_icon" alt="" />
						<!-- 动态显示金额 -->
						<span class="value">
							<!-- 显示正负号和格式化后的金额 -->
							{{ getPlusMinusSign() }}{{ common.thousands(common.formatAmount(Number(common.formatFloat(displayedAmount)))) }}
						</span>
						<span class="label ml_12">{{ mainCurrency }}</span>
					</div>
					<template
						v-if="
							depositOrderDetail.customerStatus == '0' &&
							(depositOrderDetail.depositWithdrawTypeCode == 'bank_card' || depositOrderDetail.depositWithdrawTypeCode == 'electronic_wallet')
						"
					>
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
					<div class="cell" v-for="item in fromFieldsList[route.query.tradeWayType]" :key="item.key">
						<span class="label">{{ $t(`wallet['${item.label}']`) }}</span>
						<!-- 值处理 -->
						<span class="value" :class="item.key === 'customerStatus' ? getClass : ''">
							<!-- 状态处理 -->
							<template v-if="item.key === 'customerStatus'">
								{{ getStatusLabel }}
							</template>
							<!-- 时间处理 -->
							<template v-else-if="timeKeys.includes(item.key)">
								{{ common.getYMDHms(depositOrderDetail[item.key as keyof typeof depositOrderDetail], "YYYY/MM/DD HH:mm:ss") || "--" }}
							</template>
							<!-- 复制处理 -->
							<template v-else-if="item.key === 'orderNo'">
								<span>{{ depositOrderDetail[item.key as keyof typeof depositOrderDetail] }}</span>
								<svg-icon
									v-if="depositOrderDetail[item.key as keyof typeof depositOrderDetail]"
									class="copy_icon curp"
									name="copy"
									size="16px"
									v-hover-svg
									@click="common.copy(depositOrderDetail[item.key as keyof typeof depositOrderDetail])"
								/>
							</template>
							<!-- 手续费处理 -->
							<template v-else-if="item.key === 'feeAmount'">
								{{ common.thousands(common.formatFloat(depositOrderDetail[item.key as keyof typeof depositOrderDetail])) }}
								<span>{{ mainCurrency }}</span>
							</template>
							<!-- 金额处理 -->
							<template v-else-if="amountKeys.includes(item.key)">
								{{ common.thousands(common.formatAmount(Number(common.formatFloat(depositOrderDetail[item.key as keyof typeof depositOrderDetail])))) }}
								<span>{{ getCurrencyLabel(item.key) }}</span>
							</template>
							<!-- 脱敏处理 -->
							<template v-else-if="item.key in maskKeys">
								{{ maskFunctions[item.key as MaskFieldKey](depositOrderDetail[item.key as keyof typeof depositOrderDetail]) }}
							</template>
							<!-- 默认展示 -->
							<template v-else>
								{{ depositOrderDetail[item.key as keyof typeof depositOrderDetail] }}
							</template>
						</span>
					</div>

					<!-- 银行卡提现 -->
					<template v-if="route.query.tradeWayType === 'bank_card_withdraw'">
						<template v-for="item in BankCardWithdrawalList">
							<div class="cell" v-if="depositOrderDetail[item.key as keyof depositOrderDetailRootObject]">
								<span class="label">{{ $t(`wallet['${item.label}']`) }}</span>
								<span class="value">
									<!-- 脱敏处理 -->
									<template v-if="item.key in maskKeys">
										<!-- 手机号拼接区号 -->
										<span v-if="item.key === 'userPhone'">{{ "+" + depositOrderDetail.areaCode }}</span>
										<span>{{ maskFunctions[item.key as MaskFieldKey](depositOrderDetail[item.key as keyof typeof depositOrderDetail]) }}</span>
									</template>
									<!-- 默认展示 -->
									<template v-else>
										{{ depositOrderDetail[item.key as keyof typeof depositOrderDetail] }}
									</template>
								</span>
							</div>
						</template>
					</template>

					<!-- 电子钱包提现 -->
					<template v-if="route.query.tradeWayType === 'electronic_wallet_withdraw'">
						<template v-for="item in EWalletList">
							<div class="cell" v-if="depositOrderDetail[item.key as keyof depositOrderDetailRootObject]">
								<span class="label">{{ $t(`wallet['${item.label}']`) }}</span>
								<span class="value">
									<!-- 脱敏处理 -->
									<template v-if="item.key in maskKeys">
										<!-- 手机号拼接区号 -->
										<span v-if="item.key === 'userPhone'">{{ "+" + depositOrderDetail.areaCode }}</span>
										<span>{{ maskFunctions[item.key as MaskFieldKey](depositOrderDetail[item.key as keyof typeof depositOrderDetail]) }}</span>
									</template>
									<!-- 默认展示 -->
									<template v-else>
										{{ depositOrderDetail[item.key as keyof typeof depositOrderDetail] }}
									</template>
								</span>
							</div>
						</template>
					</template>
				</div>
				<!-- 只有银行卡 电子钱包 存款才显示进度 -->
				<template v-if="route.query.tradeWayType === 'bank_card_recharge' || route.query.tradeWayType === 'electronic_wallet_recharge'">
					<div class="progress">
						<div class="step">
							<div class="icon">
								<div class="content">
									<img :src="success" alt="" />
								</div>
								<div class="line line_success"></div>
							</div>
							<div class="label">{{ $t(`wallet['创建充值订单']`) }}</div>
							<div class="value">{{ common.getYMDHms(depositOrderDetail?.createdTime, "YYYY/MM/DD HH:mm:ss") }}</div>
						</div>
						<div class="step">
							<div class="icon">
								<div class="content">
									<img :src="success" alt="" />
								</div>
								<div class="line" :class="{ line_success: depositOrderDetail.customerStatus != 0 }"></div>
							</div>
							<div class="label">{{ $t(`wallet['第三方商户处理中']`) }}</div>
							<div class="value">{{ $t(`wallet['更新于']`) }}{{ common.getYMDHms(depositOrderDetail?.updatedTime, "YYYY/MM/DD HH:mm:ss") }}</div>
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
				</template>
				<template v-else>
					<div class="btns">
						<div class="cancel" @click="router.back()">{{ $t(`wallet['返回']`) }}</div>
					</div>
				</template>
			</div>
		</Card>

		<!-- 上传凭证弹窗 -->
		<CommonDialog v-model="isProofModalVisible">
			<div class="Proof_container">
				<div class="Proof_header">
					<span>{{ $t(`wallet['上传凭证']`) }}</span>
					<i @click="isProofModalVisible = false">
						<svg-icon class="icon" name="common-close" />
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
							<div class="value" :class="getClass">{{ getStatusLabel }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['金额']`) }}</div>
							<div class="value">{{ common.formatFloat(depositOrderDetail?.applyAmount) }} {{ mainCurrency }}</div>
						</div>
						<div class="cell">
							<div class="label">{{ $t(`wallet['时间']`) }}</div>
							<div class="value">{{ common.getYMDHms(depositOrderDetail?.createdTime, "YYYY/MM/DD HH:mm:ss") }}</div>
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
	arriveAmount?: string;
	orderNo?: string;
	depositWithdrawWay?: string;
	depositWithdrawTypeCode?: string;
	depositWithdrawChannelType?: string;
	tradeCurrencyAmount?: number;
	applyAmount?: number;
	exchangeRate?: any;
	feeRate?: number;
	feeAmount?: number;
	customerStatus?: string | number;
	customerStatusText?: string;
	createdTime?: number;
	updatedTime?: number;
	remindTime?: number;
	accountName?: string;
	accountAddress?: any;
	voucherFlag?: number;
	cashFlowFile?: any;
	cashFlowFileList?: any;
	thirdPayUrl?: any;
	urgeOrder?: number;
	tradeWayType?: string;
	transferAmount?: number;
	areaCode?: string;
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

// 获取主货币类型
const mainCurrency = computed(() => UserStore.userInfo.mainCurrency);

const depositOrderDetail = ref({} as depositOrderDetailRootObject); // 订单接口详情
const formattedTime = ref<string>(""); // 格式化倒计时为时分秒格式的响应式变量
const isUrgeModalVisible = ref(false); // 订单加速弹窗
const isProofModalVisible = ref(false); // 上传凭证弹窗
const files = ref<Array<{ name: string; preview: string }>>([]); // 上传文件
const cashFlowFileList = ref([] as any); // 服务器上传文件
const cashFlowRemark = ref(""); // 留言

const fromFieldsList = {
	// 银行卡充值
	bank_card_recharge: [
		{ label: "状态", key: "customerStatus" }, // 充值状态
		{ label: "充值金额", key: "applyAmount" }, // 申请充值金额
		{ label: "手续费", key: "feeAmount" }, // 充值手续费
		{ label: "到账金额", key: "tradeCurrencyAmount" }, // 到账金额
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "申请时间", key: "createdTime" }, // 申请时间
		{ label: "充值方式", key: "depositWithdrawWay" }, // 充值方式
	],

	// 电子钱包充值
	electronic_wallet_recharge: [
		{ label: "状态", key: "customerStatus" }, // 充值状态
		{ label: "充值金额", key: "applyAmount" }, // 申请充值金额
		{ label: "手续费", key: "feeAmount" }, // 充值手续费
		{ label: "到账金额", key: "tradeCurrencyAmount" }, // 到账金额
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "申请时间", key: "createdTime" }, // 申请时间
		{ label: "充值方式", key: "depositWithdrawWay" }, // 充值方式
	],

	// 加密货币充值
	crypto_currency_recharge: [
		{ label: "状态", key: "customerStatus" }, // 充值状态
		{ label: "到账时间", key: "updatedTime" }, // 到账时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "存款方式", key: "depositWithdrawWay" }, // 存款方式
		{ label: "到账金额", key: "tradeCurrencyAmount" }, // 申请金额
		{ label: "手续费", key: "feeAmount" }, // 充值手续费
		{ label: "汇率", key: "exchangeRate" }, // 汇率
		{ label: "实际到账", key: "applyAmount" }, // 实际到账金额
	],

	// 上级转账
	superior_transfer: [
		{ label: "状态", key: "customerStatus" }, // 订单状态
		{ label: "转入时间", key: "updatedTime" }, // 转入时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "存款方式", key: "tradeWayTypeText" }, // 存款方式
		{ label: "上级代理", key: "superAgentAccount" }, // 上级代理账户
	],

	// 手动存款
	manual_up: [
		{ label: "状态", key: "customerStatus" }, // 订单状态
		{ label: "转入时间", key: "updatedTime" }, // 转入时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "存款方式", key: "tradeWayTypeText" }, // 存款方式
	],

	// 银行卡提现
	bank_card_withdraw: [
		{ label: "状态", key: "customerStatus" }, // 提现状态
		{ label: "申请时间", key: "cratedTime" }, // 申请时间
		{ label: "到账时间", key: "updatedTime" }, // 到账时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "手续费", key: "feeAmount" }, // 提现手续费
		{ label: "到账金额", key: "arriveAmount" }, // 到账金额
		{ label: "提款方式", key: "tradeWayTypeText" }, // 提款方式
		{ label: "银行名称", key: "bankName" }, // 银行名称
		{ label: "银行代码", key: "bankCode" }, // 银行代码
		{ label: "银行卡号", key: "bankCard" }, // 银行卡号
	],

	// 电子钱包提现
	electronic_wallet_withdraw: [
		{ label: "状态", key: "customerStatus" }, // 提现状态
		{ label: "申请时间", key: "cratedTime" }, // 申请时间
		{ label: "到账时间", key: "updatedTime" }, // 到账时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "手续费", key: "feeAmount" }, // 提现手续费
		{ label: "到账金额", key: "arriveAmount" }, // 到账金额
		{ label: "提款方式", key: "tradeWayTypeText" }, // 提款方式
	],

	// 加密货币提现
	crypto_currency_withdraw: [
		{ label: "状态", key: "customerStatus" }, // 提现状态
		{ label: "申请时间", key: "cratedTime" }, // 申请时间
		{ label: "到账时间", key: "updatedTime" }, // 到账时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "手续费", key: "feeAmount" }, // 提现手续费
		{ label: "汇率", key: "exchangeRate" }, // 汇率
		{ label: "到账金额", key: "arriveAmount" }, // 到账金额
		{ label: "提款方式", key: "tradeWayTypeText" }, // 提款方式
		{ label: "地址", key: "addressNo" }, // 提现地址
	],

	// 手动提现
	manual_down: [
		{ label: "状态", key: "customerStatus" }, // 提现状态
		{ label: "到账时间", key: "updatedTime" }, // 到账时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "提款方式", key: "tradeWayTypeText" }, // 提款方式
	],

	// 平台币转换
	platform_transfer: [
		{ label: "转换时间", key: "updatedTime" }, // 转换时间
		{ label: "订单号", key: "orderNo" }, // 订单编号
		{ label: "平台币转换金额", key: "arriveAmount" }, // 转换金额
		{ label: "汇率", key: "transferRate" }, // 转换汇率
	],
};

// 银行卡取款动态表单，单独判断
const BankCardWithdrawalList = [
	{
		label: "姓名",
		key: "userName",
	},
	{
		label: "省",
		key: "provinceName",
	},
	{
		label: "城市",
		key: "cityName",
	},
	{
		label: "详细地址",
		key: "detailAddress",
	},
	{
		label: "邮箱地址",
		key: "userEmail",
	},
	{
		label: "手机号",
		key: "userPhone",
	},
];

const EWalletList = [
	{
		label: "姓名",
		key: "userName",
	},
	{
		label: "账号",
		key: "userAccount",
	},
	{
		label: "手机号",
		key: "userPhone",
	},
];

// 定义通道方式映射表
const tradeWayConfig = {
	// 存款类型，包括银行卡充值、电子钱包充值、虚拟货币充值、人工充值、上级转账
	deposit: [
		"bank_card_recharge", // 银行卡充值
		"electronic_wallet_recharge", // 电子钱包充值
		"crypto_currency_recharge", // 虚拟货币充值
		"manual_up", // 人工充值
		"superior_transfer", // 上级转账
		"platform_transfer", // 平台币转换
	],
	// 提款类型，包括人工提款、银行卡提款、电子钱包提款、虚拟货币提款
	withdraw: [
		"manual_down", // 人工提款
		"bank_card_withdraw", // 银行卡提款
		"electronic_wallet_withdraw", // 电子钱包提款
		"crypto_currency_withdraw", // 虚拟货币提款
	],
	// 平台币转换类型
	platformTransfer: ["platform_transfer"], // 平台币转换
};

// 提取通用映射表，分别对应金额字段、标题
const fieldMap: Record<string, keyof typeof depositOrderDetail.value> = {
	crypto_currency_recharge: "applyAmount", // 虚拟货币充值时显示的申请金额字段
	crypto_currency_withdraw: "applyAmount", // 虚拟货币提现时显示的申请金额字段
	bank_card_recharge: "tradeCurrencyAmount", // 银行卡充值时显示的交易货币金额字段
	electronic_wallet_recharge: "tradeCurrencyAmount", // 电子钱包充值时显示的交易货币金额字段
	platform_transfer: "transferAmount", // 平台币转换时显示的转账金额字段
};

const titleMap: Record<string, string> = {
	...Object.fromEntries(tradeWayConfig.deposit.map((type) => [type, "存款详情"])),
	...Object.fromEntries(tradeWayConfig.withdraw.map((type) => [type, "提款详情"])),
	platform_transfer: "平台币转换详情",
};

// 通用函数：根据 tradeWayType 获取对应值
const getMappedValue = <T>(map: Record<string, T>, defaultValue: T): T => {
	return map[route.query.tradeWayType as string] || defaultValue;
};

// 计算显示的金额
const displayedAmount = computed(() => {
	const field = getMappedValue(fieldMap, "arriveAmount"); // 默认显示实际到账金额
	return depositOrderDetail.value[field];
});

// 获取页面标题
const navTitle = computed(() => {
	return getMappedValue(titleMap, ""); // 默认返回空字符串
});

// 判断加减符号
const getPlusMinusSign = () => {
	if (tradeWayConfig.deposit.includes(route.query.tradeWayType as string)) {
		return "+";
	}
	if (tradeWayConfig.withdraw.includes(route.query.tradeWayType as string)) {
		return "-";
	}
	return ""; // 默认返回空字符串
};

// 状态映射表
type Status = "0" | "1" | "2";
const statusMap: Record<Status, { label: string; className: string }> = {
	"0": { label: $.t('wallet["处理中"]'), className: "hint" },
	"1": { label: $.t('wallet["成功"]'), className: "success" },
	"2": { label: $.t('wallet["失败"]'), className: "error" },
};

// 获取状态名称
const getStatusLabel = computed(() => {
	const status = depositOrderDetail.value.customerStatus as Status | undefined; // 强制类型声明为 Status 或 undefined
	return (status && statusMap[status].label) || "";
});

// 根据状态返回对应的类名
const getClass = computed(() => {
	const status = depositOrderDetail.value.customerStatus as Status | undefined; // 强制类型声明为 Status 或 undefined
	return (status && statusMap[status].className) || "";
});

// 时间字段配置
const timeKeys = ["createdTime", "cratedTime", "updatedTime"];

// 金额字段配置
const amountKeys = ["arriveAmount", "applyAmount", "tradeCurrencyAmount"];

// 定义通用键类型
type MaskFieldKey = "bankCard" | "userAccount" | "addressNo" | "userPhone";

// 脱敏字段配置的类型
const maskKeys: Record<MaskFieldKey, boolean> = {
	bankCard: true, // 银行卡
	userAccount: true, // 电子钱包
	addressNo: true, // 虚拟货币地址
	userPhone: true, // 手机号
};

// 脱敏处理方法的类型
const maskFunctions: Record<MaskFieldKey, (value: any) => string> = {
	bankCard: common.bankCardHiding,
	userAccount: common.EWalletHiding,
	addressNo: common.USDTAddressHiding,
	userPhone: common.maskString,
};

// 根据字段动态获取货币单位
const getCurrencyLabel = (key: string) => {
	if (
		(route.query.tradeWayType === "crypto_currency_withdraw" && key === "arriveAmount") ||
		(route.query.tradeWayType === "crypto_currency_recharge" && key === "tradeCurrencyAmount")
	) {
		return "USDT";
	}
	return route.query.tradeWayType === "platform_transfer" ? UserStore.userInfo.platCurrencyName : UserStore.userInfo.mainCurrency;
};

onMounted(() => {
	const { query } = route;
	// 定义支持的充值类型
	const depositTypes = ["bank_card_recharge", "electronic_wallet_recharge"];
	const allRechargeTypes = [...depositTypes, "crypto_currency_recharge"];
	if (allRechargeTypes.includes(query.tradeWayType as string)) {
		nextTick(() => {
			getDepositOrderDetail();
		});
		if (depositTypes.includes(query.tradeWayType as string)) {
			pubsub.subscribe("/wallet/rechargeSuccessFail", rechargeSuccessFail);
		}
	} else {
		tradeRecordDetail();
	}
});

// 收到订单推送订阅
const rechargeSuccessFail = (data: depositOrderDetailRootObject) => {
	if (depositOrderDetail.value.orderNo !== data.orderNo) return; // 订单号不同则就退出
	Object.assign(depositOrderDetail.value, data);
	if (depositOrderDetail.value.customerStatus !== "0") {
		clearInterval(startCountdown);
	}
};

// 点击上传凭证
const openProofModal = () => {
	isProofModalVisible.value = true;
};

// 获取订单详情
const getDepositOrderDetail = async () => {
	const params = {
		orderNo: route.query.orderNo,
	};
	const res = await walletApi.depositOrderDetail(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		depositOrderDetail.value = res.data;
		startCountdown();
	}
};

// 获取存款订单详情
const tradeRecordDetail = async () => {
	const params = { tradeType: route.query.tradeType, tradeWayType: route.query.tradeWayType, orderNo: route.query.orderNo };
	const res = await walletApi.tradeRecordDetail(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		// 银行卡 电子钱包 虚拟货币 取款
		if (route.query.tradeWayType === "bank_card_withdraw" || route.query.tradeWayType === "electronic_wallet_withdraw" || route.query.tradeWayType === "crypto_currency_withdraw") {
			depositOrderDetail.value = res.data.withdrawOrderDetailVO || {};
		}
		// 人工加额
		if (route.query.tradeWayType === "manual_up" || route.query.tradeWayType === "manual_down") {
			depositOrderDetail.value = res.data.manualUpDownDetailVO || {};
		}
		// 上级转入转出
		if (route.query.tradeWayType === "superior_transfer") {
			depositOrderDetail.value = res.data.superTransferDetailVO || {};
		}
		// 平台币转换
		if (route.query.tradeWayType === "platform_transfer") {
			depositOrderDetail.value = res.data.platformTransferDetailVO || {};
		}
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
	border-bottom: 1px solid var(--Line-1);
	box-shadow: 0px 1px 0px 0px var(--Shadow-1);

	.label {
		color: var(--Text-s);
		font-family: "PingFang SC";
		font-size: 24px;
		font-weight: 500;
		cursor: pointer;
	}
	.type_label {
		color: var(--Text-s);
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
				color: var(--Text-s);
				font-family: "DIN Alternate";
				font-size: 26px;
				font-weight: 700;
			}
			.label {
				color: var(--Text-s);
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
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 17px;
				font-weight: 400;
			}
		}
		.tips {
			color: var(--Text-1);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			.a {
				color: var(--F-2);
				text-decoration: underline;
				cursor: pointer;
			}
		}
	}

	.form_info {
		max-width: 922px;
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 1fr); /* 每行两个单元格 */
		row-gap: 14px;
		margin: 30px auto 30px;
		padding: 20px;
		border-radius: 12px;
		background: var(--Bg-1);
		border: 1px solid var(--Line-2);
		&::after {
			position: absolute;
			content: "";
			top: 50%;
			left: 50%;
			width: 1px;
			height: calc(100% - 40px);
			transform: translate(-50%, -50%);
			background: var(--Line-2);
		}

		.cell {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			&:nth-child(odd) {
				padding-right: 20px;
			}
			&:nth-child(even) {
				padding-left: 20px;
			}
			.label {
				color: var(--Text-1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.value {
				display: flex;
				align-items: center;
				gap: 10px;
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
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
						color: var(--Text-a);
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
					background: var(--Line-2);
				}
				.line_success {
					background: var(--success);
				}
			}
			.label {
				margin-top: 14px;
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
			.value {
				margin-top: 2px;
				color: var(--Text-1);
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
			border: 1px solid var(--Line-2);
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
			color: var(--Text-a);
		}
	}
}

.success {
	color: var(--success) !important;
}
.error {
	color: var(--F-1) !important;
}
.hint {
	color: var(--F-2) !important;
}

// 凭证弹窗
.Proof_container {
	width: 520px;
	background-color: var(--Bg-1);
	border-radius: 12px;
	overflow: hidden;
	.Proof_header {
		position: relative;
		padding: 24px;
		color: var(--Text-s);
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
			background-color: var(--Bg-2);
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
			color: var(--Text-s);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			.red {
				color: var(--F-1);
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
					color: var(--Text-1);
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
				}
				.value {
					color: var(--Text-s);
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
				color: var(--Text-1);
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
				border: 1px solid var(--Line-2);
				border-radius: 12px;
				background-color: var(--Bg-1);
				color: var(--Text-s);
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
			color: var(--Text-a);
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
	background: var(--Bg-1);
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
		color: var(--Text-s);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 500;
	}

	.text2 {
		margin-top: 22px;
		color: var(--Text-1);
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
		color: var(--Text-a);
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		border-radius: 4px;
		cursor: pointer;
	}
}
</style>
