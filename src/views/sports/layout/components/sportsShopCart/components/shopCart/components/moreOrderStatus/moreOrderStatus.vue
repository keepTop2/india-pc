<!--
 * @Author: WangMingxin
 * @Description: 多个单子(串单) -下注后的结果面板
-->
<template>
	<div class="shopCart">
		<div class="header-container">
			<cardStatus :betStatus="placeParlayRes?.betStatus" @changeOrderStatus="changeOrderStatus" />
		</div>
		<!-- 购物车卡片 -->
		<div class="container-main">
			<div class="card-all">
				<div class="commodity">
					<!--商品卡片-->
					<ShopCard v-for="(item, index) in sportsBetEventData" :key="index" :shopData="item" :hasClose="false" />
				</div>
				<!-- 下注后的详细卡片 -->
				<div class="money-plan">
					<PlaceParlayBetResult v-for="(item, index) in parlayTickets?.combos" :key="index" :comboInfo="item" :bettingMony="bettingMony"></PlaceParlayBetResult>
				</div>
			</div>
			<!--多串-->
			<div class="moreShop">
				<div v-if="placeParlayRes?.betStatus == 1">
					<el-button @click="onOrderEnd">确认</el-button>
				</div>
				<div v-if="placeParlayRes?.betStatus == 0">
					<el-button @click="onOrderEnd">确认&nbsp;合计:&nbsp;{{ Common.formatFloat(sunSubtotal) }}</el-button>
				</div>
				<div>
					<el-button class="btnKeep" @click="onKeepOrder">保留选项，继续投注</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import Common from "/@/utils/common";
import { cardStatus, ShopCard } from "../index";
import { PlaceParlayBetResult } from "./components/index";
const emits = defineEmits(["onOrderEnd", "onKeepOrder", "refreshBalance"]);

const props = withDefaults(
	defineProps<{
		/**所有下注额度 */
		bettingMony: Array<any>;
		/** 当前购物车数据 */
		sportsBetEventData: Array<any>;
		/** 取得串关注单的相关信息 */
		parlayTickets: any;
		/** 下单成功返回对象 */
		placeParlayRes: any;
		/** 下单总额度 */
		sunSubtotal: number;
	}>(),
	{
		sunSubtotal: 0,
	}
);

/**
 * @description: 更改订单状态；
 * @param {*} status 订单状态值
 * @return {*}
 */
const changeOrderStatus = (status: boolean) => {
	onOrderEnd();
};

/**
 * @description: 下单确认结束
 * @return {*}
 */
const onOrderEnd = () => {
	emits("refreshBalance");
	emits("onOrderEnd");
};
/**
 * @description: 订单提交后保留购物车；
 * @return {*}
 */
const onKeepOrder = () => {
	emits("refreshBalance");
	emits("onKeepOrder");
};
</script>

<style scoped lang="scss">
.shopCart {
	width: 100%;
	min-height: 100%;
	box-sizing: border-box;
	//padding-bottom: 10px;

	background: var(--Bg1);
	color: var(--Text_s);
	.header-container {
		padding: 6px 15px 0 15px;
		& > div {
			padding: 9px 0;
		}
	}

	.container-main {
		overflow-y: hidden;
		padding: 0 15px;
		margin-bottom: 10px;
	}
}

.singlePass {
	padding: 15px;
	border-radius: 8px;
	margin: 5px 0 0;
	align-items: center;
	background: var(--Bg3);

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
				color: var(--Text1);
			}
		}
	}
}
.moreShop {
	padding: 15px;
	border-radius: 8px;
	margin: 5px 0 0;
	align-items: center;
	position: sticky;
	bottom: 0;
	z-index: 99;
	display: grid;
	gap: 5px;
	background: var(--Bg3);
	// .el-button {
	// 	margin: 0;
	// }

	:deep(.el-button) {
		margin: 0;
		border-radius: 4px;
		height: 48px;
		width: 100%;
		border: 1px solid var(--Theme);
		background: var(--Theme);
		color: var(--Text_a);
	}

	.btnKeep {
		border: 1px solid var(--Theme);
		background: var(--Bg3);
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
