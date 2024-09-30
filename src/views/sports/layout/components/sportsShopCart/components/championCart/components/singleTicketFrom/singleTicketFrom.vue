<template>
	<div class="singlePass">
		<el-input
			v-model="stake"
			type="number"
			:min="common.formatFloat(sportsBetInfo.championSingleTicketInfo.minBet)"
			:max="common.formatFloat(sportsBetInfo.championSingleTicketInfo.maxBet)"
			:placeholder="`限额 ${common.formatFloat(sportsBetInfo.championSingleTicketInfo.minBet)} ～ ${common.formatFloat(sportsBetInfo.championSingleTicketInfo.maxBet)}`"
			@input="onInputEnter"
		>
			<template #suffix>USD</template>
		</el-input>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import common from "/@/utils/common";
import shopCartChampionPubSub from "/@/views/sports/hooks/shopCartChampionPubSub";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
const sportsBetInfo = useSportsBetInfoStore();
let stake = computed(() => shopCartChampionPubSub.betValueState.singleTicketBetValue);

const onInputEnter = (value: string) => {
	// 处理对应的金额业务
	shopCartChampionPubSub.getSingleTicketBetValue(value);
};
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
				box-shadow: none;
				border: none;
				background: var(--Bg4);

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
