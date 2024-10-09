<template>
	<SelectCard :teamData="listData" @onToggleAllStates="onToggleAllStates" />
	<!-- 联赛数据统计卡片 -->
	<div class="box-content">
		<DynamicScroller :items="listData" :min-item-size="34" class="scroller" key-field="leagueId" :prerender="10">
			<template v-slot="{ item, index, active }">
				<DynamicScrollerItem :item="item" :active="active" :data-index="index" :data-active="active">
					<FootballCard :teamData="item" :dataIndex="index" :allStatus="allStatus" @oddsChange="handleOddsChange" />
				</DynamicScrollerItem>
			</template>
		</DynamicScroller>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from "vue";
import { useRoute } from "vue-router";
import { FootballCard, SelectCard, VirtualScrollVirtualList } from "./components";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";

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

// 用来存储所有 FootballCard 组件的 refs
const allStatus = ref(true);
const onToggleAllStates = () => {
	allStatus.value = !allStatus.value;
	console.log("触发全部状态", allStatus.value);
};
</script>

<style lang="scss" scoped>
.box-content {
	width: 100%;
	height: calc(100vh - 227px);
	.scroller {
		height: 100%;
	}
}

.noData {
	height: 100%;
}
</style>
