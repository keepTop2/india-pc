<template>
	<div class="market-content">
		<div class="market-item" v-if="cardData" :class="{ isBright: isBright() }" @click="onSetSportsEventData">
			<!-- 独赢 -->
			<template v-if="cardType == `capot`">
				<div class="label">{{ cardData?.keyName }}</div>
				<!-- 状态正常 -->
				<div class="value" v-if="market.marketStatus == 'running'">
					<span :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</span>
					<div class="arrow-icon">
						<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
					</div>
				</div>
				<!-- 锁 -->
				<div class="lock" v-else><svg-icon name="sports-lock" size="16px"></svg-icon></div>
			</template>

			<!-- 独赢 -->
			<template v-else-if="cardType == `handicap`">
				<div class="label">
					<span><span v-if="cardData.point > 0">+</span>{{ cardData?.point }}</span>
				</div>
				<!-- 状态正常 -->
				<div class="value" v-if="market.marketStatus == 'running'">
					<span :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</span>
					<div class="arrow-icon">
						<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
					</div>
				</div>
				<!-- 锁 -->
				<div class="lock" v-else><svg-icon name="sports-lock" size="16px"></svg-icon></div>
			</template>

			<!-- 独赢 -->
			<template v-else-if="cardType == `magnitude`">
				<div class="label">
					<span>{{ cardData.keyName }}</span>
					<span>{{ cardData?.point }}</span>
				</div>
				<!-- 状态正常 -->
				<div class="value" v-if="market.marketStatus == 'running'">
					<span :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</span>
					<div class="arrow-icon">
						<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
					</div>
				</div>
				<!-- 锁 -->
				<div class="lock" v-else><svg-icon name="sports-lock" size="16px"></svg-icon></div>
			</template>
		</div>
		<div v-else class="market-item">
			<div class="noData">-</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RiseOrFall } from "/@/components/Sport/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

const emit = defineEmits(["oddsChange"]);

// /** 市场 (盘口信息) */
// markets: any;
interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小 */
	cardType: "capot" | "handicap" | "magnitude";
	/** 卡片数据 */
	cardData: any;
	/** 体育信息（每一行）*/
	sportInfo: any;
	/** 投注类型 */
	betType: number;
	/** 赔率信息  */
	market: any;
}

const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	cardData: () => {
		return {};
	},
	sportInfo: [],
	betType: 1,
	market: () => {
		return {};
	},
});

onMounted(() => {
	/**设置显示购物车为联赛 */
	ShopCatControlStore.setShopCartType("league");
});

// 赔率变化状态：1 表示上升，2 表示下降，3 表示无变化
// oddsChange 的类型定义为字面量联合类型
const oddsChange = ref<1 | 2 | 3>(3);
const changeClass: { [key in 1 | 2 | 3]: string } = {
	1: "oddsUp",
	2: "oddsDown",
	3: "none",
};

watch(
	() => props.cardData?.oddsPrice?.decimalPrice,
	(newValue, oldValue) => {
		if (newValue && oldValue) {
			if (newValue > oldValue) {
				oddsChange.value = 1;
			} else if (newValue < oldValue) {
				oddsChange.value = 2;
			} else {
				oddsChange.value = 3;
			}
		}
	}
);

/**
 * @description 动画结束删除oddsChange字段状态
 */
const animationEnd = (marketId, cardData) => {
	oddsChange.value = 3;
};

/**
 * @description 处理盘口高亮状态，拼接 marketid 与 selection key 作为唯一标识，存储值pinia中
 */
const onSetSportsEventData = () => {
	if (props.market.marketStatus === "running") {
		let selection = props.cardData;
		//存储盘口唯一标识
		if (isBright()) {
			// 删除Pinia数据
			sportsBetEvent.removeEventCart(props.sportInfo);
		} else {
			sportsBetEvent.storeEventInfo(props.sportInfo.eventId, {
				marketId: props.market.marketId,
				betType: props.betType,
				selectionKey: selection.key,
			});
			// 存储Pinia数据
			sportsBetEvent.addEventToCart(JSON.parse(JSON.stringify(props.sportInfo)));
		}
	}
};

/**
 * @description 判断当前盘口是否存在pinia中
 */
const isBright = () => {
	let selection = props.cardData;

	return sportsBetEvent.getEventInfo[props.sportInfo.eventId]?.listKye == `${props?.market?.marketId}-${selection.key}`;
};
</script>

<style scoped lang="scss">
.market-content {
	width: 100%;
	height: 32px;
	cursor: pointer;
	.market-item {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px;
		border-radius: 4px;
		background: var(--Bg3);
		box-sizing: border-box;

		.label {
			max-width: calc(100% - 50px);
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.value {
			width: 50px;
			position: relative;
			text-align: end;
			color: var(--Text_a);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;

			.arrow-icon {
				position: absolute;
				top: 50%;
				transform: translate(0px, -50%);
				right: -16px;
			}
		}
		&:hover {
			background-color: rgba(255, 255, 255, 0.05);
		}

		.lock {
			width: 16px;
			height: 16px;
		}

		.noData {
			width: 100%;
			height: 100%;
			text-align: center;
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}

	.isBright {
		background: var(--Bg5) !important;
		.label {
			color: var(--Text_a);
		}
	}
}

.oddsUp {
	color: var(--Theme) !important;
}
.oddsDown {
	color: var(--Success) !important;
}
</style>
