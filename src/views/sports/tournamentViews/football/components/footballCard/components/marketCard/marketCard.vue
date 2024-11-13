<template>
	<div class="market-content">
		<BetSelector :value="cardData?.oddsPrice?.decimalPrice" :id="market?.marketId + cardData?.key" :isRun="market.marketStatus === 'running'">
			<!-- 判断是否有卡片数据 -->
			<div class="market-item" v-if="cardData" :class="{ isBright: isBright() }" @click="onSetSportsEventData">
				<!-- 独赢 -->
				<template v-if="cardType === 'capot'">
					<div class="label">{{ cardData?.keyName?.slice(0, 1) }}</div>
					<!-- 状态正常 -->
					<template v-if="market.marketStatus === 'running'">
						<div class="value">
							<span>{{ cardData?.oddsPrice?.decimalPrice }}</span>
						</div>
					</template>
					<!-- 锁 -->
					<div class="lock" v-else>
						<svg-icon name="sports-lock" size="16px"></svg-icon>
					</div>
				</template>

				<!-- 让球 -->
				<template v-else-if="cardType === 'handicap'">
					<div class="label">
						<span><span v-if="cardData.point && cardData.point > 0">+</span>{{ cardData?.point }}</span>
					</div>
					<!-- 状态正常 -->
					<template v-if="market.marketStatus === 'running'">
						<div class="value">
							<span>{{ cardData?.oddsPrice?.decimalPrice }}</span>
						</div>
						<!--  -->
					</template>
					<!-- 锁 -->
					<div class="lock" v-else>
						<svg-icon name="sports-lock" size="16px"></svg-icon>
					</div>
				</template>

				<!-- 大小 -->
				<template v-else-if="cardType === 'magnitude'">
					<div class="label">
						<span>{{ cardData.keyName }}</span>
						<span>{{ cardData?.point }}</span>
					</div>
					<!-- 状态正常 -->
					<template v-if="market.marketStatus === 'running'">
						<div class="value">
							<span>{{ cardData?.oddsPrice?.decimalPrice }}</span>
						</div>
					</template>
					<!-- 锁 -->
					<div class="lock" v-else>
						<svg-icon name="sports-lock" size="16px"></svg-icon>
					</div>
				</template>
			</div>

			<!-- 没有卡片数据时的显示 -->
			<div v-else class="market-item">
				<div class="noData">-</div>
			</div>
		</BetSelector>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";

const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
// 事件发射器定义
const emit = defineEmits(["oddsChange"]);

/** 市场 (盘口信息) */
interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小 */
	cardType: "capot" | "handicap" | "magnitude";
	/** 卡片数据 */
	cardData: {
		keyName?: string;
		point?: number;
		oddsPrice?: {
			decimalPrice: number;
		};
		key: string;
	};
	/** 体育信息（每一行） */
	sportInfo: {
		eventId: number;
	};
	/** 投注类型 */
	betType: number;
	/** 赔率信息 */
	market: {
		marketId?: number;
		marketStatus?: string;
	};
}
const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	cardData: null,
	sportInfo: () => ({ eventId: 0 }),
	betType: 1,
	market: () => ({}),
});

// 组件挂载时执行
onMounted(() => {
	/** 设置显示购物车为联赛 */
	ShopCatControlStore.setShopCartType("league");
});

// 监听赔率变化
watch(
	() => props.cardData?.oddsPrice?.decimalPrice,
	(newValue, oldValue) => {
		if (newValue && oldValue) {
			oddsChange.value = newValue > oldValue ? 1 : newValue < oldValue ? 2 : 3;
		}
	}
);

// 赔率变化状态
// oddsChange 的类型定义为字面量联合类型
const oddsChange = ref<1 | 2 | 3>(3);
const changeClass: { [key in 1 | 2 | 3]: string } = {
	1: "oddsUp",
	2: "oddsDown",
	3: "none",
};

/**
 * @description 动画结束后重置oddsChange状态
 */
const animationEnd = (marketId: number, cardData: any) => {
	oddsChange.value = 3;
};

/**
 * @description 处理盘口高亮状态，拼接 marketId 与 selection key 作为唯一标识，存储值到 pinia 中
 */
const onSetSportsEventData = () => {
	if (props.market.marketStatus === "running" && props.cardData) {
		const selection = props.cardData;
		// 判断当前盘口是否已经高亮
		if (isBright()) {
			// 如果已加入购物车，则移除
			sportsBetEvent.removeEventCart(props.sportInfo);
		} else {
			// 如果未加入购物车，则加入
			sportsBetEvent.storeEventInfo(props.sportInfo.eventId, {
				marketId: props.market.marketId,
				betType: props.betType,
				selectionKey: selection.key,
			});
			// 储存赛事数据在缓存中
			sportsBetEvent.addEventToCart({ ...props.sportInfo });
		}
	}
};

/**
 * @description 判断当前盘口是否存在于 pinia 中
 * @returns {boolean} 是否高亮
 */
const isBright = (): boolean => {
	if (!props.cardData) return false;
	const selection = props.cardData;
	return sportsBetEvent.getEventInfo[props.sportInfo.eventId]?.listKye === `${props.market.marketId}-${selection.key}`;
};
</script>

<style scoped lang="scss">
.market-content {
	width: 100%;
	height: 32px;
	cursor: pointer;

	.market-item {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px;
		border-radius: 4px;
		background: var(--Bg-3);
		box-sizing: border-box;

		.label {
			max-width: 60%;
			color: var(--Text-1);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.value {
			// max-width: 40%;
			position: relative;
			color: var(--Text-a);
			font-family: "PingFang SC";
			font-size: 12px;
			font-weight: 400;
		}

		.lock {
			width: 16px;
			height: 16px;
		}

		.noData {
			width: 100%;
			height: 100%;
			text-align: center;
			color: var(--Text-1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}
}
</style>
