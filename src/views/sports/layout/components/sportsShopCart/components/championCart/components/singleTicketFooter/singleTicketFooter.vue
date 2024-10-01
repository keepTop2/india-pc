<template>
	<div class="footer">
		<AuthHintDialog />
		<div class="btns">
			<!-- 删除按钮 -->
			<DeleteButton v-if="ChampionShopCartStore.championBetData.length > 1" />
			<!-- 投注按钮 -->
			<BetButton v-if="props.cartStatus === 'champion'" @onClick="onBet" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { DeleteButton } from "../../../components/btns/index";
import BetButton from "/@/views/sports/layout/components/sportsShopCart/components/components/btns/championBetButton.vue";
import showToast from "/@/hooks/useToast";
import sportsApi from "/@/api/sports/sports";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { computed } from "vue";
import shopCartChampionPubSub from "/@/views/sports/hooks/shopCartChampionPubSub";
import { AuthHintDialog } from "/@/views/sports/layout/components/sportsShopCart/components/shopCart/components/index";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const sportsBetInfo = useSportsBetInfoStore();
const ChampionShopCartStore = useSportsBetChampionStore();
let stake = computed(() => shopCartChampionPubSub.betValueState.singleTicketBetValue);

const emit = defineEmits(["singleTicketSuccess"]);

const props = withDefaults(
	defineProps<{
		// 购物车状态  冠军购物车外部传递进来
		cartStatus: "champion" | "events" | "";
	}>(),
	{
		cartStatus: "",
	}
);

const onBet = () => {
	if (stake.value == "") {
		showToast($.t(`sports['请输入投注金额']`));
		return;
	}
	if (stake.value < sportsBetInfo.championSingleTicketInfo.minBet) {
		showToast($.t(`sports['投注金额未达到最低限额']`));
		return;
	}
	if (stake.value > sportsBetInfo.balance) {
		showToast($.t(`sports['余额不足，请先充值']`));
		return;
	}
	// 单关投注
	placeOutrightBet();
};

/**
 * 单关下注
 */
const placeOutrightBet = async () => {
	// 参数拼接
	const params = {
		vendorTransId: sportsBetInfo.vendorTransId,
		sportType: sportsBetInfo.championSingleTicketInfo.sportType,
		orid: sportsBetInfo.championSingleTicketInfo.orid,
		price: sportsBetInfo.championSingleTicketInfo.price,
		stake: stake.value,
	};
	const res = await sportsApi.PlaceOutrightBet(params).catch((err) => err);
	if (res.data) {
		const result = res.data;
		emit("singleTicketSuccess", result);
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
