<template>
	<div class="btn-container">
		<!-- 正常投注 -->
		<div class="btn" @click="emit('onClick')">
			<div class="label_one">{{ $.t(`sports['投注']`) }}</div>
			<div class="label_two">
				<span>{{ $.t(`sports.betRecord['最高可赢']`) }}</span>
				<!-- 单关最高可赢展示 -->
				<span>{{ singleTicketWinningAmount }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from "vue";
import shopCartChampionPubSub from "/@/views/sports/hooks/shopCartChampionPubSub";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
const ChampionShopCartStore = useSportsBetChampionStore();
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;

// 单关可赢金额
const singleTicketWinningAmount = computed(() => shopCartChampionPubSub.getSingleTicketWinningAmount());

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
