<template>
	<div class="moreShop" v-if="[0, 1, 4].includes(sportsBetEvent.bettingStatus)">
		<div class="singlePass" v-for="(item, index) in sportsBetInfo.parlayTicketsInfo.combos">
			<div class="singlePass_top">
				<div>
					<span class="value">{{ item.comboTypeName }}</span>
					<span class="value ml_6">@{{ Common.formatFloat(item.payoutRate) }}</span>
				</div>
				<el-input
					v-model.number="combos[item.comboType]"
					type="number"
					:min="item?.minBet"
					:max="item?.maxBet"
					:placeholder="`限额 ${Common.formatFloat(item.minBet) || '0.00'} ～ ${Common.formatFloat(item.maxBet) || '0.00'}`"
					@input="onInputEnter(item)"
					@keydown="preventDecimal"
				>
				</el-input>
			</div>
			<div v-if="combos[item.comboType]" class="singlePass_buttom">
				<span>小计:{{ Common.mul(combos[item.comboType], item.betCount) }}{{ UserStore.getUserInfo.mainCurrency }}</span>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Common from "/@/utils/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { useUserStore } from "/@/stores/modules/user";
const UserStore = useUserStore();
const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();

const combos: any = computed(() => shopCartPubSub.betValueState.combos);

const onInputEnter = (item: any) => {
	// 处理对应的金额业务
	shopCartPubSub.setParlayTicketsBetValue(item);
};

const preventDecimal = (event: KeyboardEvent) => {
	if (event.key === "." || event.key === "-" || event.key === "+") {
		event.preventDefault();
	}
};
</script>

<style scoped lang="scss">
.moreShop {
	display: grid;
	gap: 6px;
	.singlePass {
		padding: 6px 15px;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		background: var(--Bg-4);

		.singlePass_top {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.value {
				color: var(--Text-s);
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
				color: var(--Text-1);
				font-size: 14px;
				font-weight: 400;
			}
		}

		:deep(.el-input) {
			width: 214px;
			height: 50px;
			// padding: 19px 10px;
			border-radius: 8px;
			background: var(--Bg-4);

			.el-input__wrapper {
				background: var(--Bg-1);
				box-shadow: none;
				border: 1px solid var(--Line-2);
				border-radius: 8px;

				&:focus-within {
					border-color: var(--Theme); /* 设置聚焦时的边框颜色 */
				}
				.el-input__inner {
					color: var(--Text-1);
					font-size: 16px;
					font-weight: 400;
					caret-color: var(--Theme);
				}

				input {
					&::placeholder {
						color: var(--Text-2);
					}
				}
				.el-input__suffix {
					color: var(--Text-1);
					font-size: 16px;
					font-weight: 400;
				}
			}
		}
	}
}
.footer {
	border-radius: 8px;
	background-color: var(--Bg);
	padding: 10px 15px 15px;
	.btns {
		width: 100%;
		height: 48px;
		display: flex;
		gap: 4px;
	}
}
</style>
