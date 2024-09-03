<!--
 * @Author: WangMingxin
 * @Description: 体育-羽毛球-赔率卡片
-->
<template>
	<div class="card-container">
		<div class="content-container" v-if="cardData" :class="{ isBright: isBright() }">
			<div class="content-container" @click="onSetSportsEventData">
				<div class="text-container">
					<!-- 独赢 -->
					<template v-if="cardType == `capot`">
						<div class="label">{{ cardData?.key == "h" ? "主" : "客" }}</div>
						<div v-if="market.marketStatus == 'running'">
							<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
							<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
						</div>
						<SvgIcon v-else class="sport_lock2" iconName="sport_lock" :size="20" />
					</template>
					<!-- 让球 -->
					<template v-else-if="cardType == `handicap`">
						<div class="label">
							<span><span v-if="cardData.point > 0">+</span>{{ cardData?.point }}</span>
						</div>
						<div v-if="market.marketStatus == 'running'">
							<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
							<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
						</div>
						<SvgIcon v-else class="sport_lock2" iconName="sport_lock" :size="20" />
					</template>
					<!-- 大小 -->
					<template v-else-if="cardType == `magnitude`">
						<div class="label">
							<span>{{ cardData.keyName }}</span>

							<span>{{ cardData?.point }}</span>
						</div>
						<div v-if="market.marketStatus == 'running'">
							<div class="value" :class="changeClass[oddsChange]">{{ cardData?.oddsPrice?.decimalPrice }}</div>
							<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd(market.marketId, cardData)" />
						</div>
						<SvgIcon v-else class="sport_lock2" iconName="sport_lock" :size="20" />
					</template>
				</div>
			</div>
		</div>
		<template v-else>
			<i class="noData"></i>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RiseOrFall } from "/@/components/Sport/index";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { marketsMatchData } from "/@/utils/sports/formattingViewData";
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

// /**
//  * @description: 选中时高亮处理；
//  * @param {*} paramsObj
//  * @return {*}
//  */
// const onSetSportsEventData = () => {
// 	const paramsObj = {
// 		marketId: marketsMatchData(props.sportInfo.markets, props.betType).marketId,
// 		selection: props.cardData,
// 		data: props.sportInfo,
// 		betType: 5,
// 	};

// 	//使用 marketId 拼接 selection的key
// 	//还需要判断当前赛事是否选择了多个 多个无法同时选择的  可以使用 eventid作为key marketId + key 作为值 可行
// 	const { data, marketId, selection, betType } = paramsObj;
// 	//存储盘口唯一标识
// 	if (isBright(data.eventId, marketId, selection)) {
// 		// 删除Pinia数据
// 		sportsBetEvent.removeEventCart(event);
// 	} else {
// 		sportsBetEvent.setMarketSelect(data.eventId, `${marketId}-${selection.key}`);
// 		sportsBetEvent.setEventSelect(data.eventId, {
// 			marketId: marketId,
// 			betType: betType,
// 			key: selection.key,
// 		});
// 	}
// 	// 存储Pinia数据
// 	sportsBetEvent.setSportsEventData(data);
// 	//同步 新增或改变高亮状态
// 	// emit("onIsBright", { marketId: marketId, selections: selection, data: data });
// };

/**
 * @description 判断当前盘口是否存在pinia中
 */
const isBright = () => {
	let selection = props.cardData;

	return sportsBetEvent.getEventInfo[props.sportInfo.eventId]?.listKye == `${props?.market?.marketId}-${selection.key}`;
};

// /**
//  * @description 判断当前盘口是否存在pinia中
//  */
// const isBright = (eventId, marketId, selection) => {
// 	console.info("判断当前盘口是否存在pinia中", eventId, marketId, selection);

// 	if (selection) {
// 		try {
// 			return marketsSelect.value[eventId] == `${marketId}-${selection.key}`;
// 		} catch (error) {
// 			return false;
// 		}
// 	} else {
// 		return false;
// 	}
// };
</script>

<style scoped lang="scss">
.oddsUp {
	@include themeify {
		color: themed("Warn") !important;
	}
}

.oddsDown {
	@include themeify {
		color: themed("Theme") !important;
	}
}

.card-container {
	display: flex;
	// justify-content: center;
	align-items: center;
	margin-top: 4px;
	width: 197px;
	height: 50px;
	flex-shrink: 0;
	border-radius: 4px;
	cursor: pointer;
	user-select: none;
	-webkit-user-drag: none;
	overflow: hidden;

	@include themeify {
		background: themed("Bg3");

		&:hover {
			background: themed("Line");
		}
	}

	.content-container {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		border-radius: 4px;

		@include themeify {
			&.isBright {
				background: themed("Bg5");
			}
		}
	}

	.text-container {
		display: flex;
		align-items: center;
		flex: 1;
		justify-content: space-between;
		padding: 14px 19px;
		.label {
			@include themeify {
				color: themed("Text1");
			}

			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		.value {
			@include themeify {
				color: themed("Text_s");
			}

			font-family: "PingFang SC";
			font-size: 16px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		.sport_lock2 {
			margin-left: 15px;
			@include themeify {
				color: themed("icon");
			}
		}
		.sport_lock {
			margin-left: 68px;
			@include themeify {
				color: themed("icon");
			}
		}
	}

	.noData {
		margin: 0 auto;
		width: 14px;
		height: 1px;

		@include themeify {
			background: themed("Text1");
		}
	}
}

.item:hover {
	@include themeify {
		background: themed("Line");
	}
}
</style>
