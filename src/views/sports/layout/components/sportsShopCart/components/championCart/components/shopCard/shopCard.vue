<template>
	<div class="bet_slip_item">
		<div v-if="hasClose" class="remove_icon" @click="onDeleteBetEvent()">
			<SvgIcon class="sports_remove" iconName="sports_remove" color="#798D9F" />
		</div>
		<div class="bet_slip_info" :style="{ opacity: opacityFn() }">
			<div class="bet_slip_label">
				<div>{{ shopData.teamName }}</div>
				<div style="position: relative">
					<span>@{{ shopData.price }}</span>
				</div>
				<!-- <div style="position: relative">
					<span class="value" :class="changeClass(shopData)">@{{ shopData.betMarketInfo?.decimalPrice }}</span>
					<div class="change-icon">
						<RiseOrFall v-if="shopData.betMarketInfo?.oddsChange" :status="shopData.betMarketInfo?.oddsChange == 'oddsUp' ? 1 : 2" />
					</div>
				</div> -->
			</div>
			<div class="bet_slip_type mt_2">
				<div>
					<span v-if="shopData.isLive" class="mr_6">[滚球]</span>
					<!-- <span class="mr_6">{{ SportsCommonFn.betTypeMap[shopData.betMarketInfo?.betType] }}</span> -->
					<!-- <span class="mr_10">({{ shopData.gameInfo?.liveHomeScore }} - {{ shopData.gameInfo?.liveAwayScore }})</span> -->
					<span>[优胜冠军]</span>
					<span>[欧洲盘]</span>
				</div>

				<div>
					<span class="tip"> {{ examineEventsStatus }}</span>
				</div>
			</div>
			<div class="bet_slip_name mt_4">
				<span>{{ shopData.leagueName }}</span>
				<!-- v
				<span>{{ shopData.teamInfo.awayName }}</span>
				<span>&nbsp;</span>
				<span>({{ shopData.gameInfo?.liveHomeScore }} - {{ shopData.gameInfo?.liveAwayScore }})</span> -->
			</div>
			<!-- <div class="bet_slip_name">
				<span>{{ shopData.leagueName }}</span>
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import SportsCommonFn from "/@/utils/sports/common";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { RiseOrFall } from "/@/components/Sport/index";
import { useChampionShopCartStore } from "/@/stores/modules/sports/championShopCart";
const sportsBetEvent = useSportsBetEventStore();
const ChampionShopCartStore = useChampionShopCartStore();

const props = withDefaults(
	defineProps<{
		/** 选中的商品详细  */
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

// watch(
// 	() => props.shopData,
// 	(newValue, oldValue) => {
// 		console.info("选中的商品详细", newValue);
// 	}
// );

/**
 * @description 判断赛事文本
 */
const examineEventsStatus = computed(() => {
	const item = props.shopData;
	// 判断赛事状态 与 盘口状态
	if (item.oddsStatus !== "running" && item.oddsStatus !== "Running") {
		return "盘口已关闭";
	}

	if (ChampionShopCartStore.outrightBetData.length > 1) {
		return "不支持串关";
	}
});

/**
 * @description 判断赛事状态
 */
const opacityFn = () => {
	const item = props.shopData;
	// 判断赛事状态 与 盘口状态
	if (item.oddsStatus !== "running" || ChampionShopCartStore.outrightBetData.length > 1) {
		return 0.4;
	} else {
		return 1;
	}
};

/**
 * 删除赛事
 */
const onDeleteBetEvent = () => {
	ChampionShopCartStore.removeOutrightTEventCart(props.shopData);
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
	background-color: var(--Bg3);

	.remove_icon {
		position: absolute;
		width: 40px;
		height: 24px;
		bottom: 0px;
		right: 0px;
		border-radius: 8px 0px;
		cursor: pointer;

		//颜色非动态
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
