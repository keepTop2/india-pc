<template>
	<div class="market-content">
		<BetSelector :value="cardData?.oddsPrice?.decimalPrice" :isRun="market.marketStatus === 'running'">
			<!-- 判断是否有卡片数据 -->
			<div class="market-item" v-if="cardData" :class="{ isBright: isBright() }" @click="onSetSportsEventData">
				<!-- 独赢类型 -->
				<template v-if="cardType == 'capot'">
					<div class="label">{{ cardData?.keyName }}</div>
					<!-- 市场状态正常时显示赔率 -->
					<template v-if="market.marketStatus === 'running'">
						<div class="value">
							<span>{{ cardData?.oddsPrice?.decimalPrice }}</span>
						</div>
					</template>
					<!-- 市场状态锁定时显示锁图标 -->
					<div class="lock" v-else><svg-icon name="sports-lock" size="16px"></svg-icon></div>
				</template>

				<!-- 让球类型 -->
				<template v-else-if="cardType == 'handicap'">
					<div class="label">
						<span><span v-if="cardData.point > 0">+</span>{{ cardData?.point }}</span>
					</div>
					<!-- 市场状态正常时显示赔率 -->
					<template v-if="market.marketStatus === 'running'">
						<div class="value">
							<span>{{ cardData?.oddsPrice?.decimalPrice }}</span>
						</div>
					</template>
					<!-- 市场状态锁定时显示锁图标 -->
					<div class="lock" v-else><svg-icon name="sports-lock" size="16px"></svg-icon></div>
				</template>

				<!-- 大小类型 -->
				<template v-else-if="cardType == 'magnitude'">
					<div class="label">
						<span>{{ cardData.keyName }}</span>
						<span>{{ cardData?.point }}</span>
					</div>
					<!-- 市场状态正常时显示赔率 -->
					<template v-if="market.marketStatus === 'running'">
						<div class="value">
							<span>{{ cardData?.oddsPrice?.decimalPrice }}</span>
						</div>
					</template>
					<!-- 市场状态锁定时显示锁图标 -->
					<div class="lock" v-else><svg-icon name="sports-lock" size="16px"></svg-icon></div>
				</template>
			</div>
			<!-- 当没有卡片数据时显示 -->
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
const emit = defineEmits(["oddsChange"]);

// 定义传入属性的类型
interface CapotCardType {
	/** 卡片类型：capot - 独赢，handicap - 让球，magnitude - 大小 */
	cardType: "capot" | "handicap" | "magnitude";
	/** 卡片数据 */
	cardData: any;
	/** 体育信息（每一行） */
	sportInfo: any;
	/** 投注类型 */
	betType: number;
	/** 赔率信息 */
	market: any;
}

// 使用 Pinia 状态管理
const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();

// 设置默认属性值
const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	cardData: () => ({}),
	sportInfo: [],
	betType: 1,
	market: () => ({}),
});

// 组件挂载时执行
onMounted(() => {
	// 设置购物车为联赛类型
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

// 监听赔率变化，更新状态
watch(
	() => props.cardData?.oddsPrice?.decimalPrice,
	(newValue, oldValue) => {
		if (newValue && oldValue) {
			oddsChange.value = newValue > oldValue ? 1 : newValue < oldValue ? 2 : 3;
		}
	}
);

/**
 * @description 动画结束后重置赔率变化状态为 3（无变化）
 */
const animationEnd = (marketId, cardData) => {
	oddsChange.value = 3;
};

/**
 * @description 处理盘口高亮状态，根据 marketId 和 selection key 生成唯一标识并存储在 Pinia 中
 */
const onSetSportsEventData = () => {
	if (props.market.marketStatus === "running") {
		const selection = props.cardData;
		// 如果当前盘口已经高亮，则移除
		if (isBright()) {
			sportsBetEvent.removeEventCart(props.sportInfo);
		} else {
			// 否则添加到购物车并存储信息
			sportsBetEvent.storeEventInfo(props.sportInfo.eventId, {
				marketId: props.market.marketId,
				betType: props.betType,
				selectionKey: selection.key,
			});
			sportsBetEvent.addEventToCart({ ...props.sportInfo });
		}
	}
};

/**
 * @description 判断当前盘口是否在 Pinia 中，以确定是否高亮
 * @returns {boolean} 是否高亮
 */
const isBright = () => {
	const selection = props.cardData;
	return sportsBetEvent.getEventInfo[props.sportInfo.eventId]?.listKye === `${props?.market?.marketId}-${selection.key}`;
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
