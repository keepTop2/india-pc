<template>
	<div class="shopCart">
		<div class="header-container">
			<span class="close_icon" @click="onOrderConfirm"><svg-icon name="sports-close" size="30px"></svg-icon></span>
			<CardStatus :betStatus="props.data.betStatus" />
		</div>
		<!-- 购物车卡片 -->
		<div class="container-main">
			<div class="card-all">
				<div class="commodity">
					<!-- 赛事列表 单关串关公用 -->
					<EventCard v-for="(data, index) in sportsBetEvent.sportsBetEventData" :key="index" :shopData="data" :hasClose="false" />
				</div>
				<!-- 下注后的详细卡片 -->
				<div class="money-plan">
					<div class="placeParlayBetResult" v-for="(item, index) in props.data.currentCombos" :key="index">
						<!-- 赔率注单 -->
						<div class="cell">
							<div class="left">
								<span class="title">{{ SportsCommon.comboTypeNameMaps[item.comboType] }}</span>
								<span>注单已确认</span>
							</div>
							<div class="right">
								<span class="unitPrice">{{ Common.formatFloat(item.stake) }} </span>
								<span>x{{ item.betCount }} </span>
							</div>
						</div>
						<!-- 可赢价格 -->
						<div class="cell">
							<div class="left">
								<span>预计可赢:</span> <span class="main-currency">{{ getParlayTicketsWinningAmount(item) }} {{ UserStore.getUserInfo.mainCurrency }}</span>
							</div>
							<div class="right">
								<span>小计: {{ Common.formatFloat(Common.mul(item.stake, item.betCount)) }} {{ UserStore.getUserInfo.mainCurrency }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--多串-->
			<div class="moreShop">
				<el-button @click="onOrderConfirm">
					<span>确认</span>
					<span v-if="props.data.betStatus == 0">&nbsp;合计:{{ singleTicketWinningAmount }}</span>
				</el-button>
				<el-button class="btnKeep" @click="onSecondBet">保留选项，继续投注</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import Common from "/@/utils/common";
import SportsCommon from "/@/views/sports/utils/common";
import { EventCard, CardStatus } from "../index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useUserStore } from "/@/stores/modules/user";
const UserStore = useUserStore();
const sportsBetEvent = useSportsBetEventStore();

const emit = defineEmits(["onOrderConfirm", "onSecondBet"]);

const props = withDefaults(
	defineProps<{
		data: any;
	}>(),
	{
		data: {},
	}
);
// 计算预计可赢
const getParlayTicketsWinningAmount = (item: any) => {
	const amount = Common.mul(item.comboPrice, item.stake);
	const stake = Common.mul(item.betCount, item.stake);
	const value = isNaN(stake) ? 0 : Common.sub(amount, stake);
	return Common.formatFloat(value);
};

// 计算小计得出总计
const singleTicketWinningAmount = computed(() => {
	const totalValue = props.data?.currentCombos.reduce((total, obj) => {
		const stake = Common.mul(obj.betCount, parseFloat(obj.stake));
		return total + stake;
	}, 0);
	return Common.formatFloat(totalValue);
});

const onOrderConfirm = () => {
	emit("onOrderConfirm");
};

/**
 * @description 二次投注
 */
const onSecondBet = () => {
	emit("onSecondBet");
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

		.money-plan {
			display: grid;
			gap: 6px;
			margin-top: 6px;

			.placeParlayBetResult {
				width: 100%;
				height: 80px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 15px 15px 10px 15px;
				box-sizing: border-box;
				border-radius: 8px;
				background: var(--Bg-4);

				.cell {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left,
					.right {
						color: var(--Text-1);
						font-family: "PingFang SC";
						font-size: 14px;
						font-weight: 400;
						line-height: normal;
						.title {
							color: var(--Text-s);
							font-family: "PingFang SC";
							font-size: 16px;
							font-weight: 500;
							margin-right: 6px;
						}
						.unitPrice {
							margin-right: 6px;
							color: var(--Text-s);
							font-family: "PingFang SC";
							font-size: 20px;
							font-weight: 500;
						}
						.main-currency {
							color: var(--Text_a);
						}
						.success {
							color: var(--success);
						}
					}
				}
			}
		}
	}
}

.singlePass {
	padding: 15px;
	border-radius: 8px;
	margin: 5px 0 0;
	align-items: center;
	background: var(--Bg-3);

	.bet-info {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: 10px;

		& > div {
			display: flex;
			align-items: center;
			justify-content: space-between;

			span {
				font-size: 14px;
			}

			& > span:last-child {
				color: var(--Theme);
			}

			.transId {
				color: var(--Text-1);
			}
		}
	}
}
.moreShop {
	margin-top: 5px;
	padding: 15px;
	border-radius: 8px;
	align-items: center;
	position: sticky;
	bottom: 0;
	z-index: 99;
	display: grid;
	gap: 5px;
	background: var(--Bg-4);

	:deep(.el-button) {
		border-radius: 4px;
		height: 48px;
		width: 100%;
		border: 1px solid var(--Theme);
		background: var(--Theme);
		color: var(--Text-a);
	}

	.btnKeep {
		margin: 0px;
		border: 1px solid var(--Theme);
		background: var(--Bg-4);
		color: var(--Theme);
	}
}

.card-all {
	overflow: auto;
	max-height: 400px;

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
