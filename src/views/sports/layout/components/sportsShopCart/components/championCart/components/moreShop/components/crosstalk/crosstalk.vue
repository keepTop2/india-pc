<!--
 * @Author: WangMingxin
 * @Description:  体育-购物车- 一条下注单时输入框
-->
<template>
	<div class="singlePass">
		<div class="singlePass_top">
			<div>
				<span class="value">{{ comboInfo.comboTypeName }}</span>
				<span class="value ml_12">@{{ Common.formatFloat(comboInfo.payoutRate) }}</span>
			</div>
			<el-input
				v-model="stake"
				type="number"
				:min="comboInfo?.minBet"
				:max="comboInfo?.maxBet"
				:placeholder="`限额 ${Common.formatFloat(comboInfo.minBet) || '0.00'} ～ ${Common.formatFloat(comboInfo.maxBet) || '0.00'}`"
				@input="onInputChange"
				@keypress="preventDecimal"
				@change="onInputChangeVal"
			>
				<!-- <template #suffix>USD</template> -->
			</el-input>
		</div>
		<div class="singlePass_buttom">
			<span>小计:&nbsp;{{ subtotal }}&nbsp;USD</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import { inject } from "vue-demi";
import Common from "/@/utils/common";
import weakHint from "/@/hooks/weakHint";
const { weakOpen } = weakHint();
/**串关赛事相关信息 */
export interface ComboInfo {
	comboType: string;
	comboTypeName: string;
	price: number;
	betCount: number;
	minBet: number;
	maxBet: number;
	payoutRate: number;
}

/**盘口赔率相关信息 */
export interface PriceInfo {
	stateCode: number;
	stateMessage: string;
	currentPrice: number;
	marketId: number;
	key: string;
	sportType: number;
	point: number;
	betType: number;
	oddsType: number;
	status: string;
	liveHomeScore: number;
	liveAwayScore: number;
}

export interface CrosstalkData {
	/** 投注信息（投注限制信息） */
	comboInfo?: ComboInfo;
	/** 接受赔率变动  */
	isAccept?: boolean;
	/**账户余额 */
	balance?: number;
}
const emit = defineEmits(["onInputChange", "oddsChanges"]);
const props = withDefaults(defineProps<CrosstalkData>(), {
	balance: 0,
	comboInfo: () => {
		return {
			comboType: "",
			comboTypeName: "x串x (x 个注单)",
			price: 0,
			betCount: 0,
			minBet: 0,
			maxBet: 0,
			payoutRate: 0,
		};
	},
});

watch(
	() => props.comboInfo.payoutRate,
	(newValue, oldValue) => {
		if (oldValue && newValue != oldValue) {
			if (!props.isAccept) {
				/**赔率变动激活 */
				emit("oddsChanges", true);
			}
			if (stake.value) {
				/**赔率发生变化时激活一次计算 */
				emit("onInputChange");
			}
		}
	}
);

//**小计额度 */
const subtotal = ref(0);
/** 下注金额 */
const stake = defineModel({ type: String });

// /** 结余 */
// const balance = ref(localStorage.getItem("balance") || 0);

/**
 * @description: 输入内容变更时；
 * @param {*} value 输入的值
 * @return {*}
 */
const onInputChange = (value: string) => {
	const val: any = Number(value);
	if (val == "" || val == "NaN") {
		stake.value = "";
	} else if (val > props.comboInfo.maxBet) {
		/** 用户金额和最大金额判断 */
		if (props.comboInfo.maxBet > props.balance) {
			stake.value = Math.floor(props.balance);
		} else if (props.comboInfo.maxBet < props.balance) {
			stake.value = props.comboInfo.maxBet;
		}
	}
	if (stake.value) {
		const sum = Common.mul(stake.value, props.comboInfo.betCount);
		subtotal.value = sum;
	} else {
		subtotal.value = 0;
	}
	/** 直接计算可赢额度 */
	emit("onInputChange");
};

/**
 * @description: input失去焦点时（最小值处理逻辑）
 * @param {*} val
 * @return {*}
 */
const onInputChangeVal = (value: string) => {
	const val: any = Number(value);
	if (val == "" || val == "NaN") {
		stake.value = "";
	} else if (val < props.comboInfo.minBet) {
		/** 最低限额逻辑 */
		if (props.comboInfo.minBet > props.balance) {
			stake.value = Math.floor(props.balance);
			weakOpen("未达到投注金额最低限额：" + props.comboInfo.minBet);
		} else if (props.comboInfo.minBet < props.balance) {
			// stake.value = state.value.minBet;
		}
	}
	emit("onInputChange");
};

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

const getToFixed = (value: number) => {
	return value.toFixed(2);
};

/** 返回的 下注金额 详细 */
const params = computed(() => {
	return {
		comboType: props.comboInfo.comboType,
		stake: stake.value,
	};
});

/** 每一单预计可以赢的额度  */
const total = computed(() => {
	const num = Common.mul(Number(stake.value), props.comboInfo?.payoutRate) || 0;
	const winnable = Common.sub(num, subtotal.value);
	return winnable;
});

defineExpose({ params, total, subtotal });
</script>

<style lang="scss" scoped>
.singlePass {
	padding: 6px 15px;
	border-radius: 8px;
	margin: 5px 0;
	display: flex;
	flex-direction: column;
	background: var(--Bg3);

	.singlePass_top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.singlePass_buttom {
		margin-top: 6px;
		display: flex;
		flex-direction: column;
		align-items: end;
		span {
			font-size: 14px;
			color: var(--Text1);
		}
	}

	.el-input {
		width: 214px;
		height: 50px;
		padding: 19px 10px;
		border-radius: 8px;
		background: var(--Bg2);

		:deep() {
			.el-input__wrapper {
				box-shadow: none;
				border: none;
				padding: 0;
				background: var(--Bg2);

				input {
					&::placeholder {
						color: var(--Text2);
					}
				}
			}
		}
	}
}
</style>
