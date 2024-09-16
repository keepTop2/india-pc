<template>
	<div class="box-content">
		<!-- 日期选择区间 -->
		<template v-if="listData.length">
			<!-- 联赛数据统计 -->
			<SelectCard :teamData="listData"></SelectCard>
			<!--
				滚球虚拟列表
				bottomClass: 可获取间隔-底部边距
				minDivClass: 可获取缩小时展示的-标题高度
				childrenDivClass: 可获取展开时-子集卡片高度
			-->
			<VirtualScrollVirtualList
				ref="VirtualScrollVirtualListRef"
				bottomClass="card-container"
				minDivClass="card—header"
				childrenDivClass="league-content"
				:list-data="matchedLeague.length > 0 ? matchedLeague : listData"
			>
				<template #default="{ item, index, isExpand }">
					<!-- 滚球卡片 -->
					<RollingCard :teamData="item" :isExpand="isExpand" :dataIndex="index" @oddsChange="oddsChange" @toggleDisplay="toggleDisplay"></RollingCard>
				</template>
			</VirtualScrollVirtualList>
		</template>
		<!-- 无数据 -->
		<div v-else class="noData">
			<NoneData></NoneData>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { RollingCard, SelectCard, VirtualScrollVirtualList } from "./components/index";
import useSportPubSubEvents from "/@/views/sports/hooks/useSportPubSubEvents";
import { WebToPushApi } from "/@/views/sports/enum/sportEnum/sportEventSourceEnum";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const SidebarStore = useSidebarStore();
const { clearSportsOddsChange } = useSportPubSubEvents();
const route = useRoute();
const VirtualScrollVirtualListRef = ref();

/**选中的赛选类型；*/
const sportsActive = ref("rollingBall");

/**
 * @description 组件属性定义
 */
const props = defineProps({
	/**
	 * @description 列表数据
	 * @param {Array} listData
	 */
	listData: {
		type: Array,
		default: () => [],
	},
	/**
	 * @description 选择匹配到联赛数据
	 * @param {Array} matchedLeague
	 */
	matchedLeague: {
		type: Array,
		default: () => [],
	},
});

/**
 * @description 赔率发生变化后 3秒动画 清理掉oddsChange状态
 */
const oddsChange = ({ marketId, selections }) => {
	clearSportsOddsChange({ webToPushApi: WebToPushApi.rollingBall, marketId, selection: selections });
};

const toggleDisplay = (val?: number) => {
	VirtualScrollVirtualListRef.value.setlistDataEisExpand(val);
};
</script>

<style lang="scss" scoped>
.box-content {
	width: 100%;
	height: calc(100vh - 260px);
}

.card-container {
	margin-bottom: 5px;
}
.nonedata {
	margin-top: 20%;
}
</style>
