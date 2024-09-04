<template>
	<div class="bet_slip_item">
		<div v-if="hasClose" class="remove_icon" @click="onDeleteBetEvent()">
			<SvgIcon class="sports_remove" iconName="sports_remove" color="#798D9F" />
		</div>
		<div
			class="bet_slip_info"
			:style="{
				opacity: isUnusual ? '0.4' : '1',
			}"
		>
			<div class="bet_slip_label">
				<div>
					<span>{{ shopDataName }}</span>
					&nbsp;
					<span>{{ shopDataPoint }}</span>
				</div>
				<div style="position: relative">
					<span class="value" v-if="isMarketClose">@ - </span>
					<span class="value" v-else :class="changeClass[oddsChange]">@{{ payoutPrice }}</span>
					<div class="change-icon">
						<RiseOrFall :time="3000" :status="oddsChange" @animationEnd="animationEnd" />
					</div>
				</div>
			</div>
			<div class="bet_slip_type mt_2">
				<div>
					<span v-if="shopData.isLive" class="mr_6">[滚球]</span>
					<span class="mr_6">{{ betTypeName }}</span>
					<!-- <span class="mr_10" v-if="isLeagueStart">({{ homeScore }} - {{ awayScore }})</span> -->
					<span>[欧洲盘]</span>
				</div>

				<div>
					<!-- 先判断盘口是否关闭 -->
					<template v-if="isMarketClose">
						<span class="tip">盘口已关闭</span>
					</template>
					<!-- 再判断其它状态 -->
					<template v-else>
						<span v-if="shopData.betMarketInfo?.differentBalls" class="tip">不支持串关</span>
						<span v-else-if="shopData.betMarketInfo?.combo == 0" class="tip">不支持串关</span>
						<span v-else-if="isNoBetsAllowed" class="tip">暂不支持投注</span>
					</template>
				</div>
			</div>
			<div class="bet_slip_name mt_4">
				<span>{{ shopData.teamInfo.homeName }}</span>
				v
				<span>{{ shopData.teamInfo.awayName }}</span>
				<span>&nbsp;</span>
				<span v-if="isLeagueStart">({{ homeScore }} - {{ awayScore }})</span>
			</div>
			<div class="bet_slip_name">
				<span>{{ shopData.leagueName }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { debounce, throttle, cloneDeep, isEmpty } from "lodash-es";
import SportsCommonFn from "/@/views/sports/utils/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { RiseOrFall } from "/@/components/Sport/index";

import { useShopCatControlStore } from "/@/stores/modules/sports/shopCatControl";
import { i18n } from "/@/i18n/index";
import { shouldShowPoint } from "/@/views/sports/utils/formattingViewData";

const $: any = i18n.global;

const emit = defineEmits(["oddsChanges", "marketChange"]);

const ShopCatControlStore = useShopCatControlStore();
const sportsBetEvent = useSportsBetEventStore();
const props = withDefaults(
	defineProps<{
		/**
		 * @description:选中的商品详细
		 */
		shopData?: any;
		/**是否拥有close */
		hasClose: boolean;
		/** 接受赔率变动  */
		isAccept?: boolean;
		/** 单注最新信息获取 */
		singleTicket?: any;
	}>(),
	{
		shopData: () => {
			return {};
		},
		singleTicket: () => {},
		hasClose: true,
	}
);

/**
 * @description 判断联赛是否开赛
 */
const isLeagueStart = computed(() => {
	// console.info("判断联赛是否开赛", props.shopData);

	// /**足球 */
	// const soccerInfo = SportsCommonFn.safeAccess(props.shopData, ["soccerInfo"]);
	// /** 网球 */
	// const tennisInfo = SportsCommonFn.safeAccess(props.shopData, ["tennisInfo"]);
	// /** 沙滩排球相关信息  */
	// const beachVolleyBallInfo = SportsCommonFn.safeAccess(props.shopData, ["beachVolleyBallInfo"]);
	// /**电子竞技 */
	// const eSportInfo = SportsCommonFn.safeAccess(props.shopData, ["eSportInfo"]);
	// /**篮球 */
	// const basketballInfo = SportsCommonFn.safeAccess(props.shopData, ["basketballInfo"]);
	// /** 棒球 */
	// const baseballInfo = SportsCommonFn.safeAccess(props.shopData, ["baseballInfo"]);
	// /**排球 */
	// const volleyballInfo = SportsCommonFn.safeAccess(props.shopData, ["volleyballInfo"]);
	// /**美式足球 */
	// const footballInfo = SportsCommonFn.safeAccess(props.shopData, ["footballInfo"]);
	/**桌球 */
	// const tableTennisInfo = SportsCommonFn.safeAccess(props.shopData, ["tableTennisInfo"]);
	// console.info("桌球====>", tableTennisInfo);
	// /**羽毛球 */
	// const badmintonInfo = SportsCommonFn.safeAccess(props.shopData, ["badmintonInfo"]);

	const InfoArr = ["soccerInfo", "tennisInfo", "beachVolleyBallInfo", "eSportInfo", "basketballInfo", "baseballInfo", "volleyballInfo", "tableTennisInfo", "badmintonInfo"];
	let infoTag = false;
	for (let i = 0; i < InfoArr.length; i++) {
		const Info = SportsCommonFn.safeAccess(props.shopData, [InfoArr[i]]);
		if (Info && !isEmpty(Info)) {
			infoTag = true;
			return true;
		}
	}
	/** 体育联赛信息 */
	const gameInfo = SportsCommonFn.safeAccess(props.shopData, ["gameInfo"]);
	// console.info("gameInfo", gameInfo);
	if (gameInfo && !isEmpty(gameInfo)) {
		const { livePeriod, delayLive, isHt, liveAwayScore, liveHomeScore } = gameInfo;
		/**获取比分板时 判断比赛已开始 */
		if (liveAwayScore || liveHomeScore) {
			return true;
		}
		/**中场休息 */
		if (livePeriod == 0 && !delayLive && isHt) {
			return true;
		}
		/**延迟开赛 */
		if (livePeriod == 0 && delayLive && !isHt) {
			return false;
		}
		/**	球赛进行中 */
		if (livePeriod && !delayLive && !isHt) {
			return true;
		}
	}
	return false;
});

/** 是否禁止投注（暂不支持投注）*/
const isNoBetsAllowed = computed(() => {
	if (sportsBetEvent.getNobetsMarketIds && sportsBetEvent.getNobetsMarketIds.length) {
		const index = sportsBetEvent.getNobetsMarketIds.findIndex((e) => e.marketId == cMarketId.value);
		if (index != -1) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
});

/** 是否拥有异常 */
const isUnusual = computed(() => {
	if (
		props.shopData.betMarketInfo?.differentBalls ||
		props.shopData.betMarketInfo?.combo == 0 ||
		props.shopData.eventStatus != "running" ||
		props.shopData.betMarketInfo?.marketStatus != "running" ||
		!isNoBetsAllowed
	) {
		return true;
	} else {
		return false;
	}
});
/** 判断盘口是否关闭 */
const isMarketClose = computed(() => {
	// console.info("props.shopDat判断盘口是否关闭", props.shopData);

	if (props.shopData.eventStatus != "running" || props.shopData.betMarketInfo?.marketStatus != "running") {
		return true;
	} else {
		return false;
	}
});
/** 计算获得当前赔率 */
const payoutPrice = computed(() => {
	let price = "-";
	if (props?.singleTicket?.price || props?.singleTicket?.currentPrice) {
		price = props?.singleTicket?.price || props?.singleTicket?.currentPrice;
	} else {
		price = props?.shopData?.betMarketInfo?.decimalPrice;
	}
	return price;
});
/**计算获得 marketId */
const cMarketId = computed(() => {
	return props.shopData?.betMarketInfo?.marketId;
});

/** 盘口名称  */
const betTypeName = computed(() => {
	const betTypeMap: any = {
		1: $.t("sports['全场让球']"), // 全场让球
		2: $.t("sports['全场单双']"), // 全场单双
		3: $.t("sports['全场大小']"), // 全场大小
		5: $.t("sports['全场独赢']"), // 全场独赢
		7: $.t("sports['半场让球']"), // 半场让球
		8: $.t("sports['半场大小']"), // 半场大小
		15: $.t("sports['半场独赢']"), // 半场独赢
		12: $.t("sports['半场单双']"), // 半场单双
		20: $.t("sports['全场胜负']"), // 全场胜负
		21: $.t("sports['半场胜负']"), // 半场胜负
		153: $.t("sports['局数获胜']"), // 局数获胜
	};
	let name = betTypeMap[props.shopData.betMarketInfo?.betType];
	if (!name) {
		name = props.shopData.betMarketInfo?.betTypeName;
	}
	return name;
});

const changePrice = throttle(
	(newMarketId, newPrice, prevMarketId, prevPrice) => {
		// console.info("赔率变化触发", newMarketId, newPrice, "旧数据===>", prevMarketId, prevPrice);
		if (newMarketId == prevMarketId) {
			if (newPrice && prevPrice) {
				if (newPrice > prevPrice) {
					if (props.isAccept) {
						/**赔率变动激活 */
						emit("oddsChanges", true);
					}
					oddsChange.value = 1;
				} else if (newPrice < prevPrice) {
					/**赔率变动激活 */
					emit("oddsChanges", true);
					oddsChange.value = 2;
				} else {
					oddsChange.value = 3;
				}
			}
		} else {
			emit("marketChange");
		}
	},
	1000,
	{ trailing: false }
);
/** 赔率变化触发 */
watch([cMarketId, payoutPrice], ([newMarketId, newPrice], [prevMarketId, prevPrice]) => {
	changePrice(newMarketId, newPrice, prevMarketId, prevPrice);
});

/**赔率变动状态 */
const oddsChange = ref(3);
/** 类名枚举 */
const changeClass = {
	1: "oddsUp",
	2: "oddsDown",
	3: "none",
};
/**主队比分 */
const homeScore = computed(() => {
	// console.info("主队比分==========>", props.shopData);
	let score = 0;
	if (props.shopData.gameInfo?.liveHomeScore) {
		score = props.shopData.gameInfo?.liveHomeScore;
	}
	/** 网球 局比分 */
	// else if (props.shopData.tennisInfo?.homePointScore) {
	// 	score = props.shopData.tennisInfo?.homePointScore;
	// }
	/** 网球 盘比分 */
	// else if (props.shopData.tennisInfo?.homeGameScore) {
	// 	score = props.shopData.tennisInfo?.homeGameScore;
	// }

	return score;
});
/**客队比分 */
const awayScore = computed(() => {
	let score = 0;
	if (props.shopData.gameInfo?.liveAwayScore) {
		score = props.shopData.gameInfo?.liveAwayScore;
	}

	/** 网球 局比分 */
	// else if (props.shopData.tennisInfo?.awayPointScore) {
	// 	score = props.shopData.tennisInfo?.awayPointScore;
	// }
	/** 网球 盘比分 */
	// else if (props.shopData.tennisInfo?.awayGameScore) {
	// 	score = props.shopData.tennisInfo?.awayGameScore;
	// }
	return score;
});

/**
 * @description 动画结束删除oddsChange字段状态
 */
const animationEnd = () => {
	oddsChange.value = 3;
};

// watch(
// 	() => props.shopData.betMarketInfo?.oddsChange,
// 	(newValue, oldValue) => {
// 		if (!props.isAccept) {
// 			/**赔率变动激活 */
// 			emit("oddsChanges", true);
// 		}
// 	}
// );

/** 直接计算获得名称 */
const shopDataName = computed(() => {
	return getName(props.shopData);
});

/** 直接计算获得球头*/
const shopDataPoint = computed(() => {
	const oPoint = props?.shopData?.betMarketInfo?.point;
	const key = props?.shopData?.betMarketInfo?.key;
	const keyName = props?.shopData?.betMarketInfo?.keyName;
	if (oPoint) {
		if (Number(oPoint) > 0 && shouldShowPoint(props?.shopData?.betMarketInfo?.betType)) {
			if (key == "x") {
				if (keyName.indexOf("+") == -1 && keyName.indexOf("-") == -1) {
					return oPoint;
				} else {
					return "";
				}
			} else {
				return "+" + oPoint;
			}
		} else {
			return oPoint;
		}
	} else if (oPoint == 0) {
		return 0;
	} else {
		return "";
	}
});

/**
 * @description: 判断获取名称
 * @param {*} item
 * @return {*}
 */
const getName = (item) => {
	if ((item.betMarketInfo.betType == 5 || item.betMarketInfo.betType == 15) && item.betMarketInfo.key == "1") {
		return item.teamInfo.homeName;
	} else if ((item.betMarketInfo.betType == 5 || item.betMarketInfo.betType == 15) && item.betMarketInfo.key == "2") {
		return item.teamInfo.awayName;
	} else if ((item.betMarketInfo.betType == 5 || item.betMarketInfo.betType == 15) && item.betMarketInfo.key == "x") {
		return "平局";
	} else {
		return item.betMarketInfo.keyName;
	}
};

// /**
//  * @description 切换类名
//  */
// const changeClass = (item) => {
// 	if (!item?.oddsChange) {
// 		return "";
// 	} else if (item?.oddsChange == "oddsUp") {
// 		return "oddsUp";
// 	} else if (item?.oddsChange == "oddsDown") {
// 		return "oddsDown";
// 	}
// };
/**
 * 删除赛事
 */
const onDeleteBetEvent = () => {
	sportsBetEvent.removeEventCart(props.shopData);
};

const showPopup = () => {
	ShopCatControlStore.setShopCatShow(true);
};
const closePopup = () => {
	ShopCatControlStore.setShopCatShow(false);
};
</script>

<style scoped lang="scss">
.oddsUp {
	color: var(--Warn) !important;
}

.oddsDown {
	color: var(--Theme) !important;
}

.bet_slip_item {
	position: relative;
	display: flex;
	align-items: center;
	margin-top: 5px;
	border-radius: 8px;
	padding: 10px 25px;
	&:last-child {
		margin-bottom: 5px;
	}

	background-color: var(--Bg3);

	.remove_icon {
		position: absolute;
		width: 40px;
		height: 24px;
		bottom: 0px;
		right: 0px;
		border-radius: 8px 0px;
		cursor: pointer;

		background-color: rgba(121, 141, 159, 0.2);
	}

	.sports_remove {
		position: absolute;
		height: 18px;
		bottom: 3px;
		right: 8px;
		z-index: 10;
	}

	.bet_slip_info {
		flex: 1;

		.bet_slip_label {
			display: flex;
			align-items: center;
			justify-content: space-between;

			color: var(--TB);

			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;

			.value {
				color: var(--Text_s);
				text-align: right;
				font-family: "PingFang SC";
				font-size: 20px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;
			}
			.change-icon {
				position: absolute;
				top: 50%;
				right: -15px;
				transform: translate(-50%, 0);
			}
		}

		.bet_slip_type {
			display: flex;
			justify-content: space-between;

			.tip {
				display: block;
				padding: 2px 7px;
				border-radius: 5px;
				background-color: var(--Tag2-P);
				color: var(--TB);
			}

			& > div:first-child {
				& > span:first-child {
					color: var(--Theme);
				}
			}
		}

		.bet_slip_type,
		.bet_slip_name,
		.bet_slip_name {
			color: var(--Text1);

			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
		}
	}
}
</style>
