<!--
 * @Author: WangMingxin
 * @Description:  体育-购物车- 一个单下注输入框
-->
<template>
	<ShopCard :shopData="shopData" :hasClose="hasClose"></ShopCard>
	<div class="singlePass">
		<el-input
			v-model="stake"
			type="number"
			:min="state?.minBet"
			:max="state?.maxBet"
			:placeholder="`限额 ${Common.formatFloat(state?.minBet) || '0.00'} ～ ${Common.formatFloat(state?.maxBet) || '0.00'}`"
			@keypress="preventDecimal"
			@input="onInputChange"
			@change="onInputChangeVal"
		>
			<template #suffix>USD</template>
		</el-input>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { throttle, cloneDeep } from "lodash-es";
import sportsApi from "/@/api/menu/sports/sports";
import Common from "/@/utils/common";
import { ShopCard } from "../index";
import weakHint from "/@/hooks/weakHint";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { i18n } from "/@/i18n/index";
import { Notification } from "/@/components/index";
import { useToLogin } from "/@/hooks/toLogin";
const { toLogin } = useToLogin();
const $: any = i18n.global;

export interface RootObject {
	sportType: number;
	marketId: number;
	isDecimalType: boolean;
	point: number;
	point2?: any;
	key: string;
	betType: number;
	oddsType: number;
	price: number;
	status: string;
	maxBet: number;
	minBet: number;
	liveHomeScore: number;
	liveAwayScore: number;
	payoutRate: number;
}

/** maxWinnable 最高可赢     oddsChanges赔率变动   */
const emit = defineEmits(["maxWinnable", "oddsChanges", "orderConfirmation"]);
const sportsBetEvent = useSportsBetEventStore();

const { weakOpen } = weakHint();

const props = withDefaults(
	defineProps<{
		/** 选中的商品详细 */
		shopData?: any;
		/** 判断购物车数据是否异常 */
		unusual?: boolean;
		// vendorTransId?: string;
		/** 接受赔率变动  */
		isAccept?: boolean;
		/**账户余额 */
		balance: number;
	}>(),
	{
		unusual: false,
		// vendorTransId: "",
		isAccept: true,
		balance: 0,
		shopData: () => {
			return {};
		},
	}
);

/** 下注金额 */
const stake = defineModel({ type: String });
const state: any = ref({});
/**  拥有close */
const hasClose = ref(true);
/** 订单id  */
const vendorTransId = ref("");

watch(
	() => props.shopData,
	(newValue, oldValue) => {
		GetOutrightTicket();
	},
	{ deep: true }
);
/**赔率发生变化时激活一次计算 */
watch(
	() => state.value.payoutRate,
	(newValue, oldValue) => {
		// if (oldValue && newValue != oldValue) {
		// 	if (!props.isAccept) {
		// 		/**赔率变动激活 */
		// 		emit("oddsChanges", true);
		// 	}
		// 	/**赔率发生变化时激活一次计算 */
		// 	setMaxWinnable();
		// }
		if (newValue != oldValue) {
			if (stake.value) {
				onInputChange(stake.value);
				onInputChangeVal(stake.value);
			}
		}
	}
);

onMounted(() => {
	GetOutrightTicket();
	/**可赢金额归0 */
	emit("maxWinnable", 0);
});

/*异常时禁止下注输入框*/
const disabled = ref(false);
/**
 * @description: 获取 更新单注的盘口数据
 * @return {*}
 */
const GetOutrightTicket = throttle(async () => {
	// console.info("获取 更新单注的盘口数据", props.shopData);
	/**数据异常不在执行 数据查询 */
	if (props.unusual) {
		return false;
	}
	const params = {
		/**体育项目 ID */
		sportType: props.shopData.sportType,
		/**  优胜冠军赔率ID */
		orid: props.shopData.orid,
	};
	try {
		const res = await sportsApi.GetOutrightTicket(params);
		const { status, data } = res;
		state.value = data;
		onInputChange(stake.value as string);
		onInputChangeVal(stake.value as string);
	} catch (e) {
		weakOpen("限额获取异常");
		disabled.value = true;
	}
}, 300);

/**
 * @description: 设置最高可赢
 */
const setMaxWinnable = throttle(async () => {
	if (stake.value) {
		const sum = Common.mul(stake.value, state.value.price);
		const winnable = Common.sub(sum, stake.value);
		/** 直接计算可赢额度 */
		emit("maxWinnable", Common.formatFloat(winnable));
	} else {
		emit("maxWinnable", 0);
	}
}, 300);

/**
 * @description: 输入内容变更时；
 * @param {*} val 输入的值
 * @return {*}
 */
const onInputChange = (value: string) => {
	const val: any = Number(value);

	if (val == "" || val == "NaN") {
		stake.value = "";
	} else if (val > state.value.maxBet) {
		/** 用户金额和最大金额判断 */
		if (state.value.maxBet > props.balance) {
			stake.value = Math.floor(props.balance);
		} else if (state.value.maxBet < props.balance) {
			stake.value = state.value.maxBet;
		}
	}
	setMaxWinnable();
};

/**
 * @description: input失去焦点时（最小值处理逻辑）
 * @param {*} val
 * @return {*}
 */
const onInputChangeVal = throttle(
	(val: string) => {
		if (val == "" || val == "NaN") {
			stake.value = "";
		} else if (val < state.value.minBet) {
			weakOpen("未达到投注金额最低限额：" + state.value.minBet);
		}
		setMaxWinnable();
	},
	3000,
	{ trailing: false }
);

/**
 * @description: 键盘默认事件清楚（禁止小数点和逗号输入 ）
 * @param {*} event
 * @return {*}
 */
const preventDecimal = (event: any) => {
	/**数字正则 */
	const regex = /^[0-9]$/;
	if (!regex.test(event.key)) {
		event.preventDefault();
	}
};

/** 下单成功返回对象 */
export interface PlaceBetResType {
	betPrice: number;
	transId: number;
	currentPrice: number;
	stake: number;
	/**注单状态 0 ：下注成功 ；1 ：下注失败 */
	betStatus: number;
	betAcceptSecond: number;
	ticketStatus: string;
	maxBet: number;
	minBet: number;
}
/** 下注单信息 */
const betInfo = reactive({
	betPrice: "",
	transId: "",
	stake: 0,
	winnable: 0,
});
/** 下单成功返回对象 */
const placeBetRes = ref({});

/**
 * @description: 单注-注单的下注
 * @return {*}
 */
const PlaceOutrightBet = async () => {
	if (Number(stake.value) < state.value.minBet) {
		/** 最低限额逻辑 */
		onInputChangeVal(stake.value as string);
		return false;
	}
	/** 点击下注时才进形 商品单号获取 */
	await getBetOrderId();
	if (!vendorTransId.value) {
		weakOpen("订单号获取异常");
		return false;
	}

	await GetOutrightTicket();
	// ...state.value,
	const params = {
		/**订单编号 */
		vendorTransId: vendorTransId.value,
		sportType: state.value.sportType,
		orid: state.value.orid,
		price: state.value.price,
		/** 下注金额 */
		stake: Number(stake.value),

		// /**下注选项 0：不接受盘口变更(预设) ; 1：只接受更好的赔率; 2：接受任何赔率变更 */
		// oddsOption: 0,
	};
	try {
		const res = await sportsApi.PlaceOutrightBet(params);
		const { status, data } = res;
		const { betStatus } = data;
		betInfo.betPrice = data.betPrice;
		betInfo.transId = data.transId;
		betInfo.stake = data.stake;
		/*返回响应值*/
		placeBetRes.value = Object.assign({}, placeBetRes.value, data);
		/*返回计算金额*/
		const sum = Common.mul(data.stake, betInfo.betPrice);
		const winnable = Common.sub(sum, data.stake);
		betInfo.winnable = winnable;
		onOrderConfirmation();
	} catch (e) {
		weakOpen("服务器异常");
	}
};

/**
 * @description: 订单提交后-进入确认订单
 */
const onOrderConfirmation = () => {
	const params = {
		shopData: cloneDeep(props.shopData),
		betInfo: betInfo,
		placeBetRes: placeBetRes.value,
		/** 系统订单号 */
		vendorTransId: vendorTransId.value,
	};
	emit("orderConfirmation", params);
};
/**
 * @description: 获获取沙巴体育注单ID(获取vendorTransId)
 */
const getBetOrderId = async () => {
	const params = {};
	const res = await sportsApi.getBetOrderId(params).catch((err) => {
		return err;
	});
	if (res == "ERR" || res == "Error") {
		//发布登陆弹窗事件
		Notification({
			title: $.t('gameList["提示"]'),
			content: $.t('common["请登陆后再进行操作"]'),
		});
		toLogin();
	} else {
		console.info(" 获获取沙巴体育注单ID(获取vendorTransId)", res);
		const { code, data } = res;
		if (code == Common.ResCode.SUCCESS) {
			vendorTransId.value = data;
		}
	}
};

defineExpose({ PlaceOutrightBet, stake });
</script>

<style lang="scss" scoped>
.singlePass {
	padding: 6px 15px;
	border-radius: 8px;
	margin: 5px 0;

	@include themeify {
		background: themed("Bg3");
	}

	.el-input {
		height: 50px;

		:deep() {
			.el-input__wrapper {
				box-shadow: none;
				border: none;

				@include themeify {
					background: themed("Bg2");
				}

				input {
					&::placeholder {
						@include themeify {
							color: themed("Text2");
						}
					}
				}
			}
		}
	}
}
</style>
