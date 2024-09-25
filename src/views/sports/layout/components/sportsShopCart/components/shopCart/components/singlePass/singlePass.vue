<template>
	<ShopCard v-for="(data, index) in sportsBetEvent.sportsBetEventData" :key="index" :shopData="data" :hasClose="true" />
	<div class="singlePass">
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// 引入组件
import { ShopCard } from "../index";
import common from "/@/utils/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";

const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();
const stake = ref(""); // 初始化 stake

// 监听 stake 的变化
watch(
	stake, // 监听 stake 自身的变化
	(newStake) => {
		// 如果 newStake 为空值，直接将 stake 设为空字符串
		if (newStake === null || newStake === undefined || newStake === "") {
			stake.value = ""; // 设为空字符串
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
	}
);
</script>

<style lang="scss" scoped>
.singlePass {
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
</style>
