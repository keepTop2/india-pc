<template>
	<div class="columns marketColumn" v-if="sportInfo" :class="[!props.displayContent ? 'hideToggle' : 'marketColumn']">
		<template v-for="(item, index) in sportInfo.teams" :key="index">
			<MarketCard v-if="item.price" :displayContent="displayContent" :cardData="item" :sportInfo="sportInfo" @oddsChange="oddsChange"></MarketCard>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MarketCard from "../marketCard/marketCard.vue";
// import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";

const emit = defineEmits(["oddsChange"]);

interface CapotCardType {
	/** 体育信息（每一行）*/
	sportInfo: any;
	displayContent: boolean;
}

const props = withDefaults(defineProps<CapotCardType>(), {
	displayContent: true,
	sportInfo: [],
});

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
	padding: 15px 6px;
}
.hideToggle {
	padding: 0 6px;
	gap: 0;
}
</style>
