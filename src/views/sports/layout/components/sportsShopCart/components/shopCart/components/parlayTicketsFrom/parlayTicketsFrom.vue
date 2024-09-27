<template>
	<div class="moreShop" v-if="[0, 1, 4].includes(sportsBetEvent.bettingStatus)">
		<div class="singlePass" v-for="(item, index) in sportsBetInfo.parlayTicketsInfo.combos">
			<div class="singlePass_top">
				<div>
					<span class="value">{{ item.comboTypeName }}</span>
					<span class="value ml_6">@{{ Common.formatFloat(item.payoutRate) }}</span>
				</div>
				<el-input
					v-model="combos[item.comboType]"
					type="number"
					:min="item?.minBet"
					:max="item?.maxBet"
					:placeholder="`限额 ${Common.formatFloat(item.minBet) || '0.00'} ～ ${Common.formatFloat(item.maxBet) || '0.00'}`"
					@input="onInputEnter(item)"
				>
				</el-input>
			</div>
			<div v-if="combos[item.comboType]" class="singlePass_buttom">
				<span>小计:{{ Common.mul(combos[item.comboType], item.betCount) }}USD</span>
			</div>
		</div>
	</div>
	<div class="footer">
		<div class="btns">
			<!-- 清空赛事按钮 -->
			<DeleteButton />
			<!-- 投注按钮 -->
			<BetButton @onClick="onBet" />
			<!-- 加串按钮 -->
			<AddButton />
		</div>
	</div>
</template>
<script setup lang="ts">
import Common from "/@/utils/common";
// 引入组件
import sportsApi from "/@/api/sports/sports";
import showToast from "/@/hooks/useToast";
import { DeleteButton, BetButton, AddButton } from "../../../components/btns/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { computed } from "vue";
const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();

const combos: any = computed(() => shopCartPubSub.betValueState.combos);

const emit = defineEmits(["parlayTicketsSuccess"]);

const onInputEnter = (item: any) => {
	// 处理对应的金额业务
	shopCartPubSub.setParlayTicketsBetValue(item);
};

const onBet = () => {
	if ([1, 2, 5].includes(sportsBetEvent.bettingStatus)) {
		return;
	}
	// 循环金额 与 投注金额有无达到最低限额
	const hasEmpty = sportsBetInfo.parlayTicketsInfo.combos.every((item: any) => !combos.value[item.comboType]);
	const hasReachedMinBet = sportsBetInfo.parlayTicketsInfo.combos.every((item: any) => !combos.value[item.comboType] || parseFloat(combos.value[item.comboType]) >= item.minBet);
	if (hasEmpty) {
		showToast("请输入投注金额");
	} else if (!hasReachedMinBet) {
		showToast("投注金额未达到最低限额");
	} else {
		// 计算总投注
		const totalValue = sportsBetInfo.parlayTicketsInfo.combos.reduce((acc: any, obj: any) => {
			return acc + Common.mul(obj.betCount, parseFloat(combos.value[obj.comboType]));
		}, 0);
		if (totalValue > sportsBetInfo.balance) {
			showToast("余额不足，请先充值");
			return;
		}
		placeParlayBet();
	}
};

/**
 * 串关下注
 */
const placeParlayBet = async () => {
	const params = {
		betInfo: {
			vendorTransId: sportsBetInfo.vendorTransId,
			// 循环匹配赛事数据
			tickets: sportsBetInfo.parlayTicketsInfo.priceInfo.map((v: any) => ({
				sportType: v.sportType,
				marketId: v.marketId,
				point: v.point,
				key: v.key,
				price: v.currentPrice,
			})),
			// 过滤空注单，匹配投注注单
			combos: sportsBetInfo.parlayTicketsInfo.combos
				.filter((v: { comboType: string | number }) => combos.value[v.comboType])
				.map((v: { comboType: string | number }) => ({
					combotype: v.comboType,
					stake: combos.value[v.comboType],
				})),
			priceOption: 1,
		},
	};
	const res: any = await sportsApi.PlaceParlayBet(params).catch((err) => {
		const { data } = err.response;
		if (data.errorCode == "B014") {
			showToast("投注金额超出最大限额");
		}
		if (data.errorCode == "B038") {
			showToast("超过最大赢取金额");
		}
	});
	if (res.data) {
		const result = res.data;
		emit("parlayTicketsSuccess", result);
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
