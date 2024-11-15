<template>
	<div class="singleTicketFrom">
		<el-input
			v-model.number="stake"
			type="number"
			:min="sportsBetInfo.singleTicketInfo.minBet"
			:max="sportsBetInfo.singleTicketInfo.maxBet"
			:placeholder="`限额 ${common.formatFloat(sportsBetInfo.singleTicketInfo.minBet) || '0.00'} ～ ${common.formatFloat(sportsBetInfo.singleTicketInfo.maxBet) || '0.00'}`"
			@input="onInputEnter"
			@keydown="preventDecimal"
		>
			<template #suffix>{{ UserStore.getUserInfo.mainCurrency }}</template>
		</el-input>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import showToast from "/@/hooks/useToast";
import common from "/@/utils/common";
import sportsApi from "/@/api/sports/sports";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { useUserStore } from "/@/stores/modules/user";
import { ElMessage } from "element-plus";
const UserStore = useUserStore();
const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();
let stake = computed(() => shopCartPubSub.betValueState.singleTicketBetValue);
const onInputEnter = (value: string) => {
	// 处理对应的金额业务
	shopCartPubSub.setSingleTicketBetValue(value);
};

const preventDecimal = (event: KeyboardEvent) => {
	if (event.key === "." || event.key === "-" || event.key === "+") {
		event.preventDefault();
	}
};

watch(
	() => sportsBetInfo.singleTicketInfo.maxBet,
	(maxBet) => {
		if (Number(stake.value || 0) > Number(maxBet)) {
			ElMessage({ type: "warning", offset: 200, message: "投注金额不可以超过限红，请重新投注！" });
			shopCartPubSub.setSingleTicketBetValue("");
		}
	}
);
</script>

<style lang="scss" scoped>
.singleTicketFrom {
	padding: 6px 15px;
	border-radius: 8px;
	background: var(--Bg-4);

	.el-input {
		height: 50px;

		:deep() {
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
</style>
