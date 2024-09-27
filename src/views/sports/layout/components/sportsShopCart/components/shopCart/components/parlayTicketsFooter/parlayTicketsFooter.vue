<template>
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
import { computed } from "vue";
import { DeleteButton, BetButton, AddButton } from "../../../components/btns/index";
import Common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import showToast from "/@/hooks/useToast";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();

const combos: any = computed(() => shopCartPubSub.betValueState.combos);

const emit = defineEmits(["parlayTicketsSuccess"]);

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
