<template>
	<div class="shopCart">
		<div class="header-container">
			<span class="close_icon" @click="onOrderConfirm"><svg-icon name="sports-close" size="30px"></svg-icon></span>
			<CardStatus :betStatus="props.data.betStatus" />
		</div>
		<!-- 购物车卡片 -->
		<div class="container-main">
			<!-- 赛事列表 单关串关公用 -->
			<EventCard v-for="(data, index) in sportsBetEvent.sportsBetEventData" :key="index" :shopData="data" :hasClose="false" />
			<!--单串-->
			<div class="singlePass">
				<!--投注信息-->
				<div class="bet-info">
					<div class="cell">
						<span class="label">{{ $.t(`sports['投注金额']`) }}</span>
						<span class="value success">{{ common.formatFloat(props.data.stake) }}</span>
					</div>
					<div class="cell">
						<span class="label">{{ $.t(`sports['可赢金额']`) }}</span>
						<span class="value success">{{ singleTicketWinningAmount }}</span>
					</div>
					<div class="cell">
						<span class="label">{{ $.t(`sports['注单号']`) }}</span>
						<span class="value">{{ sportsBetInfo.vendorTransId }}</span>
					</div>
				</div>
				<el-button @click="onOrderConfirm">{{ $.t(`sports['确认']`) }}</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import common from "/@/utils/common";
import { EventCard, CardStatus } from "../index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
import { computed } from "vue";
import { i18n } from "/@/i18n/index";
const $: any = i18n.global;
const sportsBetEvent = useSportsBetEventStore();
const ShopCatControlStore = useShopCatControlStore();
const sportsBetInfo = useSportsBetInfoStore();

const emit = defineEmits(["onOrderConfirm"]);

const props = withDefaults(
	defineProps<{
		data: any;
	}>(),
	{
		data: {},
	}
);

const singleTicketWinningAmount = computed(() => {
	const amount = common.mul(props.data.currentPrice, props.data.stake);
	const result = common.sub(amount, props.data.stake);
	return result ? common.formatFloat(result) : 0;
});

const onOrderConfirm = () => {
	emit("onOrderConfirm");
};
</script>

<style scoped lang="scss">
.shopCart {
	width: 100%;
	min-height: 100%;
	background: var(--Bg-1);
	color: var(--Text-s);
	box-sizing: border-box;

	.header-container {
		position: relative;
		height: 52px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0px 15px;
		.close_icon {
			position: absolute;
			top: 50%;
			right: 15px;
			transform: translate(0px, -50%);
			width: 30px;
			height: 30px;
			cursor: pointer;
			z-index: 999;
		}
	}

	.container-main {
		position: relative;
		overflow-y: hidden;
		padding: 10px 15px 15px;
		&::after {
			position: absolute;
			content: "";
			top: 0px;
			left: 0px;
			width: 100%;
			height: 1px;
			background-color: var(--Line-1);
			box-shadow: 0px 1px 0px 0px #343d48;
		}
	}
}

.singlePass {
	margin-top: 4px;
	padding: 10px 15px 15px;
	border-radius: 8px;
	align-items: center;
	background: var(--Bg-4);
	:deep(.el-button) {
		margin-top: 10px;
		border-radius: 4px;
		height: 48px;
		width: 100%;
		border: 1px solid var(--Theme);
		background: var(--Theme);
		color: var(--Text-a);
	}

	.bet-info {
		display: grid;
		gap: 10px;

		.cell {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.label {
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 500;
				line-height: 20px;
			}
			.value {
				color: var(--Text-1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
			}

			.success {
				color: var(--success);
			}
		}
	}
}
</style>
