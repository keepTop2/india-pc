<template>
	<div class="withdrawal_container">
		<Card :header="dialogType ? false : true" :class="{ half_round_corner: dialogType }">
			<template #header>
				<div class="header">{{ $t(`wallet['提款']`) }}</div>
			</template>
			<div class="container" :class="{ dialogType_fixed: dialogType }">
				<div :class="{ dialogType_fixed_container: dialogType }">
					<div class="amount_list">
						<div class="amount_info" :style="{ backgroundImage: `url(${resources.amount_info_bg})` }">
							<div class="label">{{ $t(`wallet['中心钱包']`) }}</div>
							<div class="value">{{ common.formatAmount(Number(state.totalBalance), 8) }}</div>
							<div class="icon">
								<img :src="balance_icon" alt="" />
							</div>
						</div>
						<div class="amount_info" :style="{ backgroundImage: `url(${resources.amount_info_bg})` }">
							<div class="label">{{ $t(`wallet['冻结金额']`) }}</div>
							<div class="value">{{ common.formatFloat(state.freezeAmount) }}</div>
							<div class="icon">
								<img :src="freeze_balance_icon" alt="" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>

		<Card :class="!dialogType ? 'mt_20' : 'mt_166'" class="flex">
			<div class="container">
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
					<div class="form_main">
						<component ref="childRef" :is="componentsMapsName[withdrawWayData?.withdrawTypeCode]" :withdrawWayData="withdrawWayData" :withdrawWayConfig="withdrawWayConfig" />
					</div>
					<div class="tips">
						<svg-icon class="icon" name="wallet-help" />
						<p>
							{{ $t(`wallet['注意']`) }}
							<span @click="common.getSiteCustomerChannel">{{ $t(`wallet['联系客服']`) }}</span>
						</p>
					</div>
				</div>

				<!-- 手机号提款验证 -->
				<template v-if="!UserStore.getUserGlobalSetInfo.isSetPwd && UserStore.getUserGlobalSetInfo.phone">
					<div class="title mt_20">{{ $t(`wallet['手机号验证']`) }}</div>
					<div class="form_container">
						<div class="form">
							<div class="cell disabled_cell">
								<div class="disabled_label">{{ $t(`wallet['手机号']`) }}</div>
								<div class="disabled_value">{{ UserStore.getUserGlobalSetInfo.areaCode }}&nbsp;&nbsp;{{ common.maskString(UserStore.getUserGlobalSetInfo?.phone) }}</div>
								<div class="disabled_btn">
									<CaptchaButton ref="captchaButton" @onCaptcha="onCaptcha" />
								</div>
							</div>
							<div class="cell">
								<input v-model="state.smsCode" type="text" :placeholder="$t(`wallet['请输入验证码']`)" />
							</div>
						</div>
					</div>
				</template>

				<!-- 提款金额 -->
				<div class="title mt_20">{{ $t(`wallet['提款金额']`) }}</div>
				<div class="footer_form mt_16">
					<div class="cell">
						<input
							class="bold_input"
							v-model="state.amount"
							type="text"
							@input="($event.target as HTMLInputElement).value = ($event.target as HTMLInputElement).value.replace(/^0+(\d)|[^\d]+/g, '$1')"
							:placeholder="`${withdrawWayConfig.withdrawMinAmount ?? 0} ${UserStore.userInfo.mainCurrency} ~ ${withdrawWayConfig.withdrawMaxAmount ?? 0} ${
								UserStore.userInfo.mainCurrency
							} `"
						/>
						<div class="all">
							<span @click="state.amount = Math.trunc(Number(state.totalBalance))">{{ $t(`wallet['全部金额']`) }}</span>
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
								<span class="label">&nbsp;{{ Math.trunc(Number(feeAmount)) }}</span>
								<span class="label" v-if="withdrawWayData.withdrawTypeCode !== 'crypto_currency'">&nbsp;{{ UserStore.userInfo.mainCurrency }}</span>
								<span class="label" v-else>&nbsp;USDT</span>
							</div>
						</div>
						<!-- 虚拟币预计到账计算 -->
						<div v-if="withdrawWayData.withdrawTypeCode === 'crypto_currency'" class="amount_info">
							<div class="item">
								<span class="value">≈{{ common.formatFloat(approximateAmount) }}</span>
								<span class="value">&nbsp;{{ UserStore.userInfo.mainCurrency }}</span>
							</div>
							<div class="item">
								<span class="label">{{ $t(`wallet['当前汇率']`) }}</span>
								<span class="label">:&nbsp;</span>
								<span class="label">{{ exchangeRate }}</span>
							</div>
						</div>
					</template>

					<Button class="mt_40" :type="buttonType" @click="onWithdrawApply">{{ $t('wallet["立即提款"]') }}</Button>

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
	<PassWordDialog :dialogType="dialogType" v-model:modelValue="passWordShow" v-model:password="state.withdrawPassWord" @confirm="onTransactionPasswordEntered"></PassWordDialog>
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
import { useRouter } from "vue-router";
import { i18n } from "/@/i18n/index";
import showToast from "/@/hooks/useToast";
import { useTipsDialog } from "/@/hooks/useTipsDialog";
import pubsub from "/@/pubSub/pubSub";
import { useThemeResources } from "/@/views/wallet/utils/themeResources";
const resources = useThemeResources();
const UserStore = useUserStore();
const $: any = i18n.global;
const router = useRouter();

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

const props = withDefaults(
	defineProps<{
		dialogType?: boolean;
	}>(),
	{
		dialogType: false, // 设置默认值为 false
	}
);

const withdrawWayData = ref({} as withdrawWayDataRootObject); // 当前选择的支付方式
const withdrawWayList = ref([] as withdrawWayDataRootObject[]); // 支付方式列表
const withdrawWayConfig = ref({
	withdrawMinAmount: 0,
	withdrawMaxAmount: 1000,
} as any); // 支付方式列表

const childRef = ref(null) as any;
const state = reactive({
	totalBalance: "",
	freezeAmount: "",
	withdrawPassWord: "" as string,
	amount: "" as string | number,
	smsCode: "" as string | number,
} as any);

const exchangeRate = ref(0); // 预计到账金额

const passWordShow = ref(false);

// const loadingShow = ref(false);

const captchaButton = ref<{
	startCountdown: () => void;
	stopCountdown: () => void;
} | null>(null);

const errorMessage = computed(() => {
	const amount = parseFloat(state.amount as string);
	// 检查是否为有效数字
	if (isNaN(amount)) {
		return "";
	}
	// 获取账户余额
	const totalBalance = state.totalBalance;
	// 判断输入的金额
	if (amount > totalBalance || !totalBalance || totalBalance === 0) {
		return $.t(`wallet["余额不足"]`);
	} else if (amount < withdrawWayConfig.value.withdrawMinAmount) {
		return `${$.t('wallet["单次最低提款"]')}: ${UserStore.userInfo.currencySymbol} ${withdrawWayConfig.value.withdrawMinAmount}`;
	} else if (amount > withdrawWayConfig.value.withdrawMaxAmount) {
		return `${$.t('wallet["单次最高提款"]')}: ${UserStore.userInfo.currencySymbol} ${withdrawWayConfig.value.withdrawMaxAmount}`;
	}
	// return "";
});

// 计算手续费
const feeAmount = computed(() => {
	const amount = Number(state.amount);
	const isCrypto = withdrawWayData.value.withdrawTypeCode === "crypto_currency";
	const { singleDayRemindMaxWithdrawAmount: maxWithdrawAmount, singleDayRemindWithdrawCount: remainingWithdrawCount, feeRate } = withdrawWayConfig.value;
	if (isNaN(amount) || amount <= 0 || (isCrypto && (!exchangeRate.value || exchangeRate.value <= 0))) {
		return 0;
	}
	const meetsFreeCondition = remainingWithdrawCount > 0 && amount <= maxWithdrawAmount;
	if (meetsFreeCondition) {
		return 0;
	}
	const calculatedFee = common.div(common.mul(amount, feeRate), 100);
	return isCrypto ? Math.trunc(common.div(calculatedFee, exchangeRate.value)) : calculatedFee;
});

// 计算预计到账金额
const estimatedAmount = computed(() => {
	const amount = Number(state.amount);
	const isCrypto = withdrawWayData.value.withdrawTypeCode === "crypto_currency";
	if (!isCrypto) {
		return common.sub(amount, feeAmount.value);
	} else {
		return common.sub(common.div(amount, exchangeRate.value), feeAmount.value);
	}
});

// 虚拟币约等于到账额度
const approximateAmount = computed(() => {
	const amount = Number(state.amount);
	return common.sub(amount, common.mul(feeAmount.value, exchangeRate.value));
});

// 获取冻结金额
const getUserBalance = async () => {
	const res = await walletApi.getUserBalance().catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		state.totalBalance = res.data.balance;
		state.freezeAmount = res.data.freezeAmount;
	}
};

// 按钮高亮
const buttonType = computed(() => {
	// 检查手机号是否有效（仅在银行卡和电子钱包表单中使用）
	const isPhoneValid = withdrawWayData.value.withdrawTypeCode !== "crypto_currency" && childRef.value?.isPhoneValid;

	// 获取当前的提现类型
	const withdrawTypeCode = withdrawWayData.value.withdrawTypeCode;

	// 定义 requiredFields 和 dynamicFields
	let requiredFields: string[] = [];
	let dynamicFields = {} as any;

	// 添加 SMS 代码的检查
	const addSmsCodeCheck = () => {
		if (!UserStore.getUserInfo.isSetPwd && UserStore.getUserInfo.phone) {
			requiredFields.push("smsCode");
			dynamicFields.smsCode = childRef.value?.state?.smsCode || "";
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
			addSmsCodeCheck();
			break;
		default:
			break;
	}
	// console.log("requiredFields", requiredFields);
	// console.log("dynamicFields", dynamicFields);
	// 检查所有属性是否有值
	const allFieldsHaveValue = requiredFields.every((key) => dynamicFields[key] !== undefined && dynamicFields[key] !== "");
	// 按钮状态判断
	if (errorMessage.value || !state.amount || !allFieldsHaveValue || (requiredFields.includes("userPhone") && !isPhoneValid && withdrawTypeCode !== "crypto_currency")) {
		return "disabled";
	} else {
		return "default";
	}
});

// 动态构建表单字段
const buildDynamicFields = () => {
	// 获取后台返回的校验字段
	const { collectInfoVOS = [] } = withdrawWayConfig.value;
	// 获取本地组件自定义校验字段
	const validCodes = new Set(childRef.value?.inputFields?.map((field) => field.code));
	// 过滤并生成有效的表单字段
	return collectInfoVOS
		.filter(
			({ filedCode, checkFlag }) =>
				// 判断后台是否勾选 并且 本地配置拥有此字段
				checkFlag && validCodes.has(filedCode)
		)
		.reduce((acc, { filedCode }) => {
			// 构建表单信息
			acc[filedCode] = childRef.value?.formParams?.[filedCode] || "";
			return acc;
		}, {});
};

// 构建参数对象的通用函数
const buildParams = (withdrawPassWord?: string) => {
	return {
		amount: state.amount,
		withdrawWayId: withdrawWayData.value.id,
		withdrawPassWord, // 将 withdrawPassWord 添加到参数中
		// 只合并 buildDynamicFields 中存在的键值对
		...Object.keys(buildDynamicFields()).reduce((acc: any, key) => {
			if (key in childRef.value?.formParams) {
				acc[key] = buildDynamicFields()[key]; // 只保留 buildDynamicFields 中的值
				// 判断是否包含 userPhone，若是则添加 areaCode
				if (key === "userPhone") {
					acc.areaCode = childRef.value?.formParams.areaCode; // 从 state 中取 areaCode
				}
			}
			return acc;
		}, {}),
	};
};

// 交易密码输入完成
const onTransactionPasswordEntered = () => {
	passWordShow.value = false;
	if (state.withdrawPassWord.length === 6) {
		const params = buildParams(state.withdrawPassWord); // 传递 withdrawPassWord
		getWithdrawApply(params);
	}
};

// 会员提款申请
const onWithdrawApply = async () => {
	if (withdrawWayConfig.value.remainingFlow > 0) {
		useTipsDialog({
			title: $.t(`wallet["温馨提示"]`),
			text: $.t(`wallet["流水未完成"]`, { value: withdrawWayConfig.value.remainingFlow, currency: UserStore.userInfo.mainCurrency }),
			confirmText: $.t(`wallet["去完成"]`),
			onConfirm: () => {
				if (props.dialogType) {
					// 关闭钱包弹窗
					pubsub.publish("closeWalletDialog");
				}
				router.push("/");
			},
			onClose: () => {},
		});
		return;
	}
	if (UserStore.getUserGlobalSetInfo.isSetPwd) {
		passWordShow.value = true;
	} else if (UserStore.getUserGlobalSetInfo.phone) {
		const params = buildParams(); // 如果不需要 withdrawPassWord，可以传空字符串
		params.smsCode = state.smsCode || "";
		getWithdrawApply(params);
	}
};

// 提款请求
const getWithdrawApply = async (params: any) => {
	const res = await walletApi.withdrawApply(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		showToast($.t('wallet["申请成功"]'));
		clearParams();
		getWithdrawConfig(); // 获取通道配置
		getUserBalance(); // 获取最新余额
		getWithdrawExchange(); // 获取提款汇率
		// 重新拉取手机区号信息
		if (withdrawWayData.value.withdrawTypeCode !== "crypto_currency") {
			childRef.value?.getAreaCodeDownBox();
		}
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
	if (item.withdrawTypeCode == withdrawWayData.value.withdrawTypeCode && item.networkType == withdrawWayData.value.networkType) return;
	captchaButton.value?.stopCountdown();
	withdrawWayData.value = item;
	clearParams();
	getWithdrawConfig(); // 获取通道配置
	getUserBalance(); // 获取金额

	if (item.withdrawTypeCode == "crypto_currency") {
		getWithdrawExchange();
	}
};

// 获取支付方式列表
const getRechargeWayList = async () => {
	const res = await walletApi.withdrawWayList().catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		if (!res.data || res.data.length == 0) {
			showToast($.t('wallet["暂无取款方式"]'));
			return;
		}
		withdrawWayList.value = res.data; // 存储支付方式列表
		withdrawWayData.value = res.data[0]; // 默认选择第一个支付方式
		getWithdrawConfig(); // 获取通道配置
	}
};

// 获取通道配置
const getWithdrawConfig = async () => {
	// loadingShow.value = true;
	withdrawWayConfig.value = {};
	const params = {
		withdrawWayId: withdrawWayData.value.id,
	};
	const res = await walletApi.getWithdrawConfig(params).catch((err) => err);
	// loadingShow.value = false;
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
		if (!["totalBalance", "freezeAmount"].includes(key)) {
			state[key] = ""; // 将每个属性设置为空字符串
		}
	});
	feeAmount.value = 0;
	estimatedAmount.value = 0;
	childRef.value?.clearParams();
};
</script>

<style scoped lang="scss">
@import url("./components/formScss.scss");

.withdrawal_container {
	display: flex;
	flex-direction: column;
	height: 100%;
	.flex {
		flex: 1;
	}
}

.half_round_corner {
	border-radius: 0px 0px 12px 12px;
}

.header {
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line-1);
	box-shadow: 0px 1px 0px 0px var(--Shadow-1);
	color: var(--Text-s);
	font-family: "PingFang SC";
	font-size: 24px;
	font-weight: 500;
}

.dialogType_fixed {
	position: fixed;
	width: 940px;
	background: var(--Bg);
	padding: 0px !important;
	padding-bottom: 20px !important;
	// margin-top: 1px;
	z-index: 10;
	.dialogType_fixed_container {
		padding: 20px;
		height: 146px;
		background: var(--Bg-1);
		border-radius: 0px 0px 12px 12px;
	}
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
			background-position: center center;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.label {
				grid-column: 1 / 2; /* 在左侧 */
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 400;
			}

			.value {
				grid-column: 1 / 2; /* 在左侧 */
				color: var(--Text-s);
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
		color: var(--Text-s);
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
			border: 1px solid var(--Line-2);
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
				color: var(--Text-1);
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
		margin-top: 16px;
		padding: 20px;
		border-radius: 12px;
		border: 1px solid var(--Line-2);

		.form_main {
			width: 100%;
			// min-height: 40px;
			background-color: var(--Bg-1);
		}

		.tips {
			display: flex;
			gap: 8px;
			margin-top: 16px;
			.icon {
				width: 17px;
				height: 17px;
			}
			p {
				color: var(--Text-2-1);
				font-family: "PingFang SC";
				font-size: 12px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
			span {
				color: var(--F-2);
				text-decoration-line: underline;
				cursor: pointer;
			}
		}
	}
}
.error_text {
	color: var(--F-1);
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
}

.amount_info {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.label {
		color: var(--Text-2-1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
	.value {
		color: var(--F-1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 600;
	}
}

.tips {
	color: var(--Text-2-1);
	font-family: "PingFang SC";
	font-size: 12px;
	font-weight: 400;
	.value {
		color: var(--F-1);
		font-family: "PingFang SC";
		font-size: 12px;
		font-weight: 400;
	}
}
</style>
