<template>
	<div class="moreShop" ref="moreShopRef">
		<div class="commodity">
			<!--商品卡片-->
			<ShopCard v-for="(data, index) in sportsBetEvent.sportsBetEventData" :key="index" :shopData="data" :hasClose="true" />
		</div>
		<div class="money-plan">
			<!-- 金额输入 -->
			<Crosstalk ref="CrosstalkRefs" v-for="(item, index) in sportsBetInfo.parlayTicketsInfo.combos" :comboInfo="item" />
		</div>
	</div>
</template>
<script setup lang="ts">
// 引入组件
import { ShopCard } from "../index";
import Crosstalk from "./components/crosstalk/crosstalk.vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useSportsBetInfoStore } from "/@/stores/modules/sports/sportsBetInfo";
const sportsBetEvent = useSportsBetEventStore();
const sportsBetInfo = useSportsBetInfoStore();
</script>

<style scoped lang="scss">
.commodity,
.money-plan {
	display: grid;
	gap: 6px;
}

.money-plan {
	margin-top: 6px;
}
</style>
