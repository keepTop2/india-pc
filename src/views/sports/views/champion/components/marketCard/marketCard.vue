<template>
	<div class="card-container">
		<BetSelector :value="cardData?.price">
			<div class="content-container" v-if="cardData" :class="{ isBright: isBright() }" @click="onSetSportsEventData">
				<div class="text-container">
					<div class="label">{{ cardData.teamName }}</div>
					<div class="value">{{ cardData?.price }}</div>
				</div>
			</div>
			<template v-else>
				<i class="noData"></i>
			</template>
		</BetSelector>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import sportsApi from "/@/api/sports/sports";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";
import pubsub from "/@/pubSub/pubSub";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
const ShopCatControlStore = useShopCatControlStore();

const { clearSportsOddsChange } = useSportPubSubEvents();

// import { marketsMatchData } from "/@/views/sports/utils/formattingViewData";
const emit = defineEmits(["oddsChange"]);

interface CapotCardType {
	/** 卡片数据 */
	cardData: any;
	/** 体育信息（每一行）*/
	sportInfo: any;
	displayContent: boolean;
}

const ChampionShopCartStore = useSportsBetChampionStore();

onMounted(() => {
	/**设置显示购物车为冠军 */
	ShopCatControlStore.setShopCartType("champion");
});

const props = withDefaults(defineProps<CapotCardType>(), {
	cardData: () => {
		return {};
	},
	sportInfo: [],
	displayContent: true,
});

/**
 * @description 动画结束删除oddsChange字段状态
 */
const animationEnd = () => {
	const cardData = props.cardData;
	const sportInfo = props.sportInfo.leagueId;
	if (cardData.oddsChange) {
		//删除 markets中的 oddsChange字段状态
		clearSportsOddsChange({
			webToPushApi: WebToPushApi.champion,
			leagueId: sportInfo.leagueId,
			team: cardData,
		});
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
 * @description 处理盘口高亮状态 查看是否添加到购物车；
 */
const onSetSportsEventData = () => {
	let item = props.cardData; //队伍
	let data = props.sportInfo; //行数据
	// 创建对象
	const params = {
		type: "1", // 添加冠军标识
		leagueId: data.leagueId,
		sportType: data.sportType,
		isChampionData: true,
		event: {
			...item,
			leagueId: data.leagueId,
			leagueName: data.leagueName,
			sportType: data.sportType,
			isChampionData: true,
		},
	};

	if (isBright()) {
		// 删除Pinia数据
		ChampionShopCartStore.removeChampionTEventCart(params);
	} else {
		/**添加到购物车 */
		ChampionShopCartStore.addEventToCart(params);
	}
};

/**
 * @description 判断当前盘口是否存在pinia中
 */
const isBright = () => {
	let item = props.cardData; //队伍
	let data = props.sportInfo; //行数据
	let tag = false;
	try {
		tag = ChampionShopCartStore.championBetObj[data.leagueId].event?.orid == item.orid;
		if (tag) {
		}
	} catch (error) {
		// console.info("判断当前盘口是否存在pinia中", error);
	}
	return tag;
};
</script>

<style scoped lang="scss">
.oddsUp {
	color: var(--F-1) !important;
}

.oddsDown {
	color: var(--Theme) !important;
}

.card-container {
	width: 100%;
	height: 34px;
	border-radius: 2px;
	background: var(--Bg-3);
	overflow: hidden;
	cursor: pointer;
	&:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.content-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 6px 10px;
	}
	.isBright {
		background: var(--Bg-5);
		.label {
			color: var(--Text-a) !important;
		}
	}

	.text-container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.label {
			color: var(--Text-1);
			text-align: center;
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: normal;
		}

		.value {
			color: var(--Text-s);
			font-family: "PingFang SC";
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}
	}

	.noData {
		margin: 0 auto;
		width: 14px;
		height: 1px;
		background: var(--Text-1);
	}
}
</style>
