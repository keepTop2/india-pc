<!--
 * @Author: WangMingxin
 * @Description: 串单-投注详情-结果
-->
<template>
	<div class="placeParlayBetResult" v-if="stake">
		<!-- 赔率注单 -->
		<div class="container">
			<div class="left">
				<span class="title">{{ comboTypeName }}</span>
				<span>注单已确认</span>
			</div>
			<div class="right">
				<span class="unitPrice">{{ Common.formatFloat(stake) }} </span>
				<span class="right_buttom">x{{ comboInfo.betCount }} </span>
			</div>
		</div>
		<!-- 可赢价格 -->
		<div class="container">
			<div class="left">
				<span class="title">预计可赢:</span> <span>{{ Common.formatFloat(total) || "" }}</span>
				<span>USD</span>
			</div>
			<div class="right">
				<span class="title">小计:</span>
				<span>{{ subtotal }} </span>
				<span>USD</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Common from "/@/utils/common";

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

export interface CrosstalkData {
	/** 下注赔率单信息 */
	comboInfo?: ComboInfo;
	/** 下注金额信息 */
	bettingMony: any;
}

const props = withDefaults(defineProps<CrosstalkData>(), {
	bettingMony: () => {
		return [];
	},
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

/**获取当前金额 */
const stake = computed(() => {
	let stake = 0;
	props.bettingMony &&
		props.bettingMony.forEach((e: any) => {
			if (e.comboType == props.comboInfo.comboType) {
				stake = e.stake;
			}
		});
	return stake;
});
//**小计额度 */
const subtotal = computed(() => {
	const num = Common.mul(stake.value, props.comboInfo.betCount);
	return Common.formatFloat(num);
});

/** 每一单预计可以赢的额度  */
const total = computed(() => {
	const num = Common.mul(Number(stake.value), props.comboInfo?.payoutRate) || 0;
	const winnable = Common.sub(num, subtotal.value);
	return winnable;
});

/** 串单名称  */
const comboTypeName = computed(() => {
	const comboTypeNameMaps: any = {
		Doubles: "2串1",
		Trebles: "3串1",
		Trixie: "3串4",
		Lucky7: "幸运7",
		Fold4: "4串1",
		Yankee: "4串11",
		Lucky15: "幸运15",
		Fold5: "5串1",
		Canadian: "5串26",
		Lucky31: "幸运31",
		Fold6: "6串1",
		Heinz: "6串57",
		Lucky63: "幸运63",
		Fold7: "7串1",
		SuperHeinz: "7串120",
		Lucky127: "幸运127",
		Fold8: "8串1",
		Goliath: "8串247",
		Lucky255: "幸运255",
		Fold9: "9串1",
		Fold10: "10串1",
		Fold11: "11串1",
		Fold12: "12串1",
		Fold13: "13串1",
		Fold14: "14串1",
		Fold15: "15串1",
		Fold16: "16串1",
		Fold17: "17串1",
		Fold18: "18串1",
		Fold19: "19串1",
		Fold20: "20串1",
	};
	let name = comboTypeNameMaps[props.comboInfo.comboType];
	if (!name) {
		name = props.comboInfo.comboTypeName;
	}
	return name;
});
</script>

<style scoped lang="scss">
.placeParlayBetResult {
	width: 100%;
	height: 80px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin: 8px 0;
	padding: 10px 15px;
	box-sizing: border-box;
	border-radius: 8px;
	background: var(--Bg3);

	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	& > .container:first-child {
		& > div {
			display: flex;
			align-items: center;
			gap: 5px;

			& > span:first-child {
				color: var(--Text_s);
			}

			& > span:last-child {
				font-size: 14px;
				color: var(--Text1);
			}
		}
	}

	& > .container:last-child {
		.left {
			font-size: 15px;
			display: flex;
			align-items: center;
			gap: 5px;
			color: var(--Theme);
		}

		.right {
			font-size: 14px;
			display: flex;
			align-items: center;
			gap: 5px;
			color: var(--Text1);
			.right_buttom {
				color: var(--Text1);
				text-align: right;
				font-family: "PingFang SC";
				font-size: 14px;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
			}
		}
	}
}
</style>
