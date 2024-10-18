<template>
	<div class="footer">
		<AuthHintDialog />
		<div class="btns">
			<!-- 删除按钮 -->
			<DeleteButton v-if="ChampionShopCartStore.championBetData.length > 1" @onClick="clearChampionShopCart" />
			<!-- 冠军投注按钮 -->
			<ChampionBetButton v-if="ChampionShopCartStore.championBetData.length >= 1 && ChampionShopCartStore.championBetData[0].type === '1'" @onClick="onChampionBet" />
			<!-- 赛事投注按钮 -->
			<EventBetButton v-if="ChampionShopCartStore.championBetData.length == 1 && ChampionShopCartStore.championBetData[0].type === '0'" @onClick="onEventBet" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { DeleteButton, ChampionBetButton, EventBetButton } from "../../../components/btns/index";
import showToast from "/@/hooks/useToast";
import sportsApi from "/@/api/sports/sports";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { computed, ref } from "vue";
import shopCartChampionPubSub from "/@/views/sports/hooks/shopCartChampionPubSub";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { AuthHintDialog } from "/@/views/sports/layout/components/sportsShopCart/components/shopCart/components/index";
import { i18n } from "/@/i18n/index";
import { getBetOrderId } from "/@/views/sports/utils/commonFn";
import { useUserStore } from "/@/stores/modules/user";
const $: any = i18n.global;
const sportsBetInfo = useSportsBetInfoStore();
const ChampionShopCartStore = useSportsBetChampionStore();

let stake = computed(() => shopCartPubSub.betValueState.singleTicketBetValue);
let championStake = computed(() => shopCartChampionPubSub.betValueState.singleTicketBetValue);

const emit = defineEmits(["singleTicketSuccess"]);
// 请求注单下注期间不可点击
const unlickable = ref(false);
// 赛事投注
const onEventBet = () => {
	console.log("触发赛事投注");
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
		} else {
			showToast(`sports['投注失败！']`);
			// 刷新余额
			useUserStore().initUserInfo();
		}
	} catch {
		showToast(`sports['投注失败！']`);
	}
	unlickable.value = false;
};

// 冠军投注
const onChampionBet = () => {
	if (championStake.value == "") {
		showToast($.t(`sports['请输入投注金额']`));
		return;
	}
	if (Number(championStake.value) < Number(sportsBetInfo.championSingleTicketInfo.minBet)) {
		showToast($.t(`sports['投注金额未达到最低限额']`));
		return;
	}
	if (Number(championStake.value) > Number(sportsBetInfo.balance)) {
		showToast($.t(`sports['余额不足，请先充值']`));
		return;
	}
	// 单关投注
	placeOutrightBet();
};

/**
 * 冠军单关下注
 */
const placeOutrightBet = async () => {
	// 参数拼接
	const params = {
		vendorTransId: sportsBetInfo.vendorTransId,
		sportType: sportsBetInfo.championSingleTicketInfo.sportType,
		orid: sportsBetInfo.championSingleTicketInfo.orid,
		price: sportsBetInfo.championSingleTicketInfo.price,
		stake: championStake.value,
	};
	const res = await sportsApi.PlaceOutrightBet(params).catch((err) => err);
	if (res.data) {
		const result = res.data;
		emit("singleTicketSuccess", result);
	}
};

/**
 * @description 清空冠军购物车
 */
const clearChampionShopCart = () => {
	ChampionShopCartStore.clearChampionShopCart();
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
