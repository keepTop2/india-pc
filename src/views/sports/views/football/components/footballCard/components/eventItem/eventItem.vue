<template>
	<div class="league-content">
		<!-- 队伍信息 -->
		<TeamInfoCard :IfOffTheBat="IfOffTheBat" :dataIndex="dataIndex" :teamData="event"></TeamInfoCard>
		<!-- 盘口信息 -->
		<div class="league-markets">
			<!-- 全场独赢 -->
			<MarketColumn cardType="capot" :sportInfo="event" :betType="5" :selectionsLength="3" @oddsChange="oddsChange"></MarketColumn>
			<!-- 全场让球 -->
			<MarketColumn cardType="handicap" :sportInfo="event" :betType="1" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
			<!-- 全场大小 -->
			<MarketColumn cardType="magnitude" :sportInfo="event" :betType="3" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
			<!-- 半场独赢 -->
			<MarketColumn cardType="capot" :sportInfo="event" :betType="15" :selectionsLength="3" @oddsChange="oddsChange"></MarketColumn>
			<!-- 半场让球 -->
			<MarketColumn cardType="handicap" :sportInfo="event" :betType="7" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
			<!-- 半场大小 -->
			<MarketColumn cardType="magnitude" :sportInfo="event" :betType="8" :selectionsLength="2" @oddsChange="oddsChange"></MarketColumn>
		</div>
		<!-- 其他信息 -->
		<div class="league-option">
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool.action)">
				<span class="icon"><svg-icon :name="tool.iconName" width="23px" height="16px"></svg-icon></span>
				<!-- <span class="tooltip-text">{{ tool.tooltipText }}</span> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TeamInfoCard, MarketColumn } from "/@/views/sports/views/football/components/footballCard/index";
import { useSportHotStore } from "/@/stores/modules/sports/sportHot";
const SportHotStore = useSportHotStore();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	event: any;
	/** 当前路由名称 */
	IfOffTheBat: string;
	displayContent: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 数据索引 */
	dataIndex: 0,
	/** 当前路由名称 */
	IfOffTheBat: "rollingBall",
	displayContent: true,
	/** 队伍数据 */
	event: () => {
		return {};
	},
});

const emit = defineEmits(["oddsChange"]);
/**
 * @description 动画结束删除oddsChange字段状态
 */
const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

const openPage = () => {
	SportHotStore.setCurrentEvent(props.event);
};
const toggleFullScreen = () => {
	SportHotStore.setCurrentEvent(props.event);
};
const refreshPage = () => {
	console.log("动画直播");
};

/**
 * @description  计算工具图标的显示状态
 */
const tools = computed(() => {
	const baseTools = [];

	// 判断 是否在未开赛页面
	if (props.IfOffTheBat !== "todayContest") {
		baseTools.push({
			iconName: "sports-score_icon",
			tooltipText: "比分板",
			action: openPage,
		});
	}

	// 判断是否有视频源
	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			tooltipText: "视频源",
			action: toggleFullScreen,
		});
	}
	return baseTools;
});

/**
 * @description  点击对应icon方法
 */
const handleClick = (action: () => void) => {
	if (typeof action === "function") {
		action();
	}
};
</script>

<style scoped lang="scss">
.league-content {
	display: flex;
	background-color: var(--Bg1);
	border-bottom: 1px solid var(--Line_2);
	&:last-child {
		border-bottom: 0px;
	}

	.league-markets {
		width: 804px;
		display: flex;
		gap: 4px;
		padding: 8px 4px 8px 0px;
	}
	.league-option {
		width: 58px;
		display: flex;
		gap: 16px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-left: 1px solid var(--Line_2);
		overflow: hidden;
		.tooltip-container {
			.icon {
				width: 23px;
				height: 16px;
				display: flex;
				align-items: center;
			}
		}
	}
}
</style>
