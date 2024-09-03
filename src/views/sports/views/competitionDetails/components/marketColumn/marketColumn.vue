<!--
 * @Author: WangMingxin
 * @Description: 体育-足球-赔率卡片列；
-->
<template>
	<div class="columns marketColumn" v-if="market?.selections">
		<template v-for="(item, index) in market?.selections" :key="index">
			<MarketCard :cardType="cardType" :cardData="item" :sportInfo="sportInfo" :market="market" :betType="betType" @oddsChange="oddsChange"></MarketCard>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import MarketCard from "../marketCard/marketCard.vue";
import { marketsMatchData } from "/@/utils/sports/formattingViewData";

const emit = defineEmits(["oddsChange"]);

interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小 */
	cardType: "capot" | "handicap" | "magnitude";
	/** 体育信息（每一行）*/
	sportInfo: any;
	/** 投注类型 */
	betType: number;
}

const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	sportInfo: [],
	betType: 1,
});

/** 直接获取当前对象 market */
const market = ref();
onMounted(() => {
	setMarket();

	watchEffect(() => {
		setMarket();
	});
});
/** 设置market */
const setMarket = () => {
	market.value = marketsMatchData(props.sportInfo.markets, props.betType);
};

/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};
</script>

<style scoped lang="scss">
.columns,
.marketColumn {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(calc(50% - 8px), 1fr));
	gap: 4px;
	padding: 0 8px 8px 8px;
}
</style>
