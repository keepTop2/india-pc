<template>
	<div class="btn-container">
		<!-- 正常投注 -->
		<div v-if="sportsBetEvent.bettingStatus == 0" class="btn" @click="emit('onClick')">
			<div class="label_one">投注</div>
			<div class="label_two">
				<span>最高可赢</span>
				<!-- 单关最高可赢展示 -->
				<span v-if="sportsBetEvent.sportsBetEventData.length == 1">{{ singleTicketWinningAmount }}</span>
				<!-- 串关最高可赢展示 -->
				<span v-if="sportsBetEvent.sportsBetEventData.length > 1">{{ getParlayTicketsWinningAmount }}</span>
			</div>
		</div>
		<div v-if="sportsBetEvent.bettingStatus == 1" class="disabled">盘口关闭</div>
		<div v-if="sportsBetEvent.bettingStatus == 2" class="disabled">不支持串关</div>
		<div v-if="sportsBetEvent.bettingStatus == 3" class="disabled">至少选择{{ combo }}场比赛</div>
		<div v-if="sportsBetEvent.bettingStatus == 4" class="btn" @click="oddsChanges">接受赔率变化</div>
		<div v-if="sportsBetEvent.bettingStatus == 5" class="disabled">暂不支持下注</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from "vue";
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { storeToRefs } from "pinia";
const sportsBetEvent = useSportsBetEventStore();

const { combo } = storeToRefs(sportsBetEvent);

// 单关可赢金额
const singleTicketWinningAmount = computed(() => shopCartPubSub.getSingleTicketWinningAmount());
// 串关可赢金额
const getParlayTicketsWinningAmount = computed(() => shopCartPubSub.getParlayTicketsWinningAmount());

// 定义 emit 事件
const emit = defineEmits<{
	(e: "onClick"): void;
}>();

/**
 * @description 接受赔率变化
 */
const oddsChanges = () => {
	sportsBetEvent.bettingStatus = 0; // 修改成为投注状态
};
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
		background-color: var(--Bg-5);
		cursor: pointer;
		user-select: none;
		.label_one {
			color: var(--Text-s);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
		}
		.label_two {
			color: var(--Text-s);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
		}
	}

	.disabled {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background-color: var(--Butter);
		cursor: no-drop;
		user-select: none;
	}
}
</style>
