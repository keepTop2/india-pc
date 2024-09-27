<template>
	<div class="singleTicketFrom">
		<el-input
			v-model="stake"
			type="number"
			:min="sportsBetInfo.singleTicketInfo.minBet"
			:max="sportsBetInfo.singleTicketInfo.maxBet"
			:placeholder="`限额 ${common.formatFloat(sportsBetInfo.singleTicketInfo.minBet) || '0.00'} ～ ${common.formatFloat(sportsBetInfo.singleTicketInfo.maxBet) || '0.00'}`"
		>
			<template #suffix>USD</template>
		</el-input>
	</div>
	<div class="footer">
		<div class="btns">
			<!-- 投注按钮 -->
			<BetButton @onClick="onBet" />
			<!-- 加串按钮 -->
			<AddButton />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import showToast from "/@/hooks/useToast";
import { BetButton, AddButton } from "../../../components/btns/index";
import common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";

const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();
const stake = ref(""); // 初始化 stake

const emit = defineEmits(["singleTicketSuccess"]);

// 监听 stake 的变化
watch(
	stake, // 监听 stake 自身的变化
	(newStake) => {
		// 如果 newStake 为空值，直接将 stake 设为空字符串
		if (newStake === null || newStake === undefined || newStake === "") {
			stake.value = ""; // 设为空字符串
			shopCartPubSub.setSingleTicketBetValue(stake.value);
			return; // 退出当前逻辑，不进行后续计算
		}

		const balance = Math.floor(Number(sportsBetInfo.balance));
		const maxBet = Math.floor(Number(sportsBetInfo.singleTicketInfo.maxBet));

		// 如果余额为负，设置 stake 为 "0"
		if (balance < 0) {
			stake.value = "0";
		} else {
			const currentBetValue = Number(newStake); // 获取变化后的 stake 值
			// 根据 balance 和 maxBet 限制 stake 的值
			if (balance < maxBet) {
				stake.value = currentBetValue > balance ? balance.toString() : currentBetValue.toString();
			} else {
				stake.value = currentBetValue > maxBet ? maxBet.toString() : currentBetValue.toString();
			}
		}
		// 派发单关输入金额
		shopCartPubSub.setSingleTicketBetValue(stake.value);
	}
);

// 点击投注
const onBet = () => {
	if ([1].includes(sportsBetEvent.bettingStatus)) {
		return;
	}
	if (stake.value == "") {
		showToast("请输入投注金额");
		return;
	}
	if (stake.value < sportsBetInfo.singleTicketInfo.minBet) {
		showToast("投注金额未达到最低限额");
		return;
	}
	if (stake.value > sportsBetInfo.balance) {
		showToast("余额不足，请先充值");
		return;
	}
	// 单关投注
	placeBet();
};

/**
 * 单关下注
 */
const placeBet = async () => {
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
	if (res.data) {
		const result = res.data;
		emit("singleTicketSuccess", result);
	}
};
</script>

<style lang="scss" scoped>
.singleTicketFrom {
	padding: 6px 15px;
	border-radius: 8px;
	background: var(--Bg4);

	.el-input {
		height: 50px;

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
