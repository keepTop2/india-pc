<template>
	<div class="marketColumn" v-if="sportInfo">
		<template v-for="(item, index) in sportInfo.teams" :key="index">
			<MarketCard v-if="item.price" :displayContent="displayContent" :cardData="item" :sportInfo="sportInfo" @oddsChange="oddsChange" />
		</template>
	</div>
</template>

<script setup lang="ts">
import MarketCard from "../marketCard/marketCard.vue";

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
.marketColumn {
	display: grid;
	grid-template-columns: repeat(2, 1fr); // 设置为两列，每列平分宽度
	gap: 10px; // 设置行与列之间的间距为 10px
}
</style>
