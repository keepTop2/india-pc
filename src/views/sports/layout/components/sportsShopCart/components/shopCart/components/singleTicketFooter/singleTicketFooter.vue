<template>
	<div class="footer">
		<AuthHintDialog />
		<div class="btns">
			<!-- 投注按钮 -->
			<BetButton @onClick="onBet" />
			<!-- 加串按钮 -->
			<AddButton />
		</div>
	</div>
</template>

<script setup lang="ts">
import { BetButton, AddButton } from "../../../components/btns/index";
import showToast from "/@/hooks/useToast";
import sportsApi from "/@/api/sports/sports";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { computed, ref } from "vue";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { AuthHintDialog } from "/@/views/sports/layout/components/sportsShopCart/components/shopCart/components/index";
import { getBetOrderId, getIndexInfo } from "/@/views/sports/utils/commonFn";
import { useUserStore } from "/@/stores/modules/user";
const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();
let stake = computed(() => shopCartPubSub.betValueState.singleTicketBetValue);

const emit = defineEmits(["singleTicketSuccess"]);
// 请求注单下注期间不可点击
const unlickable = ref(false);
// 点击投注
const onBet = () => {
	if ([1].includes(sportsBetEvent.bettingStatus)) {
		return;
	}
	if (stake.value == "") {
		showToast("请输入投注金额");
		return;
	}
	if (Number(stake.value) < Number(sportsBetInfo.singleTicketInfo.minBet)) {
		showToast("投注金额未达到最低限额");
		return;
	}
	if (Number(stake.value) > Number(sportsBetInfo.balance)) {
		showToast("余额不足，请先充值");
		return;
	}
	// 单关投注
	!unlickable.value && placeBet();
};
/**
 * 单关下注
 */
const placeBet = async () => {
	unlickable.value = true;
	//	请求最新注单号
	await getBetOrderId();
	// 参数拼接
	const params = {
		vendorTransId: sportsBetInfo.vendorTransId,
		sportType: sportsBetInfo.singleTicketInfo.sportType,
		marketId: sportsBetInfo.singleTicketInfo.marketId,
		price: sportsBetInfo.singleTicketInfo.payoutRate,
		point: sportsBetInfo.singleTicketInfo.point,
		key: sportsBetInfo.singleTicketInfo.key,
		stake: stake.value,
		oddsOption: 1,
	};
	const res = await sportsApi.placeBet(params).catch((err) => err);
	try {
		if (res.data) {
			const result = res.data;
			emit("singleTicketSuccess", result);
			// 刷新余额
			await useUserStore().initUserInfo();
		} else {
			showToast(`投注失败！`);
		}
	} catch {
		showToast(`投注失败！`);
	}
	unlickable.value = false;
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
