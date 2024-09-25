<template>
	<div class="singlePass">
		<div class="singlePass_top">
			<div>
				<span class="value">{{ comboInfo.comboTypeName }}</span>
				<span class="value ml_6">@{{ Common.formatFloat(comboInfo.payoutRate) }}</span>
			</div>
			<el-input
				type="number"
				:min="comboInfo?.minBet"
				:max="comboInfo?.maxBet"
				:placeholder="`限额 ${Common.formatFloat(comboInfo.minBet) || '0.00'} ～ ${Common.formatFloat(comboInfo.maxBet) || '0.00'}`"
			>
				<!-- <template #suffix>USD</template> -->
			</el-input>
		</div>
		<!-- <div v-if="subtotal != 0" class="singlePass_buttom">
			<span>小计:&nbsp;{{ subtotal }}&nbsp;USD</span>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";

export interface ComboInfo {
	comboType: string;
	comboTypeName: string;
	price: number;
	betCount: number;
	minBet: number;
	maxBet: number;
	payoutRate: number;
}

const props = withDefaults(
	defineProps<{
		comboInfo?: ComboInfo;
	}>(),
	{
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
	}
);
</script>

<style lang="scss" scoped>
.singlePass {
	padding: 6px 15px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	background: var(--Bg4);

	.singlePass_top {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.value {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
		}
	}
	.singlePass_buttom {
		margin-top: 6px;
		display: flex;
		flex-direction: column;
		align-items: end;
		span {
			color: var(--Text1);
			font-size: 14px;
			font-weight: 400;
		}
	}

	.el-input {
		width: 214px;
		height: 50px;
		// padding: 19px 10px;
		border-radius: 8px;
		background: var(--Bg4);

		:deep() {
			.el-input__wrapper {
				background: var(--Bg1);
				box-shadow: none;
				border: 1px solid var(--Line_2);
				border-radius: 8px;

				.el-input__inner {
					color: var(--Text1);
					font-size: 16px;
					font-weight: 400;
				}

				input {
					&::placeholder {
						color: var(--Text2);
					}
				}
				.el-input__suffix {
					color: var(--Text1);
					font-size: 16px;
					font-weight: 400;
				}
			}
		}
	}
}
</style>
