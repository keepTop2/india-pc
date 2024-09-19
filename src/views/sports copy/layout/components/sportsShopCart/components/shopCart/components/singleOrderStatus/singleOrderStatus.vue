<!--
 * @Author: WangMingxin
 * @Description: 一个单子(单注) -下注后的结果面板
-->
<template>
	<div class="shopCart">
		<div class="header-container">
			<span class="close_icon" @click.stop="click_clear"><svg-icon name="sports-close" size="30px"></svg-icon></span>

			<cardStatus :betStatus="placeBetRes.betStatus" />
		</div>
		<!-- 购物车卡片 -->
		<div class="container-main">
			<ShopCard :shopData="shopData" :hasClose="false"></ShopCard>
			<!--单串-->
			<div class="singlePass">
				<!--投注信息-->
				<div class="bet-info">
					<div class="cell">
						<span class="label">投注金额</span>
						<span class="value success">{{ Common.formatFloat(betInfo?.stake) || "0.00" }}</span>
					</div>
					<div class="cell">
						<span class="label">可赢金额</span>
						<span class="value success">{{ Common.formatFloat(betInfo?.winnable) }}</span>
					</div>
					<div class="cell">
						<span class="label">注单号</span>
						<span class="value">{{ vendorTransId }}</span>
					</div>
				</div>
				<el-button @click="onOrderEnd">确认</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Common from "/@/utils/common";
import { cardStatus, ShopCard } from "../index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const sportsBetEvent = useSportsBetEventStore();
const ShopCatControlStore = useShopCatControlStore();

const emits = defineEmits(["onOrderEnd", "onKeepOrder", "refreshBalance"]);

const props = withDefaults(
	defineProps<{
		/** 选中的商品详细 */
		shopData?: any;
		/** 下单值  */
		betInfo?: any;
		/** 下单后的返回  */
		placeBetRes?: any;
		/** 订单提交的订单号  */
		vendorTransId: string;
	}>(),
	{
		shopData: () => {
			return {};
		},
	}
);

const click_clear = () => {
	sportsBetEvent.clearShopCart();
	ShopCatControlStore.setShopCatShow(false);
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
</script>

<style scoped lang="scss">
.shopCart {
	width: 100%;
	min-height: 100%;
	background: var(--Bg1);
	color: var(--Text_s);
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
			background-color: var(--Line_1);
			box-shadow: 0px 1px 0px 0px #343d48;
		}
	}
}

.singlePass {
	margin-top: 4px;
	padding: 10px 15px 15px;
	border-radius: 8px;
	align-items: center;
	background: var(--Bg4);
	:deep(.el-button) {
		margin-top: 10px;
		border-radius: 4px;
		height: 48px;
		width: 100%;
		border: 1px solid var(--Theme);
		background: var(--Theme);
		color: var(--Text_a);
	}

	.bet-info {
		display: grid;
		gap: 10px;

		.cell {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.label {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 500;
				line-height: 20px;
			}
			.value {
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
			}

			.success {
				color: var(--Success);
			}
		}
	}
}
</style>
