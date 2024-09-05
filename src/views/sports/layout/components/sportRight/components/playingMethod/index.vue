<template>
	<div class="playing-method">
		<div class="play-list">
			<div class="scorllbar">
				<div class="scorllbar-content">
					<div class="item" v-for="item in playList" :class="activePlayMethod === item.value && 'active'" @click="activePlayMethod = item.value" :key="item.label">
						{{ item.label }}
					</div>
				</div>
			</div>
			<div style="padding-top: 6px">
				<svg-icon :class="['icon-svg', { expand: computedExpand }]" name="sports-double_arrow_up" @click="onExpandAndCollapse" :size="18" />
			</div>
		</div>
		<template v-for="marketItem in computedMarketsList" :key="marketItem.marketId" v-if="!isEmpty(computedMarketsList)">
			<allField
				:title="marketItem?.betTypeName"
				:marketInfo="marketItem"
				:eventInfo="formatEvent"
				:part="isShowAllField(marketItem?.betType) ? 3 : 2"
				:index="marketItem.betType"
				:expandAndCollapse="find(expandList, { betType: marketItem.betType })?.itemExpand ?? false"
				@updateCollapse="updateCollapse"
			></allField>
			<!-- 全场大小 -->
			<!-- <size :title="marketItem?.betTypeName" v-if="isShowSizeField(marketItem?.betType)" :fieldSizeList="getSizeList(marketItem)" :key="marketItem?.marketId"></size> -->
		</template>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { isEmpty, get, filter, map, cloneDeep, find } from "lodash-es";
import { allField } from "./components/index";
import { SportBetTypeEnum } from "/@/views/sports/enum/sportEnum/sportEnum";
import { Market } from "/@/views/sports/models/interface";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";

const SportHotStore = useSportHotStore();
const { formatEvent } = storeToRefs(SportHotStore);

const props = defineProps<{
	sportEvent: any;
}>();

// 当前访问玩法
const activePlayMethod = ref(0);

// 展示以及收缩玩法列表
const expandList = ref<any>([]);

const onExpandAndCollapse = () => {
	const isExpand = computedExpand.value;

	expandList.value = map(expandList.value, (item: any) => ({
		...item,
		itemExpand: isExpand,
	}));
};

/**
 *  有一个展开就是展开
 */
const computedExpand = computed((): boolean => {
	return !expandList.value.some((it: any) => it.itemExpand);
});

const updateCollapse = (val: any) => {
	expandList.value = map(expandList.value, (item: any) => {
		if (val.betType == item.betType) {
			return val;
		}
		return item;
	});
};

const computedMarketsList = computed(() => {
	if (activePlayMethod.value === 0) {
		return formatEvent.value.markets;
	}
	const markets = get(formatEvent.value, "markets", {});
	return filter(markets, (item: Record<string, any>) => item.betType === activePlayMethod.value);
});

const getMarketsList = (markets: any) => {
	let currentExpandList: any[] = [];

	Object.values(markets).forEach((item: any) => {
		const obj = {
			betType: item.betType,
			itemExpand: true,
		};

		if (!currentExpandList.some((it) => it.betType === item.betType)) {
			currentExpandList.push(obj);
		}
	});

	return currentExpandList;
};

const initExpandList = (newVal: any[], oldVal?: any[]) => {
	const [newEventId, newMarkets] = newVal;
	const [oldEventId] = oldVal ?? [];

	if (!!newMarkets) {
		// 初始化赛事
		if (newEventId !== oldEventId) {
			expandList.value = getMarketsList(newMarkets);

			// 更新赛事
		} else {
			const newList = getMarketsList(newMarkets);
			const originExpandList = cloneDeep(expandList.value);

			expandList.value = newList.map((item: any) => {
				const findItem = find(originExpandList, { betType: item.betType });
				return findItem ? findItem : item;
			});
		}
	}
};

watch(
	() => [props.sportEvent?.eventId, formatEvent.value.markets],
	(newVal, oldVal) => {
		initExpandList(newVal, oldVal);
	},
	{
		immediate: true,
		deep: true,
	}
);

/**
 * 是否显示全场独赢｜全场波胆类型卡片
 * @param betType
 */
const isShowAllField = (betType: number) => {
	return [SportBetTypeEnum.betType_5, SportBetTypeEnum.betType_15, SportBetTypeEnum.betType_152, SportBetTypeEnum.betType_167, SportBetTypeEnum.betType_405].includes(betType);
};

const playList = reactive([
	{
		label: "全部玩法",
		value: 0,
	},
	{
		label: "全部玩法",
		value: 1,
	},
	{
		label: "全部玩法",
		value: 2,
	},
	{
		label: "全部玩法",
		value: 3,
	},
	{
		label: "全部玩法",
		value: 4,
	},
	{
		label: "全部玩法",
		value: 2,
	},
	{
		label: "全部玩法",
		value: 3,
	},
	{
		label: "全部玩法",
		value: 4,
	},
]);
</script>

<style lang="scss" scoped>
.playing-method {
	width: 390px;
	padding: 12px;
	margin-top: -5px;
	box-sizing: border-box;
	background: var(--Bg1);
	& > * {
		margin-bottom: 12px;
	}

	.icon-svg {
		color: var(--icon);
	}

	.expand {
		width: 100%;
		height: 100%;
		transform: rotate(-180deg);
	}

	.play-list {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		// flex-wrap: wrap;
		gap: 14px;
		margin-bottom: 12px;

		& > * {
			flex-shrink: 0;
		}

		.scorllbar {
			width: 340px;
			overflow-x: auto;
			padding-bottom: 8px;
		}
		.scorllbar::-webkit-scrollbar {
			width: 10px;
		}

		.scorllbar::-webkit-scrollbar {
			background-color: transparent;
		}
		.scorllbar::-webkit-scrollbar-thumb {
			background: var(--Bg3);
			border-radius: 25px;
			height: 5px;
		}
		.scorllbar-content {
			display: flex;
			align-items: center;
			width: max-content;
			gap: 6px;
		}

		.item {
			padding: 4px 10px;
			border: 1px solid var(--Icon, #67707b);
			border-radius: 99px;
			font-size: 12px;
			transition: 0.2s;
			cursor: pointer;

			color: var(--Text_s);
		}

		.active {
			background: var(--Theme);
			border: 1px solid transparent;
		}

		img {
			cursor: pointer;
			width: 17px;
			height: 17px;
		}
	}
}
</style>
