<!--
 * @Author: WangMingxin
 * @Description: 体育-足球-赔率卡片
-->
<template>
	<div class="card-container" v-if="cardData?.oddsPrice?.decimalPrice !== 0">
		<div class="content-container" v-if="cardData" :class="{ isBright: isBright() }">
			<div class="content-container" @click="onSetSportsEventData">
				<div class="text-container">
					<!-- 独赢 -->
					<template v-if="cardType == `capot`">
						<div class="label">{{ cardData?.keyName }}</div>
						<!-- wmx 美国盘 改 欧洲盘数据显示 2024/6/1 -->
						<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
					</template>
					<!-- 让球 -->
					<template v-else-if="cardType == `handicap`">
						<div class="label">
							<span><span v-if="cardData.point > 0">+</span>{{ cardData?.point }}</span>
						</div>
						<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
					</template>
					<!-- 大小 -->
					<template v-else-if="cardType == `magnitude`">
						<div class="label">
							<span>{{ cardData.keyName }}</span>
							<span>{{ cardData?.point }}</span>
						</div>
						<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
					</template>
					<!-- 不确定类型时  -->
					<template v-else-if="cardType == `none`">
						<div class="label">
							<span v-if="cardData.keyName">{{ cardData.keyName }}</span>
							&nbsp;
							<!-- 根据 betType 判断  是否正数添加 +号 -->
							<div v-if="shouldShowPoint(betType)">
								<!-- 如果key是 x  则不添加 + - 号 -->
								<span v-if="cardData.key == 'x'"></span>
								<span v-else><span v-if="cardData.point > 0">+</span>{{ cardData?.point }}</span>
							</div>

							<div v-else>
								<span>{{ cardData?.point }}</span>
							</div>
						</div>
						<div v-if="market.marketStatus == 'running'">
							<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
							<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
						</div>
						<SvgIcon v-else class="sport_lock" iconName="sport_lock" :size="20" />

						<!-- <div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div> -->
					</template>
				</div>
				<!-- <RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" /> -->
			</div>
			<!-- <template v-else>
				<SvgIcon class="sport_lock" iconName="sport_lock" :size="22" />
			</template> -->
		</div>
		<template v-else>
			<i class="noData"></i>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import viewSportPubSubEventData from "/@/hooks/sport/viewSportPubSubEventData";
import { RiseOrFall } from "/@/components/Sport/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { shouldShowPoint } from "/@/utils/sports/formattingViewData";
import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";

const emit = defineEmits(["oddsChange"]);

// /** 市场 (盘口信息) */
// markets: any;
interface CapotCardType {
	/** 卡片类型 capot:独赢  handicap:让球  magnitude: 大小    none:无类型 */
	cardType?: "capot" | "handicap" | "magnitude" | "none";
	/** 卡片数据 */
	cardData: any;
	/** 体育信息（每一行）*/
	sportInfo: any;
	/** 投注类型 */
	betType: number | string;
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

const oddsChange = ref(3);
const changeClass = {
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
.oddsUp {
	color: var(--Warn) !important;
}

.oddsDown {
	color: var(--Theme) !important;
}

.card-container {
	width: 100%;
	display: flex;
	align-items: center;
	height: 50px;
	flex-shrink: 0;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
	-webkit-user-drag: none;
	overflow: hidden;

	background: var(--Bg3);

	&:hover {
		background: var(--Line);
	}
	.content-container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		border-radius: 4px;

		&.isBright {
			background: var(--Bg5);
		}
		.sport_lock {
			margin-left: 45%;
			color: var(--icon);
		}
	}

	.text-container {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0 19px;

		.label {
			color: var(--Text1);
			display: flex;

			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		.value {
			color: var(--Text_s);
			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
			// margin-right: 19px;
		}
	}

	.noData {
		margin: 0 auto;
		width: 14px;
		height: 1px;

		background: var(--Text1);
	}
}

.item:hover {
	background: var(--Line);
}
</style>
