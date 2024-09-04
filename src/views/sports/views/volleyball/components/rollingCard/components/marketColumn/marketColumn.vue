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
import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";

const emit = defineEmits(["oddsChange"]);

interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小 */
	cardType: "capot" | "handicap" | "magnitude";
	/** 体育信息（每一行）*/
	sportInfo: any;
	/** 投注类型 */
	betType: number;
	/** 对应selections的长度（用于设置空数据量）  */
	selectionsLength: number;
}

const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	sportInfo: [],
	betType: 1,
	selectionsLength: 1,
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
	market.value = marketsMatchData(props.sportInfo.markets, props.betType, props.selectionsLength);
};

/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};
</script>

<style scoped lang="scss">
.marketColumn {
	/* width: 100%;
	height: 100%; */
}
</style>
