<template>
	<div class="content">
		<div :class="['content', 'bg_BG1']">
			<div class="tabBox bg_BG1" :class="{ 'fixed-tab': isFixed }">
				<div class="tabs">
					<ul class="tab bg_BG1">
						<li @click="changeTab('all')" key="all" :class="{ selected: activeTab == 'all' }">{{ $t('sports["所有投注"]') }}</li>
						<!-- <li v-for="(i, index) in markets" :key="i.betTypeName" @click="changeTab(i.betTypeName)" :class="{ selected: activeTab == i.betTypeName }">{{ i.betTypeName }}</li> -->
					</ul>
				</div>
			</div>
			<div class="selections_list" v-if="markets.length">
				<Collapse v-model="activeSelection" :accordion="false">
					<CollapseItem class="selection_item" v-for="i in markets" v-show="activeTab == 'all' || activeTab == i.betTypeName" :key="i.betTypeName" :name="i.betTypeName">
						<template #title>
							<span class="item-red"></span>
							<div class="tournament-header">
								<div class="tournament-info">
									<div class="tournament-name">{{ i.betTypeName }}</div>
								</div>
								<!-- 收起折叠面板箭头 -->
								<!-- <svg-icon :class="{ sport_arrow: activeSelection.includes(i.betTypeName) }" name="common-arrow_down" size="12" /> -->
							</div>
						</template>
						<template #default>
							<ul class="bg_BG3 tournament-content">
								<li v-for="market in i.markets" :key="market.marketId">
									<div
										class="li_tag bg_Tag1"
										v-for="selection in filterSelections(market.selections)"
										@click="market.marketStatus === 'running' && onSetSportsEventData(market, selection)"
										:class="{
											isBright: isBright(market, selection),
											threeCol: filterSelections(market.selections).length % 3 === 0 && !isbladder(market.betType),
											twoCol: filterSelections(market.selections).length % 3 !== 0 && !isbladder(market.betType),
										}"
										:key="market.marketId + selection.key"
									>
										<BetSelector :value="selection.oddsPrice.decimalPrice" :is-run="market.marketStatus === 'running'">
											<div class="selection-box" v-if="market.marketStatus === 'running'">
												<span :class="['fs_14', 'fw_400', 'selectionTitle']">
													<SelectionName :name="selection?.keyName" :betType="market.betType" />
													<span v-show="selection.key != 'x'">&nbsp;{{ SportsCommon.formatPoint({ betType: market.betType, point: selection?.point, key: selection?.key }) }}</span>
												</span>
												<span :class="['fs_14', 'fw_400', 'price', 'value']">{{ selection.oddsPrice.decimalPrice }} </span>
											</div>
											<div v-else class="lock">
												<svg-icon name="sports-lock" size="14" />
											</div>
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
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSportsBetEventStore } from "/@/stores/modules/sports/sportsBetData";
import SportsCommon from "/@/views/sports/utils/common";
import SelectionName from "../components/selectionName.vue";
import { useRoute } from "vue-router";
import { useSportsBetChampionStore } from "/@/stores/modules/sports/championShopCart";
import { useCommonShopCat } from "/@/stores/modules/sports/commonShopCat";
import BetSelector from "/@/views/sports/components/BetSelector/index.vue";
const commonShopCat = useCommonShopCat();
const ChampionShopCartStore = useSportsBetChampionStore();

/**
 * @description 市场类型接口
 */
interface marketType {
	markets: any;
	betTypeName: string;
	marketId: string;
	betType: string;
	marketStatus: string;
}

/**
 * @description 组件属性定义
 */
const props = withDefaults(
	defineProps<{
		markets: marketType[];
		eventDetail: any;
	}>(),
	{}
);

const sportsBetEvent = useSportsBetEventStore();
const route = useRoute();
const isFold = ref(false);
const isFixed = ref(false);
const activeTab = ref("all");
const activeSelection = ref<string[]>([]);

/**
 * @description 计算市场选择
 */
const marketsSelect = computed(() => sportsBetEvent.getEventInfo);

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
	return data.filter((item: { oddsPrice: { decimalPrice: number } }) => item.oddsPrice.decimalPrice != 0);
};

/**
 * @description 设置体育事件数据
 * @param market 市场对象
 * @param selection 选择项对象
 */
const onSetSportsEventData = (market: any, selection: any) => {
	commonShopCat.addEventToCart({ data: props.eventDetail, market, selection, type: route.meta.name === "champion" ? "1" : "0" });
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
 * @description 计算冠军页面的市场选择
 */
const championMarketsSelect = computed(() => ChampionShopCartStore.getEventInfo);

/**
 * @description 监听activeSelection变化
 */

/**
 * @description 判断是否高亮
 * @param market 市场对象
 * @param selection 选择项对象
 * @returns 是否高亮
 */
const isBright = (market: { marketId: any; eventId: string }, selection: { key: any }) => {
	if (route.meta.name !== "champion") {
		return marketsSelect.value[market.eventId as string]?.listKye == `${market.marketId}-${selection.key}`;
	} else {
		return championMarketsSelect.value[market.eventId as string]?.listKye == `${market.marketId}-${selection.key}`;
	}
};
watch(
	() => activeSelection.value.length,
	(newValue, oldValue) => {
		if (newValue == 0 || newValue < oldValue) {
			isFold.value = false;
		}
		if (newValue >= props.markets.length) {
			isFold.value = true;
		}
	}
);
</script>

<style scoped lang="scss">
.content {
	// Add your styles here
	border-radius: 16px 16px 0 0;
	.tabBox {
		// height: 80px;
		// width: 100%;
	}
	.isBright {
		position: relative;
		&::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 8px;
			border: 2px solid;
			box-sizing: border-box;
			border: 1px solid var(--Theme);
		}
		.label_one {
			color: var(--Text-s) !important;
		}
	}
	.tabBox {
		// width: 100vw;
		overflow: hidden;
		display: flex;
		align-items: center;
		background-color: var(--Bg-1);
		border-radius: 0px 0px 8px 8px;

		svg {
			width: 26px;
			height: 26px;
		}
	}
	.tabs {
		padding: 11px 24px;
		width: calc(100% - 48px);
		box-sizing: border-box;
	}
	.tab {
		padding: 0;
		margin: 0;
		width: 100%;
		line-height: 30px;
		display: flex;
		gap: 10px;
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;
		list-style-type: none;
		width: 100%;
		box-sizing: border-box;
		li {
			width: 96px;
			height: 30px;
			color: var(--Text-1);
			text-align: center;
			position: relative; /* 为li元素设置相对定位，以便::after伪元素可以相对于它定位 */
			font-size: 14px;
			font-weight: 400;
			display: inline-block;
			border-radius: 4px;
			border: 1px solid var(--Line-2);
		}
		.selected {
			background-color: var(--Theme);
			color: var(--Text-a);
		}
	}
	.tab::-webkit-scrollbar {
		width: 0; /* 对于横向滚动条 */
		height: 0; /* 对于纵向滚动条 */
		display: none;
	}

	.fixed-tab {
		position: sticky;
		top: 100px; /* 与smallHeader对齐 */
		width: 100%;
		z-index: 1; /* 确保tab位于内容之上 */
	}
	.tournament-content {
		border-radius: 0px 0px 16px 16px;
		.selectionTitle {
			display: flex;
			justify-content: center;
			align-items: center;
			:first-child {
				color: var(--Text-1);
			}
			:last-child {
				color: var(--Text-s);
			}
		}
	}
	.tournament-header {
		display: flex;
		align-items: center;
		// padding: 8px 12px;
		margin-bottom: 10px;
		padding-left: 10px;
		border-radius: 16px 16px 0px 0px;
		box-sizing: border-box;

		.tournament-info {
			flex: 1;
			display: flex;
			align-items: center;
			margin-right: 18px;

			.tournament-icon {
				width: 30px;
				height: 30px;
				margin: 0 12px;
				img {
					width: 100%;
					height: 100%;
				}
			}

			.tournament-name {
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 400;
				line-height: 22px;
				white-space: nowrap; /* 禁止换行 */
				overflow: hidden; /* 隐藏超出部分 */
				text-overflow: ellipsis; /* 显示省略号 */
			}
		}
	}
	.noData {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 14px;
		color: var(--Text-2);
		height: calc(100vh - 480px);
		svg {
			width: 140px;
			height: 120px;
			margin-bottom: 10px;
		}
	}
	.selections_list {
		// padding: 20px 24px;
		margin-top: 5px;
		.selection_item {
			position: relative;
			border-radius: 8px;
			background-color: var(--Bg-1);
			margin-bottom: 20px;
			padding: 10px 8px 8px 8px;
			.item-red {
				position: absolute;
				background-color: var(--Theme);
				border-radius: 0 4px 4px 0;
				width: 4px;
				height: 22px;
				top: 10px;
				left: 0;
			}
			.x-collapse-item_header {
			}
			.x-collapse-transition {
			}
		}
		ul {
			padding: 0;
			margin: 0;
			li {
				display: flex;
				flex-wrap: wrap; /* 允许元素换行 */
				// justify-content: space-between; /* 项目之间的间隔 */
				gap: 10px;
			}
			.li_tag {
				cursor: pointer;
				// padding: 7px 12px;
				height: 34px;
				box-sizing: border-box; /* 包括边框和内边距在内占据50% */
				border-radius: 4px;
				display: flex;
				justify-content: center;
				flex-direction: column;
				background-color: var(--Bg-3);
				flex-basis: calc(50% - 5px); /* 每个元素占据50%，减去10px的间隔 */
				font-size: 14px;
				margin-bottom: 10px;
				overflow: hidden;
				&:hover {
					background-color: var(--betselector-hover-bg);
				}
				.price {
					position: relative;
					display: inline-block;
					color: var(--Text-s);
					display: flex;
					align-items: center;
					gap: 5px;
					span {
						width: 10px;
						display: inline-block;
					}
				}
				.selection-box {
					display: flex;
					justify-content: space-between;
					height: 100%;
					padding: 0 15px 0 10px;
				}
				.lock {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 100%;
				}
			}

			.threeCol {
				flex-basis: calc(33% - 4px); /* 每个元素占据50%，减去10px的间隔 */
			}
		}
	}
}
</style>
