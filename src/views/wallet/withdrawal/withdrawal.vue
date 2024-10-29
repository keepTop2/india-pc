<template>
	<div>
		<Card :header="true">
			<template #header>
				<div class="header">{{ $t(`wallet['提款']`) }}</div>
			</template>
			<div class="container">
				<div class="amount_list">
					<div class="amount_info">
						<div class="label">{{ $t(`wallet['中心钱包']`) }}</div>
						<div class="value">{{ common.formatAmount(UserStore.userInfo.totalBalance, 8) }}</div>
						<div class="icon">
							<img :src="balance_icon" alt="" />
						</div>
					</div>
					<div class="amount_info">
						<div class="label">{{ $t(`wallet['冻结金额']`) }}</div>
						<div class="value">{{ common.formatFloat(state.freezeAmount) }}</div>
						<div class="icon">
							<img :src="freeze_balance_icon" alt="" />
						</div>
					</div>
				</div>
			</div>
		</Card>

		<Card>
			<div class="container mt_20">
				<!-- 提款方式 -->
				<div class="title">{{ $t(`wallet['提款方式']`) }}</div>
				<div class="list">
					<div
						class="item"
						:class="{ pay_active: item.withdrawTypeCode == withdrawWayData?.withdrawTypeCode && item.networkType == withdrawWayData?.networkType }"
						v-for="item in withdrawWayList"
						@click="onRechargeWay(item)"
					>
						<div class="tag" v-if="item.recommendFlag == 1">{{ $t(`wallet['推荐']`) }}</div>
						<img class="icon" v-lazy-load="item.wayIcon" alt="" />
						<div class="label">{{ item.withdrawWay }}</div>
					</div>
				</div>

				<!-- 收款信息 -->
				<div class="title mt_20">{{ $t(`wallet['收款信息']`) }}</div>
				<div class="form_container">
					<!-- 动态表单 -->
					<component ref="childRef" :is="componentsMapsName[withdrawWayData?.withdrawTypeCode]" :withdrawWayData="withdrawWayData" :withdrawWayConfig="withdrawWayConfig" />
					<div class="tips">
						<svg-icon class="icon" name="wallet-help" />
						<p>
							{{ $t(`wallet['注意']`) }}
							<span>{{ $t(`wallet['联系客服']`) }}</span>
						</p>
					</div>
				</div>

				<!-- 手机号提款验证 -->
				<template v-if="withdrawWayData.withdrawTypeCode !== 'crypto_currency'">
					<template v-if="!UserStore.getUserGlobalSetInfo.isSetPwd && UserStore.getUserGlobalSetInfo.phone">
						<div class="title mt_20">{{ $t(`wallet['手机号验证']`) }}</div>
						<div class="form_container">
							<div class="form">
								<div class="cell disabled_cell">
									<div class="disabled_label">{{ $t(`wallet['手机号']`) }}</div>
									<div class="disabled_value">{{ UserStore.getUserGlobalSetInfo.areaCode }}&nbsp;&nbsp;{{ common.maskString(UserStore.getUserGlobalSetInfo?.phone) }}</div>
									<div class="disabled_btn">
										<CaptchaButton ref="captchaButton" :disabled="captchaDisabled" @onCaptcha="onCaptcha" />
									</div>
								</div>
								<div class="cell">
									<input v-model="state.smsCode" type="text" :placeholder="$t(`wallet['请输入验证码']`)" />
								</div>
							</div>
						</div>
					</template>
				</template>

				<!-- 提款金额 -->
				<div class="title mt_20">{{ $t(`wallet['提款金额']`) }}</div>
				<div class="footer_form mt_16">
					<div class="cell">
						<input
							class="bold_input"
							v-model="state.amount"
							type="text"
							:placeholder="`${withdrawWayConfig.withdrawMinAmount ?? 0} ${UserStore.userInfo.mainCurrency} ~ ${withdrawWayConfig.withdrawMaxAmount ?? 0} ${
								UserStore.userInfo.mainCurrency
							} `"
							@input="calculateFeeAndEstimatedAmount"
						/>
						<div class="all">
							<span @click="state.amount = UserStore.userInfo.totalBalance">{{ $t(`wallet['全部金额']`) }}</span>
						</div>
					</div>
					<div v-if="errorMessage" class="error_text mt_9">{{ errorMessage }}</div>
					<!-- 银行卡 电子钱包 预计到账计算 -->
					<template v-else>
						<div class="amount_info mt_4">
							<div class="item">
								<span class="label">{{ $t(`wallet['预计到账']`) }}</span>
								<span class="value">&nbsp;{{ common.formatFloat(estimatedAmount) }}</span>
								<span class="label" v-if="withdrawWayData.withdrawTypeCode !== 'crypto_currency'">&nbsp;{{ UserStore.userInfo.mainCurrency }}</span>
								<span class="label" v-else>&nbsp;USDT</span>
							</div>
							<div class="item">
								<span class="label">{{ $t(`wallet['手续费']`) }}({{ withdrawWayConfig.feeRate }}%):</span>
								<span class="label">&nbsp;{{ common.formatFloat(feeAmount) }}</span>
								<span class="label" v-if="withdrawWayData.withdrawTypeCode !== 'crypto_currency'">&nbsp;{{ UserStore.userInfo.mainCurrency }}</span>
								<span class="label" v-else>&nbsp;USDT</span>
							</div>
						</div>
						<!-- 虚拟币预计到账计算 -->
						<div v-if="withdrawWayData.withdrawTypeCode === 'crypto_currency'" class="amount_info">
							<div class="item">
								<span class="value">≈{{ common.formatFloat(Number(state.amount) - Math.trunc((Number(state.amount) * withdrawWayConfig.feeRate) / 100)) }}</span>
								<span class="value">&nbsp;{{ UserStore.userInfo.mainCurrency }}</span>
							</div>
							<div class="item">
								<span class="label">{{ $t(`wallet['当前汇率']`) }}</span>
								<span class="label">:&nbsp;</span>
								<span class="label">{{ exchangeRate }}</span>
							</div>
						</div>
					</template>

					<Button class="mt_40" :type="buttonType" @click="onWithdrawApply">{{ $t('wallet["立即存款"]') }}</Button>

					<i18n-t class="tips mt_10" keypath="wallet['提示']" :tag="'p'">
						<template v-slot:value>
							<span class="value"> {{ withdrawWayConfig.singleDayRemindWithdrawCount ?? 0 }} </span>
						</template>
						<template v-slot:amount>
							<span class="value"> {{ withdrawWayConfig.singleDayRemindMaxWithdrawAmount ?? 0 }} </span>
						</template>
						<template v-slot:currency>
							<span> {{ UserStore.userInfo.mainCurrency }} </span>
						</template>
					</i18n-t>
				</div>
			</div>
		</Card>
	</div>
	<!-- 交易密码弹窗 -->
	<PassWordDialog v-model:modelValue="passWordShow" v-model:password="state.withdrawPassWord" @confirm="onTransactionPasswordEntered"></PassWordDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import balance_icon from "../../../assets/zh-CN/wallet/balance_icon.png";
import freeze_balance_icon from "../../../assets/zh-CN/wallet/freeze_balance_icon.png";
import Card from "../components/card.vue";
import PassWordDialog from "../components/passWord.vue";
import BankCard from "./components/BankCard/BankCard.vue";
import EWallet from "./components/EWallet/EWallet.vue";
import VirtualCurrency from "./components/VirtualCurrency/VirtualCurrency.vue";
import { walletApi } from "/@/api/wallet";
import { loginApi } from "/@/api/login";
import common from "/@/utils/common";
import { useUserStore } from "/@/stores/modules/user";
import { i18n } from "/@/i18n/index";
import showToast from "/@/hooks/useToast";
const UserStore = useUserStore();
const $: any = i18n.global;

// 定义组件映射
const componentsMapsName = {
	bank_card: BankCard,
	electronic_wallet: EWallet,
	crypto_currency: VirtualCurrency, // 修复: 应该是 'usdt_trc20' 而不是 'rechargeTypeCode'
} as any;

interface withdrawWayDataRootObject {
	withdrawTypeCode: string;
	id: string;
	withdrawWay: string;
	wayIcon: string;
	wayFee: number;
	quickAmount: string;
	recommendFlag: number;
	networkType: string;
	currencyCode: string;
}

const withdrawWayData = ref({} as withdrawWayDataRootObject); // 当前选择的支付方式
const withdrawWayList = ref([] as withdrawWayDataRootObject[]); // 支付方式列表
const withdrawWayConfig = ref({
	withdrawMinAmount: 0,
	withdrawMaxAmount: 1000,
} as any); // 支付方式列表

const childRef = ref(null) as any;
const state = reactive({
	freezeAmount: "",
	withdrawPassWord: "" as string,
	amount: "" as string | number,
	smsCode: "" as string | number,
} as any);

const feeAmount = ref(0); // 手续费
const estimatedAmount = ref(0); // 预计到账金额
const exchangeRate = ref(0); // 预计到账金额

const passWordShow = ref(false);

const captchaButton = ref<{
	startCountdown: () => void;
} | null>(null);

const errorMessage = computed(() => {
	const amount = parseFloat(state.amount as string);
	// 检查是否为有效数字
	if (isNaN(amount)) {
		return "";
	}
	// 获取账户余额
	const totalBalance = UserStore.userInfo.totalBalance;
	// 判断输入的金额
	if (amount > totalBalance || !totalBalance || totalBalance === 0) {
		return $.t(`wallet["余额不足"]`);
	} else if (amount < withdrawWayConfig.value.withdrawMinAmount) {
		return `${$.t('wallet["单次最低提款"]')}: ${withdrawWayConfig.value.withdrawMinAmount} ${UserStore.userInfo.mainCurrency}`;
	} else if (amount > withdrawWayConfig.value.withdrawMaxAmount) {
		return `${$.t('wallet["单次最高提款"]')}: ${withdrawWayConfig.value.withdrawMaxAmount} ${UserStore.userInfo.mainCurrency}`;
	}
	// return "";
});

// 验证码按钮禁用状态
const captchaDisabled = computed(() => {
	// if (state.type === "email") return !isEmailValid.value || state.email === "";
	// if (state.type === "phone") return !isPhoneValid.value || state.phone === "";
	return false;
});

const buttonType = computed(() => {
	// 检查手机号是否有效（仅在银行卡和电子钱包表单中使用）
	const isPhoneValid = withdrawWayData.value.withdrawTypeCode !== "crypto_currency" && childRef.value?.isPhoneValid;

	// 获取当前的提现类型
	const withdrawTypeCode = withdrawWayData.value.withdrawTypeCode;

	// 定义 requiredFields 和 dynamicFields
	let requiredFields: string[] = [];
	let dynamicFields = {} as any;
	let smsCode = "";

	// 动态构建表单字段
	const buildDynamicFields = () => {
		// 从 withdrawWayConfig 中获取 collectInfoVOS，如果没有则默认为空数组
		const collectInfoVOS = withdrawWayConfig.value.collectInfoVOS || [];
		// 使用 reduce 方法遍历 collectInfoVOS 数组
		return collectInfoVOS.reduce((acc: any, { filedCode, checkFlag }: any) => {
			// 检查 checkFlag 是否为真，并且 filedCode 是否存在于 childRef.value.formParams 中
			if (checkFlag && filedCode in (childRef.value?.formParams || {})) {
				// 如果条件满足，将 childRef.value.formParams 中 filedCode 对应的值加入到累积对象 acc 中
				// 如果该值为 undefined，则使用空字符串作为默认值
				acc[filedCode] = childRef.value?.formParams?.[filedCode] || "";
			}
			// 返回累积对象，供下次迭代使用
			return acc;
		}, {}); // 初始值为一个空对象
	};

	// 添加 SMS 代码的检查
	const addSmsCodeCheck = () => {
		if (!UserStore.getUserGlobalSetInfo.isSetPwd && UserStore.getUserGlobalSetInfo.phone) {
			smsCode = childRef.value?.formParams?.smsCode || "";
			requiredFields.push("smsCode");
			dynamicFields.smsCode = state.smsCode;
		}
	};

	// 根据提现类型动态处理表单
	switch (withdrawTypeCode) {
		case "bank_card":
			dynamicFields = buildDynamicFields();
			requiredFields = Object.keys(dynamicFields);
			addSmsCodeCheck();
			break;

		case "electronic_wallet":
			dynamicFields = buildDynamicFields();
			requiredFields = Object.keys(dynamicFields);
			addSmsCodeCheck();
			break;

		case "crypto_currency":
			dynamicFields = buildDynamicFields();
			requiredFields = Object.keys(dynamicFields);
			break;

		default:
			break;
	}
	console.log("requiredFields", requiredFields);
	console.log("dynamicFields", dynamicFields);
	// 检查所有属性是否有值
	const allFieldsHaveValue = requiredFields.every((key) => dynamicFields[key] !== undefined && dynamicFields[key] !== "");
	// console.log("errorMessage.value", errorMessage.value);
	// console.log("state.amount", state.amount);
	// console.log("allFieldsHaveValue", allFieldsHaveValue);
	// console.log("requiredFields", requiredFields.includes("userPhone") && !isPhoneValid && withdrawTypeCode !== "crypto_currency");
	// 按钮状态判断
	if (errorMessage.value || !state.amount || !allFieldsHaveValue || (requiredFields.includes("userPhone") && !isPhoneValid && withdrawTypeCode !== "crypto_currency")) {
		return "disabled";
	} else {
		return "default";
	}
});

// 计算手续费和预计到账金额
const calculateFeeAndEstimatedAmount = () => {
	// 将输入的 amount 转换为数字
	let amount = Number(state.amount);
	let isCrypto = withdrawWayData.value.withdrawTypeCode === "crypto_currency";
	let feeRate = withdrawWayConfig.value.feeRate;
	let maxWithdrawAmount = withdrawWayConfig.value.singleDayRemindMaxWithdrawAmount;
	let remainingWithdrawCount = withdrawWayConfig.value.singleDayRemindWithdrawCount;

	// 检查是否满足免费提款条件
	if (isNaN(amount) || (remainingWithdrawCount > 0 && amount <= maxWithdrawAmount)) {
		feeAmount.value = 0; // 免费提款条件下手续费为0
	} else {
		// 计算手续费
		feeAmount.value = isCrypto ? Math.trunc(Math.trunc((amount * feeRate) / 100) / exchangeRate.value) : (amount * feeRate) / 100;
	}
	// 预计到账金额计算
	estimatedAmount.value = isCrypto
		? Number(common.formatFloat(Number(state.amount) - Math.trunc((Number(state.amount) * feeRate) / 100))) / exchangeRate.value
		: amount - feeAmount.value;
};

// 获取冻结金额
const getUserBalance = async () => {
	const res = await walletApi.getUserBalance().catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		state.freezeAmount = res.data.freezeAmount;
	}
};

// 交易密码输入完成
const onTransactionPasswordEntered = () => {
	passWordShow.value = false;
	if (state.withdrawPassWord.length === 6) {
		const params = {
			amount: state.amount,
			withdrawWayId: withdrawWayData.value.id,
			withdrawPassWord: state.withdrawPassWord,
			...childRef.value?.formParams,
		};
		getWithdrawApply(params);
	}
};

// 会员提款申请
const onWithdrawApply = async () => {
	if (UserStore.getUserGlobalSetInfo.isSetPwd) {
		passWordShow.value = true;
	} else if (UserStore.getUserGlobalSetInfo.phone) {
		const params = {
			amount: state.amount,
			withdrawWayId: withdrawWayData.value.id,
			...childRef.value?.formParams,
		};
		getWithdrawApply(params);
	}
};

const getWithdrawApply = async (params) => {
	const res = await walletApi.withdrawApply(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		// showToast($.t('withdraw["申请成功"]'));
		clearParams();
	}
};

// 选择支付方式时的处理
const onRechargeWay = (item: {
	withdrawTypeCode: string;
	id: string;
	withdrawWay: string;
	wayIcon: string;
	wayFee: number;
	quickAmount: string;
	recommendFlag: number;
	networkType: string;
	currencyCode: string;
}) => {
	withdrawWayData.value = item;
	clearParams();
	getWithdrawConfig(); // 获取通道配置

	if (item.withdrawTypeCode == "crypto_currency") {
		getWithdrawExchange();
	}
};

// 获取支付方式列表
const getRechargeWayList = async () => {
	const res = await walletApi.withdrawWayList().catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		withdrawWayList.value = res.data; // 存储支付方式列表
		withdrawWayData.value = res.data[0]; // 默认选择第一个支付方式
		getWithdrawConfig(); // 获取通道配置
	}
};

// 获取通道配置
const getWithdrawConfig = async () => {
	withdrawWayConfig.value = {};
	const params = {
		withdrawWayId: withdrawWayData.value.id,
	};
	const res = await walletApi.getWithdrawConfig(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		withdrawWayConfig.value = res.data;
	}
};

// 获取提款汇率
const getWithdrawExchange = async () => {
	const res = await walletApi.getWithdrawExchange().catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		exchangeRate.value = res.data;
	}
};

// 发送验证码
const onCaptcha = async () => {
	// console.log("点击发送验证码");
	const params = { userAccount: UserStore.getUserInfo.userAccount, phone: UserStore.getUserGlobalSetInfo.phone, areaCode: UserStore.getUserGlobalSetInfo.areaCode };
	const res = await loginApi.sendSms(params);
	if (res.code === common.ResCode.SUCCESS) {
		captchaButton.value?.startCountdown();
	} else {
		showToast(res.message);
	}
};

// 初始化数据
getRechargeWayList();
getWithdrawExchange();
getUserBalance();

// 清空表单参数
const clearParams = () => {
	Object.keys(state).forEach((key) => {
		state[key] = ""; // 将每个属性设置为空字符串
	});
	feeAmount.value = 0;
	estimatedAmount.value = 0;
	childRef.value?.clearParams();
};
</script>

<style scoped lang="scss">
@import url("./components/formScss.scss");

.header {
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;
	color: var(--Text_s);
	font-family: "PingFang SC";
	font-size: 24px;
	font-weight: 500;
}

.container {
	padding: 20px;
	.amount_list {
		display: flex;
		gap: 16px;
		.amount_info {
			flex: 1;
			display: grid;
			grid-template-columns: 1fr auto; /* 左侧自适应，右侧固定 */
			padding: 20px 30px;
			background: url("../../../assets/zh-CN/wallet/amount_info_bg.png") center center / 100% 100% no-repeat;
			.label {
				grid-column: 1 / 2; /* 在左侧 */
				color: var(--Text_a, #fff);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 400;
			}

			.value {
				grid-column: 1 / 2; /* 在左侧 */
				color: var(--Text_s);
				font-family: "DIN Alternate";
				font-size: 28px;
				font-weight: 700;
			}

			.icon {
				grid-row: 1 / span 2;
				grid-column: 3 / 3;
				width: 66px;
				height: 66px;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.title {
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 18px;
		font-weight: 500;
	}
	.list {
		margin-top: 20px;
		display: flex;
		flex-wrap: wrap;
		column-gap: 45px;
		row-gap: 16px;
		.item {
			position: relative;
			width: 164px;
			height: 87px;
			padding: 10px;
			border-radius: 12px;
			border: 1px solid var(--Line_2);
			cursor: pointer;
			box-sizing: border-box;
			.tag {
				position: absolute;
				top: 0px;
				right: 0px;
				min-width: 40px;
				padding: 1px 10px;
				border-radius: 0px 10px;
				background: #ff284b;
				color: #fff;
				font-family: "PingFang SC";
				font-size: 12px;
				font-weight: 500;
			}
			.icon {
				display: block;
				width: 70px;
				height: 32px;
				margin: 7px auto 0px;
				border-radius: 7px;
			}
			.label {
				margin-top: 6px;
				color: var(--Text1);
				text-align: center;
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				text-align: center;
			}
		}
		.pay_active {
			transition: all 0.2s;
			border: 1px solid var(--Theme);
			.label {
				color: var(--Theme);
			}
		}
	}
	.form_container {
		display: grid;
		gap: 16px;
		margin-top: 16px;
		padding: 20px;
		border-radius: 12px;
		border: 1px solid var(--Line_2);

		.tips {
			display: flex;
			gap: 8px;
			.icon {
				width: 17px;
				height: 17px;
			}
			p {
				color: var(--Text2_1);
				font-family: "PingFang SC";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
			span {
				color: var(--F2);
				text-decoration-line: underline;
			}
		}
	}
}
.error_text {
	color: var(--F1);
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
}

.amount_info {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.label {
		color: var(--Text2_1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
	.value {
		color: var(--F1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 600;
	}
}

.tips {
	color: var(--Text2_1);
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
	.value {
		color: var(--F1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
}
</style>
