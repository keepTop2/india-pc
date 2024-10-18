<template>
	<SelectCard :teamData="listData" :expandedCount="expandedPanels.size" @onToggleAllStates="onToggleAllStates(listData)" />
	<!-- 联赛数据统计卡片 -->
	<div :style="computedHeight" class="box-content">
		<DynamicScroller :items="listData" :min-item-size="34" class="scroller" key-field="leagueId" :prerender="10">
			<template v-slot="{ item, index, active }">
				<DynamicScrollerItem :item="item" :active="active" :data-index="index" :data-active="active">
					<FootballCard :teamData="item" :dataIndex="index" :isExpanded="!expandedPanels.has(index)" @oddsChange="handleOddsChange" @toggleDisplay="toggleDisplay" />
				</DynamicScrollerItem>
			</template>
		</DynamicScroller>
	</div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { FootballCard, SelectCard } from "./components";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import useExpandPanels from "/@/views/sports/hooks/useExpandPanels";

const props = defineProps({
	listData: {
		type: Array,
		default: () => [], // 默认值
	},
	matchedLeague: {
		type: Array,
		default: () => [], // 默认值
	},
});

// 获取当前路由
const route = useRoute();

// 引入赔率变化事件的相关逻辑
const { clearSportsOddsChange } = useSportPubSubEvents();

/**
 * @description 处理赔率发生变化的事件，在动画结束后清除掉 `oddsChange` 状态
 * @param {Object} params - 包含市场ID和选择项的数据
 * @param {number} params.marketId - 市场ID
 * @param {Array} params.selections - 选择项数组
 */
const handleOddsChange = ({ marketId, selections }: { marketId: number; selections: any[] }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

// 计算高度，根据不同的路由动态设置高度
const computedHeight = computed(() => {
	// 默认高度
	let baseHeight = "calc(100vh - 227px)";
	// 如果当前路由是 /sports/morningTrading, 加上 48px
	if (route.path === "/sports/morningTrading") {
		baseHeight = `calc(100vh - 276px)`;
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

<style lang="scss" scoped>
.box-content {
	width: 100%;
	// height: calc(100vh - 227px);

	.scroller {
		height: 100%;
	}
}

.noData {
	height: 100%;
}
</style>
