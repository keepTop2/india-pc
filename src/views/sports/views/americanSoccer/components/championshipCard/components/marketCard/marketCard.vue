<!--
 * @Author: WangMingxin
 * @Description: 体育-足球-赔率卡片
-->
<template>
	<div class="card-container" :class="[!props.displayContent ? 'hideToggle' : 'showToggle']">
		<div class="content-container" v-if="cardData" :class="{ isBright: isBright() }" @click="onSetSportsEventData">
			<div class="text-container">
				<div class="label">{{ cardData.teamName }}</div>
				<div class="value" :class="changeClass(cardData)">{{ cardData?.price }}</div>
			</div>
			<RiseOrFall v-if="cardData?.oddsChange" :time="3000" :status="cardData?.oddsChange == 'oddsUp' ? 1 : 2" @animationEnd="animationEnd" />
		</div>
		<template v-else>
			<i class="noData"></i>
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RiseOrFall } from "/@/components/Sport/index";
import sportsApi from "/@/api/sports/sports";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
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

const ChampionShopCartStore = useChampionShopCartStore();

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
	const params = {
		...item,
		leagueId: data.leagueId,
		leagueName: data.leagueName,
		sportType: data.sportType,
	};
	//存储盘口唯一标识
	if (isBright()) {
		// 删除Pinia数据
		ChampionShopCartStore.removeOutrightTEventCart(params);
	} else {
		/**添加到购物车 */
		ChampionShopCartStore.addOutrightToCart(JSON.parse(JSON.stringify(params)));
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
		tag = ChampionShopCartStore.getOutrightBetObj[data.leagueId]?.orid == item.orid;
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

.hideToggle {
	height: 0;
	overflow: hidden;
	transition: height 0.5s ease;
}
.showToggle {
	max-height: 50px;
	overflow: hidden;
	transition: height 0.5s ease;
}
</style>
