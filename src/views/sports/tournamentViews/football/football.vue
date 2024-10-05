<template>
	<SelectCard :teamData="listData" />
	<!-- 联赛数据统计卡片 -->
	<div class="box-content">
		<!-- <template v-if="listData.length"> -->
		<!--
					虚拟滚动列表组件
					Props 说明：
					- ref="virtualScrollRef"：用于引用虚拟滚动组件，以便操作内部方法。
					- :list-data：展示的数据列表，优先展示匹配到的联赛数据。
					- bottomClass：底部容器样式类名。
					- minDivClass：收起时的标题样式类名。
					- childrenDivClass：展开时的子集内容样式类名。
				-->
		<VirtualScrollVirtualList
			ref="virtualScrollRef"
			bottomClass="card-container"
			minDivClass="card-header"
			childrenDivClass="league-content"
			:list-data="matchedLeague.length > 0 ? matchedLeague : listData"
		>
			<template #default="{ item, index, isExpand }">
				<!--
						滚球卡片组件
						Props 说明：
						- teamData：传递当前队伍的数据。
						- isExpand：控制卡片的展开状态。
						- dataIndex：当前队伍在列表中的索引。
						- oddsChange：处理赔率变化时的事件。
						- toggleDisplay：处理卡片的展开/收起事件。
					-->
				<FootballCard :teamData="item" :isExpand="isExpand" :dataIndex="index" @oddsChange="handleOddsChange" @toggleDisplay="handleToggleDisplay" />
			</template>
		</VirtualScrollVirtualList>
		<!-- </template> -->
		<!-- 无数据时显示的占位内容 -->
		<!-- <div v-else class="noData">
			<NoneData />
		</div> -->
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

// 虚拟滚动列表组件的引用
const virtualScrollRef = ref<InstanceType<typeof VirtualScrollVirtualList>>();
// 路由实例
const route = useRoute();
// 引入赔率变化事件的相关逻辑
const { clearSportsOddsChange } = useSportPubSubEvents();
// 侧边栏状态管理实例
const sidebarStore = useSidebarStore();

/**
 * @description 处理赔率发生变化的事件，在动画结束后清除掉 `oddsChange` 状态
 * @param {Object} params - 包含市场ID和选择项的数据
 * @param {number} params.marketId - 市场ID
 * @param {Array} params.selections - 选择项数组
 */
const handleOddsChange = ({ marketId, selections }: { marketId: number; selections: any[] }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

/**
 * @description 处理展开/收起卡片的事件
 * @param {number} [val] - 可选参数，指定要展开或收起的卡片索引
 */
const handleToggleDisplay = (val?: number) => {
	virtualScrollRef.value?.setlistDataEisExpand(val);
};

// 监控 matchedLeague 的变化并处理逻辑
watchEffect(() => {
	if (props.matchedLeague?.length) {
		// 使用可选链操作符
		console.log("Updated matched league:", props.matchedLeague);
		// 在此可以进一步处理 matchedLeague 的数据
	}
});
</script>

<style lang="scss" scoped>
.box-content {
	width: 100%;
	height: calc(100vh - 200px);
}
.card-container {
	margin-bottom: 5px;
}
.noData {
	height: 100%;
}
</style>
