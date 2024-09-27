<template>
	<div class="singleTicketFrom">
		<el-input
			v-model="stake"
			type="number"
			:min="sportsBetInfo.singleTicketInfo.minBet"
			:max="sportsBetInfo.singleTicketInfo.maxBet"
			:placeholder="`限额 ${common.formatFloat(sportsBetInfo.singleTicketInfo.minBet) || '0.00'} ～ ${common.formatFloat(sportsBetInfo.singleTicketInfo.maxBet) || '0.00'}`"
			@input="onInputEnter"
		>
			<template #suffix>USD</template>
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

const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();
let stake = computed(() => shopCartPubSub.betValueState.singleTicketBetValue);

const onInputEnter = (value: string) => {
	// 处理对应的金额业务
	shopCartPubSub.setSingleTicketBetValue(value);
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
</style>
