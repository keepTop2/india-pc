<!--
 * @Author: WangMingxin
 * @Description: 体育-网球-赔率卡片列；
-->
<template>
	<div
		:class="[
			!props.displayContent ? 'hideToggle' : 'showToggle',
			{
				columns: filterSelections(market.selections).length % 2 != 0 && !isbladder(market?.selections.betType),
				marketColumn: !(filterSelections(market.selections).length % 2 != 0 && !isbladder(market?.selections.betType)),
			},
		]"
		v-if="market?.selections"
	>
		<template v-for="(item, index) in market?.selections" :key="index">
			<MarketCard :cardType="cardType" :cardData="item" :sportInfo="sportInfo" :market="market" :betType="betType" @oddsChange="oddsChange"></MarketCard>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { MarketCard } from "../index";
import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";

const emit = defineEmits(["oddsChange"]);

interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小    none:无类型 */
	cardType?: "capot" | "handicap" | "magnitude" | "none";
	/** 体育信息（每一行）*/
	sportInfo: object;
	// /** 投注类型 */
	// betType: number;
	displayContent: boolean;
	/** 盘口对象  */
	market: object;
}

/**
 * @description 筛选判断是否一行三列
 */
const isbladder = (type) => {
	const arr = [4, 30, 152, 416, 413, 414, 165, 166, 392, 399, 405, 413, 414, 1302, 1317, 3900, 3910, 3917];
	return arr.includes(type);
};
const filterSelections = (data) => {
	return data.filter((item) => {
		return item.oddsPrice.decimalPrice != 0;
	});
};

const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	sportInfo: () => {
		return {};
	},
	// betType: 1,
	displayContent: false,
	market: () => {
		return {};
	},
});

/** 直接获取当前对象 market */
// const market = ref();
onMounted(() => {
	getBetType();
	// setMarket();
	watchEffect(() => {
		getBetType();
		// setMarket();
	});
});
// /** 设置market */
// const setMarket = () => {
// 	market.value = marketsMatchData(props.sportInfo.markets, props.betType);
// };

/** 直接获取当前对象 market */
const betType = ref();
/**获取BetType */
const getBetType = () => {
	const betTypeStr = `${props.market?.betType}-${props.market?.marketId}`;
	if (Object.prototype.hasOwnProperty.call(props.sportInfo?.markets, betTypeStr)) {
		betType.value = betTypeStr;
	} else {
		betType.value = props.market?.betType;
	}
};

/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};
</script>

<style scoped lang="scss">
.columns {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(calc(33.3% - 8px), 1fr));
	gap: 4px;
}
.marketColumn {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(calc(50% - 8px), 1fr));
	gap: 4px;
}
.hideToggle {
	transition: height 0.5s ease;
	height: 0;
	overflow: hidden;
}

.showToggle {
	transition: height 0.5s ease;
	height: auto;
	padding: 0 8px 8px 8px;
}
</style>
