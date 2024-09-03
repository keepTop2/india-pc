<!--
 * @Author: WangMingxin
 * @Description: 体育-足球-赔率卡片
-->
<template>
	<div class="card-container">
		<div class="content-container" v-if="cardData" :class="{ isBright: isBright() }" @click="onSetSportsEventData">
			<div class="text-container">
				<!-- 独赢 -->
				<template v-if="cardType == `capot`">
					<div class="label">{{ cardData?.keyName }}</div>
					<!-- wmx 美国盘 改 欧洲盘数据显示 2024/6/1 -->
					<div class="value" :class="changeClass(cardData)">{{ cardData?.oddsPrice?.decimalPrice }}</div>
				</template>
				<!-- 让球 -->
				<template v-else-if="cardType == `handicap`">
					<div class="label">
						<span>{{ cardData?.point }}</span>
					</div>
					<div class="value" :class="changeClass(cardData)">{{ cardData?.oddsPrice?.decimalPrice }}</div>
				</template>
				<!-- 大小 -->
				<template v-else-if="cardType == `magnitude`">
					<div class="label">
						<span>{{ cardData.keyName }}</span>
						<span>{{ cardData?.point }}</span>
					</div>
					<div class="value" :class="changeClass(cardData)">{{ cardData?.oddsPrice?.decimalPrice }}</div>
				</template>
			</div>
			<RiseOrFall v-if="cardData?.oddsChange" :time="3000" :status="cardData?.oddsChange == 'oddsUp' ? 1 : 2" @animationEnd="animationEnd(market.marketId, cardData)" />
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

const props = withDefaults(defineProps<CapotCardType>(), {
	cardType: "capot",
	cardData: () => {
		return {};
	},
	sportInfo: [],
	betType: 1,
	marketa: () => {
		return {};
	},
});

const sportsBetEvent = useSportsBetEventStore();
/**
 * @description 动画结束删除oddsChange字段状态
 */
const animationEnd = (marketId: any, cardData: { oddsChange: string }) => {
	if (cardData.oddsChange) {
		//删除 markets中的 oddsChange字段状态
		emit("oddsChange", { marketId: marketId, selections: cardData });
		//删除 childrenViewData中的状态
		cardData.oddsChange = "";
	}
};

/**
 * @description 切换类名
 */
const changeClass = (cardData) => {
	if (!cardData.oddsChange) {
		return "";
	} else if (cardData.oddsChange == "oddsUp") {
		return "oddsUp";
	} else if (cardData.oddsChange == "oddsDown") {
		return "oddsDown";
	}
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
	}

	.text-container {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0 8px;

		.label {
			color: var(--Text1);

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
			margin-right: 19px;
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
