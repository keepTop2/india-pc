<template>
	<div>
		<Card :header="dialogType ? false : true" :class="{ half_round_corner: dialogType }">
			<template #header>
				<div class="header">{{ $t(`wallet['存款']`) }}</div>
			</template>
			<div class="container">
				<div class="title">{{ $t(`wallet['支付方式']`) }}</div>
				<div class="list">
					<div
						class="item"
						:class="{ pay_active: item.rechargeTypeCode == rechargeWayData?.rechargeTypeCode && item.networkType == rechargeWayData?.networkType }"
						v-for="item in rechargeWayList"
						@click="onRechargeWay(item)"
					>
						<div class="tag" v-if="item.recommendFlag == 1">{{ $t(`wallet['推荐']`) }}</div>
						<img class="icon" v-lazy-load="item.wayIconUrl" alt="" />
						<div class="label">{{ item.rechargeWay }}</div>
					</div>
				</div>
			</div>
		</Card>

		<Card class="mt_14" v-okLoading="loadingShow">
			<div class="container">
				<!-- 银行卡 / 电子钱包 -->
				<template v-if="rechargeWayData.rechargeTypeCode === 'bank_card' || rechargeWayData.rechargeTypeCode === 'electronic_wallet'">
					<!-- 银行卡 -->
					<template v-if="rechargeWayData.rechargeTypeCode === 'bank_card'">
						<div class="title">{{ $t(`wallet['存款人姓名']`) }}</div>
						<div class="cell mt_16 mb_20">
							<input v-model="requestParams.depositName" type="text" :placeholder="$t(`wallet['请输入存款人姓名']`)" />
						</div>
					</template>
					<!-- 银行卡 电子钱包 -->
					<div class="title">{{ $t(`wallet['存款金额']`) }}</div>
					<div class="amount_list mt_16">
						<div
							class="amount_item"
							:class="{ amount_item_active: amountItemActive === index }"
							v-for="(item, index) in quickAmountList"
							@click="
								{
									requestParams.amount = item;
									amountItemActive = index;
								}
							"
						>
							{{ item }}
						</div>
					</div>
					<div class="cell mt_16">
						<input
							v-model="requestParams.amount"
							type="text"
							:placeholder="`${rechargeConfig.rechargeMinAmount ?? 0} - ${rechargeConfig.rechargeMaxAmount ?? 0}`"
							@input="amountItemActive = null"
						/>
						<div class="label">{{ UserStore.userInfo.mainCurrency }}</div>
					</div>
					<div class="w_450">
						<Button class="mt_40" :type="buttonType" @click="onRecharge">{{ $t('wallet["立即存款"]') }}</Button>
					</div>
				</template>
				<!-- 虚拟币 -->
				<template v-if="rechargeWayData.rechargeTypeCode === 'crypto_currency'">
					<div class="title">{{ $t(`wallet['存款信息']`) }}</div>
					<p class="hint">{{ $t(`wallet['扫描下方存款码或复制存款地址进行转账']`) }}</p>
					<div class="qrcode">
						<QrcodeVue id="qrcode" :value="rechargeConfig.address" :size="180" />
					</div>
					<div class="address_info">
						<div class="value">{{ rechargeConfig.address }}</div>
						<svg-icon class="copy_icon curp" name="copy" size="16px" v-hover-svg @click="common.copy(rechargeConfig.address)" />
					</div>
				</template>
			</div>
		</Card>
		<!-- 虚拟币 -->
		<template v-if="rechargeWayData.rechargeTypeCode === 'crypto_currency'">
			<Card class="mt_14">
				<div class="container">
					<div class="title">{{ $t(`wallet['温馨提示']`) }}</div>
					<div class="tips">
						<p class="tip">{{ $t(`wallet['1']`) }}{{ UserStore.getUserInfo.userAccount }}</p>
						<p class="tip">{{ $t(`wallet['2']`, { value: rechargeWayData?.networkType }) }}</p>
						<p class="tip">{{ $t(`wallet['3']`, { value: `${rechargeConfig.exchangeRate ?? 0}${UserStore.userInfo.mainCurrency}`, currency: "USDT" }) }}</p>
						<p class="tip">{{ $t(`wallet['4']`) }}</p>
					</div>
				</div>
			</Card>
		</template>

		<!-- 虚拟币提醒弹窗 -->
		<CommonDialog v-model="isModalVisible">
			<div class="remind_container">
				<div class="remind_header">{{ $t(`wallet['温馨提示']`) }}</div>
				<div class="remind_main">
					<i18n-t class="text" keypath="wallet['请使用']" :tag="'p'">
						<template v-slot:value>
							<span class="text_2" v-if="rechargeWayData.networkType == 'TRC20'"> {{ $t(`wallet['波场链']`) }} </span>
							<span class="text_2" v-if="rechargeWayData.networkType == 'ERC20'"> {{ $t(`wallet['以太坊链']`) }} </span>
						</template>
						<template v-slot:currency>
							<span class="text_2">({{ rechargeWayData.networkType }})</span>
						</template>
					</i18n-t>
					<div class="tips">
						<svg-icon class="pointer" :name="checkbox ? 'check_icon_on' : 'check_icon'" size="14px" @click="checkbox = !checkbox" :style="{ color: 'var(--Theme)' }" />
						<span>{{ $t(`wallet['24小时内不再提示']`) }}</span>
					</div>
				</div>
				<div class="remind_footer">
					<div class="remind_btn" @click="onNotRemind">{{ $t(`wallet['我已知晓']`) }}</div>
				</div>
			</div>
		</CommonDialog>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import QrcodeVue from "qrcode.vue";
import Card from "../components/card.vue";
import { walletApi } from "/@/api/wallet";
import common from "/@/utils/common";
import { useUserStore } from "/@/stores/modules/user";
import { useRoute, useRouter } from "vue-router";
import showToast from "/@/hooks/useToast";
import { i18n } from "/@/i18n/index";
const UserStore = useUserStore();
const $: any = i18n.global;
const route = useRoute();
const router = useRouter();

interface rechargeWayDataRootObject {
	rechargeTypeCode: string;
	id: string;
	rechargeWay: string;
	wayIcon: string;
	wayIconUrl: string;
	wayFee: number;
	quickAmount: string;
	rechargeMin: number;
	rechargeMax: number;
	recommendFlag: number;
	networkType?: any;
	currencyCode: string;
}

interface rechargeConfigRootObject {
	balance: number;
	exchangeRate: number;
	rechargeMinAmount: number;
	rechargeMaxAmount: number;
	feeRate: number;
	haveThreeHandingOrder: number;
	address: string;
	quickAmount: string;
	currencyCode: string;
	rechargeWayId: string;
	rechargeWay: string;
	isRemind: number;
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
	(e: "RechargeSuccess", orderNo: string): void;
}>();

// 定义响应式变量
const rechargeWayData = ref({} as rechargeWayDataRootObject); // 当前选择的支付方式
const rechargeWayList = ref([] as rechargeWayDataRootObject[]); // 支付方式列表
const quickAmountList = ref([]); // 快捷金额选项
const isModalVisible = ref(false);
const checkbox = ref(false);
const amountItemActive = ref<null | number>(null);
const rechargeConfig = ref({
	rechargeMinAmount: 0,
	rechargeMaxAmount: 0,
} as rechargeConfigRootObject); // 通道配置信息;

const loadingShow = ref(false);

const requestParams = reactive({
	depositName: "",
	amount: "",
} as any);

const buttonType = computed(() => {
	if (rechargeWayData.value.rechargeTypeCode === "bank_card") {
		return requestParams.depositName && requestParams.amount ? "default" : "disabled";
	} else if (rechargeWayData.value.rechargeTypeCode === "electronic_wallet") {
		return requestParams.amount ? "default" : "disabled";
	}
	return "disabled";
});

// 获取支付方式列表
const getRechargeWayList = async () => {
	const res = await walletApi.rechargeWayList().catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		if (!res.data || res.data.length == 0) {
			showToast($.t('wallet["暂无充值方式"]'));
			return;
		}
		rechargeWayList.value = res.data; // 存储支付方式列表
		rechargeWayData.value = res.data[0]; // 默认选择第一个支付方式
		getRechargeConfig();
	}
};

// 获取快捷金额
const getRechargeConfig = async (headers = {}) => {
	loadingShow.value = true;
	rechargeConfig.value = {} as rechargeConfigRootObject;
	const params = {
		rechargeWayId: rechargeWayData.value.id,
	};
	const res = await walletApi.getRechargeConfig(params, headers).catch((err) => err);
	loadingShow.value = false;
	if (res.code !== common.ResCode.SUCCESS) return;
	if (rechargeWayData.value.rechargeTypeCode == "crypto_currency" && res.data.isRemind == 1) {
		checkbox.value = false;
		isModalVisible.value = true;
	}
	rechargeConfig.value = res.data;
	quickAmountList.value = res.data.quickAmount.split(",").map(Number);
};

// 选择支付方式时的处理
const onRechargeWay = (item: rechargeWayDataRootObject) => {
	// 在当前方式直接退出
	if (item.rechargeTypeCode == rechargeWayData.value.rechargeTypeCode && item.networkType == rechargeWayData.value.networkType) return;
	// 清空之前方式信息
	rechargeWayData.value = {} as rechargeWayDataRootObject;
	// 清空表单参数
	clearRequestParams();
	// 获取当前方式信息
	rechargeWayData.value = item;
	// 请求当前方式信息
	getRechargeConfig({ showLoading: false });
	// getRechargeConfig();
};

// 点击充值
const onRecharge = async () => {
	const params = {
		depositWayId: rechargeConfig.value.rechargeWayId,
		amount: requestParams.amount,
	} as {
		depositName?: string;
		depositWayId: string;
		amount: number;
	};
	if (rechargeWayData.value.rechargeTypeCode === "bank_card") {
		params.depositName = requestParams.depositName;
	}
	const res = await walletApi.userRecharge(params).catch((err) => err);
	if (res.code === common.ResCode.SUCCESS) {
		if (!props.dialogType) {
			router.replace({
				path: "/accountChangeDetails",
				query: {
					orderNo: res.data.orderNo,
				},
			});
		} else {
			emit("RechargeSuccess", res.data.orderNo);
		}

		if (res.data.thirdIsUrl == 1) {
			window.open(res.data.thirdPayUrl, "_blank");
		} else if (res.data.thirdIsUrl == 0) {
			openHtmlInNewWindow(res.data.thirdPayUrl);
		}
		clearRequestParams();
	}
};

const openHtmlInNewWindow = (content: string) => {
	// 创建Blob对象
	const blob = new Blob([content], { type: "text/html" });
	const url = URL.createObjectURL(blob);
	// 在新窗口中打开
	window.open(url);
	// 释放URL对象
	URL.revokeObjectURL(url);
};

// 不再提醒
const onNotRemind = async () => {
	if (checkbox.value) {
		const params = {
			netWorkType: rechargeWayData.value.networkType,
		};
		const res = await walletApi.notRemind(params).catch((err) => err);
		if (res.code === common.ResCode.SUCCESS) {
			checkbox.value = false;
			isModalVisible.value = false;
		}
	} else {
		isModalVisible.value = false;
	}
};

// 清空参数
const clearRequestParams = () => {
	quickAmountList.value = [];
	amountItemActive.value = null;
	Object.keys(requestParams).forEach((key) => {
		requestParams[key] = "";
	});
};

getRechargeWayList();
</script>

<style scoped lang="scss">
.half_round_corner {
	border-radius: 0px 0px 12px 12px;
}

.header {
	padding-bottom: 6px;
	border-bottom: 1px solid var(--Line_1);
	box-shadow: 0px 1px 0px 0px #343d48;
	color: var(--Text_s);
	font-family: "PingFang SC";
	font-size: 24px;
	font-weight: 500;
}

.w_450 {
	max-width: 450px;
}
.container {
	padding: 20px;
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

	.amount_list {
		display: flex;
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		.amount_item {
			width: 120px;
			height: 38px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 8px 10px;
			border-radius: 8px;
			border: 1px solid var(--Line_2);
			color: var(--Text1);
			font-family: "DIN Alternate";
			font-size: 18px;
			font-weight: 700;
			line-height: 24px;
			cursor: pointer;
			transition: all 0.2s;
		}
		.amount_item_active {
			color: var(--Theme);
			border: 1px solid var(--Theme);
		}
	}

	.cell {
		max-width: 450px;
		height: 40px;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 4px;
		background: var(--Bg2);
		input {
			width: 100%;
			height: 100%;
			margin: 0px;
			padding: 0px;
			border: 0px;
			background: var(--Bg2);
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 500;
			&::placeholder {
				color: var(--Text2);
			}
		}
		.label {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}

	.hint {
		margin-top: 20px;
		color: var(--Text_s);
		text-align: center;
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 500;
	}
	.qrcode {
		width: 200px;
		height: 200px;
		margin: 20px auto 0px;
		padding: 10px;
		background-color: #fff;
		border-radius: 12px;
	}
	.address_info {
		width: fit-content;
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 12px auto 0px;
		padding: 12px 20px;
		border-radius: 12px;
		border: 1px solid var(--Line_2);
		.value {
			color: var(--Text_s);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 500;
		}
		.copy_icon {
			width: 16px;
			height: 16px;
			svg {
				width: 100%;
				height: 100%;
			}
		}
	}
	.tips {
		margin-top: 16px;
		.tip {
			color: var(--Text2_1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			line-height: 30px; /* 214.286% */
		}
	}
}

.remind_container {
	width: 380px;
	height: 100%;
	border-radius: 12px;
	background-color: var(--Bg1);
	.remind_header {
		width: 100%;
		height: 68px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--Text_s);
		font-family: "PingFang SC";
		font-size: 20px;
		font-weight: 500;
	}
	.remind_main {
		padding: 8px 20px;
		text-align: center;
		.text {
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 400;
		}
		.text_2 {
			color: var(--F2);
		}
		.tips {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10px;
			margin-top: 8px;
			span {
				color: var(--Text2_1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
		}
	}

	.remind_footer {
		padding: 12px 0px 40px;
	}

	.remind_btn {
		width: 166px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		padding: 12px;
		border-radius: 4px;
		background: var(--Theme);
		color: var(--Text_a);
		font-family: "PingFang SC";
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
	}
}
</style>
