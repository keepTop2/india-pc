<template>
	<div class="btn-container">
		<div class="btn" @click="emit('onClick')">
			<div class="label_one">投注</div>
			<div class="label_two">
				<span>最高可赢</span>
				<span v-if="sportsBetEvent.sportsBetEventData.length == 1">{{ singleTicketWinningAmount }}</span>
				<span v-if="sportsBetEvent.sportsBetEventData.length > 1">{{ getParlayTicketsWinningAmount }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from "vue";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

const sportsBetEvent = useSportsBetEventStore();
// 单关可赢金额
const singleTicketWinningAmount = computed(() => shopCartPubSub.getSingleTicketWinningAmount());
// 串关可赢金额
const getParlayTicketsWinningAmount = computed(() => shopCartPubSub.getParlayTicketsWinningAmount());

// 定义 emit 事件
const emit = defineEmits<{
	(e: "onClick"): void;
}>();
</script>

<style scoped lang="scss">
.btn-container {
	flex: 1;
	height: 48px;
	border-radius: 4px;
	overflow: hidden;
	.btn {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background-color: var(--Bg5);
		cursor: pointer;
		user-select: none;
		.label_one {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
		}
		.label_two {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
		}
	}
}
</style>
