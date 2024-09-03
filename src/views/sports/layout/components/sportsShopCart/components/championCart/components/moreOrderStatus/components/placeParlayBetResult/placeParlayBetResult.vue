<!--
 * @Author: WangMingxin
 * @Description: 串单-投注详情-结果
-->
<template>
	<div class="placeParlayBetResult">
		<!-- 赔率注单 -->
		<div class="container">
			<div class="left">
				<span class="title">{{ comboInfo.comboTypeName }}</span>
				<span>注单已确认</span>
			</div>
			<div class="right">
				<span class="unitPrice">{{ stake }} </span>
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
	@include themeify {
		background: themed("Bg3");
	}

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
				@include themeify {
					color: themed("Text_s");
				}
			}

			& > span:last-child {
				font-size: 14px;
				@include themeify {
					color: themed("Text1");
				}
			}
		}
	}

	& > .container:last-child {
		.left {
			font-size: 15px;
			display: flex;
			align-items: center;
			gap: 5px;
			@include themeify {
				color: themed("Theme");
			}
		}

		.right {
			font-size: 14px;
			display: flex;
			align-items: center;
			gap: 5px;
			@include themeify {
				color: themed("Text1");
			}
			.right_buttom {
				@include themeify {
					color: themed("Text1");
				}
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
