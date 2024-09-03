<!--
 * @Author: WangMingxin
 * @Description: 一个单子(单注) -下注后的结果面板
-->
<template>
	<div class="shopCart">
		<div class="header-container">
			<cardStatus :betStatus="placeBetRes.betStatus" @changeOrderStatus="changeOrderStatus" />
		</div>
		<!-- 购物车卡片 -->
		<div class="container-main">
			<ShopCard :shopData="shopData" :hasClose="false"></ShopCard>
			<!--单串-->
			<div class="singlePass">
				<!--投注信息-->
				<div class="bet-info">
					<div>
						<span>投注金额</span>
						<span>{{ Common.formatFloat(betInfo?.stake) || "0.00" }}</span>
					</div>
					<div>
						<span>可赢金额</span>
						<span>{{ Common.formatFloat(betInfo?.winnable) }}</span>
					</div>
					<div>
						<span>注单号</span>
						<span class="transId">{{ vendorTransId }}</span>
					</div>
				</div>
				<el-button @click="onOrderEnd">确认</el-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import Common from "/@/utils/common";
import { cardStatus, ShopCard } from "../index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";

const emits = defineEmits(["onOrderEnd", "onKeepOrder", "refreshBalance"]);
const sportsBetEvent = useSportsBetEventStore();
// const props = defineProps(["betInfo", "maxWin", "placeBetRes"]);

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
</script>

<style scoped lang="scss">
.shopCart {
	width: 100%;
	min-height: 100%;
	box-sizing: border-box;
	//padding-bottom: 10px;

	@include themeify {
		background: themed("Bg1");
		color: themed("Text_s");
	}

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

	@include themeify {
		background: themed("Bg3");
	}
	:deep(.el-button) {
		margin: 5px 0;
		border-radius: 4px;
		height: 48px;
		width: 100%;
		@include themeify {
			border: 1px solid themed("Theme");
			background: themed("Theme");
			color: themed("Text_a");
		}
	}

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
				@include themeify {
					color: themed("Theme");
				}
			}

			.transId {
				@include themeify {
					color: themed("Text1");
				}
			}
		}
	}
}
</style>
