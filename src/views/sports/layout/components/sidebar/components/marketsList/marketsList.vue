<template>
	<div class="content">
		<div class="header">
			<ul class="tabs">
				<li @click="changeTab('all')" key="all" :class="{ selected: activeTab == 'all' }">{{ $t('sports["所有投注"]') }}</li>
				<!-- <li v-for="(i, index) in markets" :key="i.betTypeName" @click="changeTab(i.betTypeName)" :class="{ selected: activeTab == i.betTypeName }">{{ i.betTypeName }}</li> -->
			</ul>
		</div>
		<div class="selections_list" v-if="markets.length">
			<Collapse v-model="activeSelection" :accordion="false">
				<CollapseItem class="selection_item" v-for="i in markets" v-show="activeTab == 'all' || activeTab == i.betTypeName" :key="i.betTypeName" :name="i.betTypeName">
					<template #title>
						<span class="item-red"></span>
						<div class="tournament-header">
							<span class="header-icon"></span>
							<div class="tournament-name">{{ i.betTypeName }}</div>
							<svg-icon
								:class="{ sport_arrow: activeSelection.includes(i.betTypeName), 'rotate-right': !activeSelection.includes(i.betTypeName) }"
								name="arrow_down"
								width="12px"
								height="8px"
							/>
						</div>
					</template>
					<template #default>
						<ul class="tournament-content">
							<li
								v-for="market in i.markets"
								:key="market.marketId"
								:class="{
									threeCol: filterSelections(market.selections).length % 3 === 0,
									twoCol: filterSelections(market.selections).length % 3 !== 0,
								}"
							>
								<div
									class="market-item"
									v-for="selection in filterSelections(market.selections)"
									@click="market.marketStatus === 'running' && onSetSportsEventData(market, selection)"
									:class="{ isBright: isBright(market, selection) }"
									:key="market.marketId + selection.key"
								>
									<BetSelector :value="selection.oddsPrice.decimalPrice" :isRun="market.marketStatus === 'running'">
										<span class="label">
											<SelectionName class="label_one" :class="[selection.key != 'x' ? 'narrow' : 'wide']" :name="selection?.keyName" :betType="market.betType" />
											<span class="label_two" v-show="selection.key != 'x'">{{
												SportsCommon.formatPoint({
													betType: market.betType,
													point: selection?.point,
													key: selection?.key,
												})
											}}</span>
										</span>
										<template v-if="market.marketStatus === 'running'">
											<div class="price">
												<span>{{ selection.oddsPrice.decimalPrice }}</span>
											</div>
										</template>
										<svg-icon v-else name="sports-lock" class="icon-lock" />
									</BetSelector>
								</div>
							</li>
						</ul>
					</template>
				</CollapseItem>
			</Collapse>
		</div>
		<div v-if="!markets.length" class="noData color_T3">
			<svg-icon name="sports-no_markets" />
			<div>{{ $t('sports["盘口已关闭"]') }}</div>
			<div>{{ $t('sports["当前无法进行投注"]') }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import SportsCommon from "/@/views/sports/utils/common";
import SelectionName from "./components/selectionName.vue";
import { LocationQueryValue, useRoute } from "vue-router";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import { useCommonShopCat } from "/@/stores/modules/sports/commonShopCat";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";
const SidebarStore = useSidebarStore();
/**
 * @description 市场类型接口
 */
interface marketType {
	betTypeName: string;
	marketId: string;
	betType: string;
	marketStatus: string;
}
const sportsBetEvent = useSportsBetEventStore();
const ChampionShopCartStore = useSportsBetChampionStore();
// 公共购物车
const commonShopCat = useCommonShopCat();
const route = useRoute();
const isFold = ref(false);
const isFixed = ref(false);
const activeTab = ref("all");
const activeSelection = ref<string[]>([]);

/**
 * @description 获取赛事列表下的赛事
 * @returns 赛事数组
 */
const eventDetail = computed(() => {
	const childrenViewData = viewSportPubSubEventData.sidebarData.childrenViewData;
	if (childrenViewData) {
		return JSON.parse(JSON.stringify(childrenViewData))[0]?.events?.[0];
	}
	return {};
});

/**
 * @description 计算并组织市场数据
 * @returns 组织和排序后的市场数据
 */

const markets = computed(() => {
	let marketData: any = [];
	if (eventDetail.value) {
		const markets = eventDetail.value?.markets;
		for (const key in markets) {
			const market = markets[key];
			const { betTypeName, marketId, betType } = market;
			const existingMarketData = marketData.find((data: { betTypeName: any }) => data.betTypeName === betTypeName);
			if (existingMarketData) {
				existingMarketData.markets[key] = market;
			} else {
				const newData: any = {
					betTypeName: betTypeName,
					marketId: marketId,
					betType: betType,
					markets: {
						[key]: market,
					},
				};
				marketData.push(newData);
			}
		}
	}
	marketData.sort((a: { betType: number; marketId: number }, b: { betType: number; marketId: number }) => {
		if (a.betType === b.betType) {
			return a.marketId - b.marketId;
		}
		return a.betType - b.betType;
	});
	return marketData;
});

/**
 * @description 计算市场选择
 */
const marketsSelect = computed(() => sportsBetEvent.getEventInfo);
/**
 * @description 计算冠军页面的市场选择
 */
const championMarketsSelect = computed(() => ChampionShopCartStore.getEventInfo);

/**
 * @description 切换标签
 * @param key 标签键值
 */
const changeTab = (key: string) => {
	activeTab.value = key;
};

/**
 * @description 过滤选择项
 * @param data 选择项数据
 * @returns 过滤后的选择项
 */
const filterSelections = (data: any[]) => {
	const list = data.filter((item: { oddsPrice: { decimalPrice: number } }) => item.oddsPrice.decimalPrice != 0);
	return list;
};

/**
 * @description 判断是否高亮
 * @param market 市场对象
 * @param selection 选择项对象
 * @returns 是否高亮
 */
const isBright = (market: { marketId: any }, selection: { key: any }) => {
	const { eventId } = eventDetail.value;
	if (route.meta.name !== "champion") {
		return marketsSelect.value[eventId as string]?.listKye == `${market.marketId}-${selection.key}`;
	} else {
		return championMarketsSelect.value[eventId as string]?.listKye == `${market.marketId}-${selection.key}`;
	}
};

/**
 * @description 设置体育事件数据
 * @param market 市场对象
 * @param selection 选择项对象
 */
const onSetSportsEventData = (market: any, selection: any) => {
	commonShopCat.addEventToCart({ data: eventDetail.value, market, selection, type: route.meta.name === "champion" ? "1" : "0", isChampionData: false });
};

/**
 * @description 改变类名
 * @param item 选择项对象
 * @returns 类名
 */
const changeClass = (item: { oddsChange: string }) => {
	if (!item.oddsChange) return "";
	return item.oddsChange == "oddsUp" ? "oddsUp" : "oddsDown";
};

/**
 * @description 动画结束处理
 * @param marketId 市场ID
 * @param selection 选择项对象
 */
const animationEnd = (marketId: any, selection: { oddsChange: string }) => {
	if (selection.oddsChange) {
		selection.oddsChange = "";
	}
};

/**
 * @description 判断是否为特殊类型
 * @param type 类型编号
 * @returns 是否为特殊类型
 */
const isbladder = (type: number) => {
	const arr = [4, 30, 152, 416, 413, 414, 165, 166, 392, 399, 405, 413, 414, 1302, 1317, 3900, 3910, 3917];
	return arr.includes(type);
};

/**
 * @description 监听activeSelection变化
 */
watch(
	() => activeSelection.value.length,
	(newValue, oldValue) => {
		if (newValue == 0 || newValue < oldValue) {
			isFold.value = false;
		}
		if (newValue >= markets.value.length) {
			isFold.value = true;
		}
	}
);
</script>

<style scoped lang="scss">
.icon-lock {
	font-size: 16px;
	width: 16px;
	height: 16px;
}

.content {
	height: 100%;
	display: flex;
	flex-direction: column;
	border-radius: 16px 16px 0 0;

	.header {
		width: 100%;
		height: 40px;
		background-color: var(--Bg1);
		border-radius: 0px 0px 8px 8px;
		overflow: hidden;
		.tabs {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			gap: 10px;
			margin: 0;
			padding: 0px 8px;
			li {
				display: inline-block;
				display: flex;
				align-items: center;
				height: 24px;
				padding: 0px 10px;
				color: var(--Text1);
				text-align: center;
				font-size: 12px;
				font-weight: 400;
				border-radius: 4px;
				border: 1px solid var(--Line_2);
			}

			.selected {
				color: var(--Text_a);
				background-color: var(--Theme);
				border: 1px solid var(--Theme);
			}
		}
	}

	// 盘口列表
	.selections_list {
		flex: 1;
		overflow-y: auto;
		margin-top: 8px;
		// 盘口子项
		.selection_item {
			margin-bottom: 4px;
		}
		// 头部
		.tournament-header {
			position: relative;
			width: 100%;
			height: 38px;
			display: flex;
			align-items: center;
			padding: 0px 12px;
			border-radius: 4px;
			background: var(--Bg6);
			box-shadow: 0px 1px 1px 0px rgba(255, 255, 255, 0.1) inset;
			cursor: pointer;
			.header-icon {
				position: absolute;
				width: 4px;
				height: 22px;
				top: 50%;
				left: 0;
				transform: translate(0px, -50%);
				background-color: var(--Theme);
				border-radius: 0 4px 4px 0;
			}

			.tournament-name {
				flex: 1;
				color: var(--Text_a);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 400;
			}
			.sport_arrow {
				transition: transform 0.3s ease;
			}
			.rotate-right {
				transition: transform 0.3s ease;
				transform: rotate(-180deg);
			}
		}
		// 主体
		.tournament-content {
			display: grid;
			gap: 2px;
			padding: 4px 2px;
			margin: 0;
			background-color: var(--Bg1);

			.threeCol {
				display: grid;
				grid-template-columns: repeat(3, 1fr); // 设置为三列，每列平分宽度
				gap: 2px; // 设置行与列之间的间距为 10px

				.wide {
					max-width: 65px;
				}
				.narrow {
					max-width: 50px;
				}
			}

			.twoCol {
				display: grid;
				grid-template-columns: repeat(2, 1fr); // 设置为两列，每列平分宽度
				gap: 2px; // 设置行与列之间的间距为 10px

				.wide {
					max-width: 120px;
				}
				.narrow {
					max-width: 100px;
				}
			}

			.market-item {
				position: relative;
				width: 100%;
				height: 34px;

				background-color: var(--Bg3);
				border-radius: 4px;
				cursor: pointer;
				:deep(.bet-selector) {
					padding: 6px 8px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 8px;
					width: 100%;
				}
				.label {
					display: flex;
					align-items: center;
					gap: 4px;
					font-size: 12px;
					text-align: left;

					.label_one {
						color: var(--Text1);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.label_two {
						color: var(--Text_s);
					}
				}

				.price {
					display: inline-block;
					font-size: 14px;
					font-weight: 500;
					color: var(--Text_a);
					text-align: right;
				}
			}

			.isBright {
				background: var(--Bg5) !important;
				.label_one {
					color: var(--Text_s) !important;
				}
			}
		}
	}

	.noData {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 14px;
		color: var(--Text2);
		height: calc(100vh - 480px);

		svg {
			width: 140px;
			height: 120px;
			margin-bottom: 10px;
		}
	}
}
</style>
