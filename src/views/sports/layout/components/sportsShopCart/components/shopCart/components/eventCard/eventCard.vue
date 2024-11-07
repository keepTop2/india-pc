<template>
	<div class="bet_slip_item">
		<!-- 投注成功卡片不显示删除图标 -->
		<div v-if="hasClose" class="remove" @click="onDeleteBetEvent(props.shopData)">
			<span class="delete_icon"><svg-icon name="sports-delete" size="18px"></svg-icon></span>
		</div>

		<div class="bet_slip_info" :style="{ opacity: opacityFn(props.shopData) }">
			<div class="bet_slip_label">
				<div>
					<span>{{ getName(props.shopData) }}</span>
					&nbsp;
					<span v-if="props.shopData.betMarketInfo.point !== undefined">{{
						SportsCommon.formatPoint({
							betType: props.shopData.betMarketInfo?.betType,
							point: props.shopData.betMarketInfo?.point,
							key: props.shopData.betMarketInfo?.key,
						})
					}}</span>
				</div>
				<!-- 未投注赛事卡片赔率显示 -->
				<div v-if="hasClose" style="position: relative">
					<BetSelector :value="shopCartPubSub.decimalPrice(props.shopData)" isShopCar>
						<span class="value" v-if="props.shopData.eventStatus !== 'running' || props.shopData.betMarketInfo?.marketStatus !== 'running'">@ - </span>
						<span class="value" v-else :class="changeClass(props.shopData.betMarketInfo)">@{{ shopCartPubSub.decimalPrice(props.shopData) }}</span>
					</BetSelector>
				</div>
				<!-- 已投注卡片赔率显示 -->
				<div v-else>
					<span class="value">@{{ props.shopData.betMarketInfo.decimalPrice }}</span>
				</div>
			</div>
			<div class="bet_slip_type">
				<div>
					<span v-if="shopData.isLive" class="mr_6 color-f2">[滚球]</span>
					<span class="mr_6">{{ props.shopData.betMarketInfo.betTypeName }}</span>
					<span>[欧洲盘]</span>
				</div>

				<div v-if="getEventsStatusText(props.shopData)">
					<span class="tip">{{ getEventsStatusText(props.shopData) }}</span>
				</div>
			</div>
			<div class="bet_slip_name">
				<span>{{ shopData.teamInfo.homeName }}</span> v <span>{{ shopData.teamInfo.awayName }}</span>
				<span>({{ props.shopData.gameInfo.liveHomeScore }} - {{ props.shopData.gameInfo.liveAwayScore }})</span>
			</div>
			<div class="bet_slip_name mt_2">
				<span>{{ props.shopData.leagueName }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import shopCartPubSub from "/@/views/sports/hooks/shopCartPubSub";
import SportsCommon from "/@/views/sports/utils/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";
import { i18n } from "/@/i18n/index";

const $: any = i18n.global;
const sportsBetEvent = useSportsBetEventStore();

const props = withDefaults(
	defineProps<{
		/**
		 * @description:选中的商品详细
		 */
		shopData?: any;
		/**是否拥有close */
		hasClose: boolean;
	}>(),
	{
		shopData: () => {
			return {};
		},
		hasClose: true,
	}
);

// 判断名称
const getName = (item: any) => {
	if ((item.betMarketInfo.betType == 5 || item.betMarketInfo.betType == 15) && item.betMarketInfo.key == "1") {
		return item.teamInfo.homeName;
	} else if ((item.betMarketInfo.betType == 5 || item.betMarketInfo.betType == 15) && item.betMarketInfo.key == "2") {
		return item.teamInfo.awayName;
	} else if ((item.betMarketInfo.betType == 5 || item.betMarketInfo.betType == 15) && item.betMarketInfo.key == "x") {
		return $.t(`sports['和局']`);
	} else if ((item.betMarketInfo.betType == 1303 || item.betMarketInfo.betType == 704) && item.betMarketInfo.key == "h") {
		return item.teamInfo.homeName;
	} else if ((item.betMarketInfo.betType == 1303 || item.betMarketInfo.betType == 704) && item.betMarketInfo.key == "a") {
		return item.teamInfo.awayName;
	} else {
		return item.betMarketInfo.keyName;
	}
};

/**
 * @description 判断赛事状态
 */
const opacityFn = (item: any) => {
	// 判断赛事状态 与 盘口状态 当前投注赛事信息 球类 是否支持串关 赛事小节是否支持串关
	if (sportsBetEvent.sportsBetEventData.length == 1) {
		// 判断赛事状态 与 盘口状态
		if (item.eventStatus !== "running" || item.betMarketInfo?.marketStatus !== "running") {
			return 0.4;
		} else {
			return 1;
		}
	}
	if (sportsBetEvent.sportsBetEventData.length > 1) {
		if (
			item.eventStatus !== "running" ||
			item.betMarketInfo?.marketStatus !== "running" ||
			item.betMarketInfo?.differentBalls ||
			!item.isParlay ||
			item.betMarketInfo?.combo == 0 ||
			(item.betMarketInfo.stateCode && item.betMarketInfo.stateCode != 0)
		) {
			return 0.4;
		} else {
			return 1;
		}
	}
};

// 删除赛事
const onDeleteBetEvent = (item: any) => {
	sportsBetEvent.removeEventCart(item);
};

/**
 * @description 判断按钮文本
 */
const getEventsStatusText = (item: any) => {
	// 判断赛事状态 与 盘口状态
	if (item.eventStatus !== "running" || item.betMarketInfo?.marketStatus !== "running") {
		return $.t(`sports["盘口已关闭"]`);
	}
	if (sportsBetEvent.sportsBetEventData.length > 1) {
		// 判断当前投注赛事信息 球类 是否支持串关 赛事小节是否支持串关
		if (item.betMarketInfo?.differentBalls || !item.isParlay || item.betMarketInfo?.combo == 0) {
			return $.t(`sports["不支持串关"]`);
		}
		if (item.betMarketInfo.stateCode && item.betMarketInfo.stateCode != 0) {
			return $.t(`sports["暂不支持投注"]`);
		}
	}
};

/**
 * @description 切换上升下降类名
 */
const changeClass = (item: any) => {
	if (!item?.oddsChange) {
		return "";
	} else if (item?.oddsChange == "oddsUp") {
		return "oddsUp";
	} else if (item?.oddsChange == "oddsDown") {
		return "oddsDown";
	}
};

/**
 * @description 动画结束删除oddsChange字段状态
 */
const animationEnd = (item: any) => {
	if (item.oddsChange) {
		//删除 markets中的 oddsChange字段状态
		//删除 childrenViewData中的状态
		item.oddsChange = "";
	}
};
</script>

<style scoped lang="scss">
.oddsUp {
	color: var(--Theme) !important;
}

.oddsDown {
	color: var(--Success) !important;
}

.bet_slip_item {
	position: relative;
	border-radius: 8px;
	background-color: var(--Bg4);

	.remove {
		position: absolute;
		bottom: 0px;
		right: 0px;
		width: 40px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px 0px;
		z-index: 2;
		cursor: pointer;
		background-color: var(--Bg2);
		.delete_icon {
			width: 18px;
			height: 18px;
		}
	}

	.bet_slip_info {
		padding: 10px 25px;

		.bet_slip_label {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--TB);
			font-family: "PingFang SC";
			font-size: 16px;
			font-weight: 500;
			line-height: 22px;

			.value {
				color: var(--Text_s);
				text-align: right;
				font-family: "PingFang SC";
				font-size: 20px;
				font-style: normal;
				font-weight: 500;
				line-height: normal;
				line-height: 22px;
			}
			.change-icon {
				position: absolute;
				top: 50%;
				right: -15px;
				transform: translate(0px, -50%);
			}
		}

		.bet_slip_type {
			display: flex;
			justify-content: space-between;
			.color-f2 {
				color: var(--F2);
			}

			.tip {
				display: block;
				height: 20px;
				padding: 0px 5px;
				border-radius: 4px;
				background-color: var(--Bg3);
				color: var(--Text1);
				font-family: "PingFang SC";
				font-size: 14px;
				font-weight: 400;
			}
		}

		.bet_slip_type,
		.bet_slip_name,
		.bet_slip_name {
			color: var(--Text1);
			font-family: "PingFang SC";
			font-size: 14px;
			font-weight: 400;
			line-height: 20px;
		}
	}
}
</style>
