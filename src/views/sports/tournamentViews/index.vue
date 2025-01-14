<template>
	<div style="height: 34px; margin: 4px 0">
		<SelectCard :teamData="listData" :expandedCount="expandedPanels.size" @onToggleAllStates="onToggleAllStates(listData)" />
	</div>

	<!-- 联赛数据统计卡片 -->
	<div v-if="listData.length" :style="computedHeight" class="box-content">
		<DynamicScroller itemClass="scroller-item" :items="listData" :min-item-size="154" class="scroller" key-field="leagueId">
			<template v-slot="{ item, index, active }">
				<DynamicScrollerItem :item="item" :key="item.leagueId" :active="active" :data-index="index" :data-active="active">
					<!-- <component
						:is="cardComponent"
						:teamData="item"
						:dataIndex="index"
						:isExpanded="!expandedPanels.has(index)"
						@oddsChange="handleOddsChange"
						@toggleDisplay="toggleDisplay"
					/> -->
					<MatchCard
						:scoreboardId="eventId"
						:data-index="index"
						:isExpanded="!expandedPanels.has(index)"
						:events="item"
						:sport-type="Number(route.query.sportType)"
						@toggleDisplay="toggleDisplay"
					/>
				</DynamicScrollerItem>
			</template>
		</DynamicScroller>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, defineProps, computed, watch, ref } from "vue";
import { useRoute } from "vue-router";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import useExpandPanels from "/@/views/sports/hooks/useExpandPanels";
import { Selection } from "/@/views/sports/models/interface";
import MatchCard from "/@/views/sports/components/MatchCard";
import viewSportPubSubEventData from "/@/views/sports/hooks/viewSportPubSubEventData";
// 展开收起总控
const SelectCard = defineAsyncComponent(() => import("/@/views/sports/components/selectCard/selectCard.vue"));

// 懒加载不同球类的组件
const sportsMap: Record<number, ReturnType<typeof defineAsyncComponent>> = {
	1: defineAsyncComponent(() => import(/* webpackChunkName: "football" */ "/@/views/sports/tournamentViews/football/components/footballCard/footballCard.vue")), // 足球
	2: defineAsyncComponent(() => import(/* webpackChunkName: "basketball" */ "/@/views/sports/tournamentViews/basketball/components/rollingCard/rollingCard.vue")), // 篮球
	3: defineAsyncComponent(() => import(/* webpackChunkName: "americanSoccer" */ "/@/views/sports/tournamentViews/americanSoccer/components/rollingCard/rollingCard.vue")), // 美国足球
	4: defineAsyncComponent(() => import(/* webpackChunkName: "iceHockey" */ "/@/views/sports/tournamentViews/iceHockey/components/rollingCard/rollingCard.vue")), // 冰球
	5: defineAsyncComponent(() => import(/* webpackChunkName: "tennis" */ "/@/views/sports/tournamentViews/tennis/components/rollingCard/rollingCard.vue")), // 网球
	6: defineAsyncComponent(() => import(/* webpackChunkName: "volleyball" */ "/@/views/sports/tournamentViews/volleyball/components/rollingCard/rollingCard.vue")), // 排球
	7: defineAsyncComponent(() => import(/* webpackChunkName: "billiards" */ "/@/views/sports/tournamentViews/billiards/components/rollingCard/rollingCard.vue")), // 台球
	8: defineAsyncComponent(() => import(/* webpackChunkName: "baseball" */ "/@/views/sports/tournamentViews/baseball/components/rollingCard/rollingCard.vue")), // 棒球
	9: defineAsyncComponent(() => import(/* webpackChunkName: "badminton" */ "/@/views/sports/tournamentViews/badminton/components/rollingCard/rollingCard.vue")), // 羽毛球
	43: defineAsyncComponent(() => import(/* webpackChunkName: "eSports" */ "/@/views/sports/tournamentViews/eSports/components/rollingCard/rollingCard.vue")), // 电子竞技
};

const route = useRoute(); // 获取当前路由实例

const props = defineProps({
	listData: {
		type: Array,
		default: () => [], // 默认值
	},
});

// 获取到的数据
const eventId = computed(() => {
	const childrenViewData = viewSportPubSubEventData.sidebarData.childrenViewData;
	if (childrenViewData?.length) {
		return childrenViewData[0]?.events[0].eventId;
	}
	return "";
});

// 根据路由的 sportType 查询对应的组件
const cardComponent = computed(() => {
	const sportType = Number(route.query.sportType); // 获取当前 sportType
	return sportsMap[sportType] || null; // 返回对应的组件，若无则返回 null
});

// 引入赔率变化事件的相关逻辑
const { clearSportsOddsChange } = useSportPubSubEvents();

/**
 * @description 处理赔率发生变化的事件，在动画结束后清除掉 `oddsChange` 状态
 * @param {Object} params - 包含市场ID和选择项的数据
 * @param {number} params.marketId - 市场ID
 * @param {Array} params.selections - 选择项数组
 */
const handleOddsChange = ({ marketId, selections }: { marketId: number; selections: Selection }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

// 计算高度，根据不同的路由动态设置高度
const computedHeight = computed(() => {
	// 默认高度
	let baseHeight = "calc(100vh - 247px)";
	// 如果当前路由是 /sports/morningTrading, 加上 48px
	if (route.path === "/sports/morningTrading") {
		baseHeight = `calc(100vh - 296px)`;
	}
	return {
		height: baseHeight,
	};
});

/**
 * @description 控制收起/展开面板
 * onToggleAllStates 总控制器
 * toggleDisplay 子面板控制器
 * expandedPanels 所有收起状态的子面板索引
 */
const { expandedPanels, onToggleAllStates, toggleDisplay } = useExpandPanels();
</script>

<style scoped lang="scss">
.box-content {
	width: 100%;
	// height: calc(100vh - 227px);
	:deep(.scroller-item) {
		margin-bottom: 4px;
	}
	.scroller {
		height: 100%;
	}
	:deep(.scroller-item) {
		margin-bottom: 4px;
	}
	:deep(.market-item) {
		&:hover {
			background-color: var(--betselector-hover-bg);
		}
	}
	:deep(.isBright) {
		background-color: var(--Bg-3) !important;
		&::after {
			content: "";
			width: 100%;
			height: 100%;
			position: absolute;
			border: 1px solid var(--Bg-5) !important;
			border-radius: 4px;
			left: 0;
			top: 0;
		}
		.label {
			color: var(--Text-a);
		}
	}
	:deep(.league-info) {
		.team-name {
			white-space: nowrap; /* 防止文本换行 */
			overflow: hidden; /* 超出部分隐藏 */
			text-overflow: ellipsis; /* 超出部分显示省略号 */
		}

		.team-icon .icon {
			vertical-align: revert;
		}
	}
	:deep(.vue-recycle-scroller) {
		&::-webkit-scrollbar {
			display: none;
		}
	}
}

.noData {
	height: 100%;
}
</style>
