<template>
	<div v-if="market?.selections">
		<template v-if="typeof betType === 'number'">
			<div class="marketColumn">
				<MarketCard
					v-for="(item, index) in marketsMatchData(sportInfo.markets, betType, selectionsLength)?.selections"
					:key="index"
					:cardType="cardType"
					:cardData="item"
					:sportInfo="sportInfo"
					:market="market"
					:betType="betType"
					@oddsChange="oddsChange"
				/>
			</div>
		</template>
		<div style="flex-direction: row" class="marketColumn market-row" v-else v-for="(type, index) in betType" :key="type" :style="{ marginTop: index === 1 ? '4px' : '' }">
			<MarketCard
				v-for="(item, index) in marketsMatchData(sportInfo.markets, type, selectionsLength)?.selections"
				:key="index"
				:cardType="cardType"
				:cardData="item"
				:sportInfo="sportInfo"
				:market="marketsMatchData(sportInfo.markets, type, selectionsLength)"
				:betType="type"
				@oddsChange="oddsChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import MarketCard from "../marketCard/marketCard.vue";
import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";
import { template } from "lodash-es";

const emit = defineEmits(["oddsChange"]);

interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小 */
	cardType: "capot" | "handicap" | "magnitude";
	/** 体育信息（每一行）*/
	sportInfo: any;
	/** 投注类型 */
	betType: number | number[];
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
	width: 116px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	&.market-row {
		width: 236px !important;
	}
}
</style>
