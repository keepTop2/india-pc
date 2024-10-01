<template>
	<div class="bet_slip_item">
		<!-- 投注成功卡片不显示删除图标 -->
		<div v-if="hasClose" class="remove" @click="onDeleteBetEvent()">
			<span class="delete_icon"><svg-icon name="sports-delete" size="18px"></svg-icon></span>
		</div>
		<div class="bet_slip_info" :style="{ opacity: opacityFn() }">
			<div class="bet_slip_label">
				<div>{{ shopData.event.teamName }}</div>
				<!-- <div style="position: relative">
					<span>@{{ shopData.event.price }}</span>
				</div> -->
				<div style="position: relative">
					<span class="value" :class="changeClass(shopData.event)">@{{ shopCartChampionPubSub.decimalPrice(props.shopData.event) }}</span>
					<div class="change-icon">
						<RiseOrFall v-if="shopData.event.betMarketInfo?.oddsChange" :status="shopData.event.betMarketInfo?.oddsChange == 'oddsUp' ? 1 : 2" />
					</div>
				</div>
			</div>
			<div class="bet_slip_type">
				<div>
					<span v-if="shopData.event.isLive" class="mr_6">[滚球]</span>
					<span>[优胜冠军]</span>
					<span>[欧洲盘]</span>
				</div>

				<div v-if="examineEventsStatus">
					<span class="tip"> {{ examineEventsStatus }}</span>
				</div>
			</div>
			<div class="bet_slip_name mt_2">
				<span>{{ shopData.event.leagueName }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import SportsCommonFn from "/@/views/sports/utils/common";
import shopCartChampionPubSub from "/@/views/sports/hooks/shopCartChampionPubSub";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import { RiseOrFall } from "/@/components/Sport/index";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
const sportsBetEvent = useSportsBetEventStore();
const ChampionShopCartStore = useSportsBetChampionStore();

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
	if (ChampionShopCartStore.championBetData.length > 1) {
		return "不支持串关";
	}
	const item = props.shopData.event;
	// 判断赛事状态 与 盘口状态
	if (item.oddsStatus !== "running" && item.oddsStatus !== "Running") {
		return "盘口已关闭";
	}
});

/**
 * @description 判断赛事状态
 */
const opacityFn = () => {
	const item = props.shopData.event;
	// 判断赛事状态 与 盘口状态
	if (item.oddsStatus !== "running" || ChampionShopCartStore.championBetData.length > 1) {
		return 0.4;
	} else {
		return 1;
	}
};

/**
 * 删除赛事
 */
const onDeleteBetEvent = () => {
	ChampionShopCartStore.removeChampionTEventCart(props.shopData);
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
				transform: translate(-50%, 0);
			}
		}

		.bet_slip_type {
			display: flex;
			justify-content: space-between;

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
