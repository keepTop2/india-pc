<template>
	<div class="league-content">
		<!-- 队伍信息 -->
		<TeamInfoCard :dataIndex="dataIndex" :teamData="event"></TeamInfoCard>
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
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool)">
				<span class="icon"><svg-icon :name="getIconName(tool, event, index)" width="23px" height="16px"></svg-icon></span>
				<!-- <span class="tooltip-text">{{ tool.tooltipText }}</span> -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TeamInfoCard, MarketColumn } from "/@/views/sports/tournamentViews/football/components/footballCard/index";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";
const SidebarStore = useSidebarStore();
const { toggleEventScoreboard, switchEventVideoSource } = useToolsHooks();

interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	event: any;
	displayContent: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	/** 数据索引 */
	dataIndex: 0,
	displayContent: true,
	/** 队伍数据 */
	event: () => {
		return {};
	},
});

const emit = defineEmits(["oddsChange"]);

// 获取侧边栏图标
const getIconName = (tool: any, events: any, index: number) => {
	const { eventId } = SidebarStore.getEventsInfo;
	const isEventActive = events.eventId === eventId;
	if (!isEventActive) {
		return tool.iconName;
	}
	let activeIndex = -1;
	switch (SidebarStore.sidebarStatus) {
		case "scoreboard":
			activeIndex = 0;
			break;
		case "live":
			activeIndex = 1;
			break;
		// 你可以根据其他可能的状态扩展此逻辑
	}
	return index === activeIndex ? tool.iconName_active : tool.iconName;
};

const oddsChange = (obj: any) => {
	emit("oddsChange", obj);
};

// 点击对应工具
const handleClick = (tool: any) => {
	tool.action(tool.param);
};

/**
 * @description  计算工具图标的显示状态
 */
const tools = computed(() => {
	const baseTools = [];
	// 判断 是否在未开赛页面
	baseTools.push({
		iconName: "sports-score_icon",
		iconName_active: "sports-score_icon_active",
		tooltipText: "比分板",
		action: (event: any) => toggleEventScoreboard(event), // 闭包函数，事件绑定传递参数
		param: props.event, // 传递参数
	});
	// 判断是否有视频源
	if (props.event.streamingOption != 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			action: (event: any) => toggleEventScoreboard(event,true),
			param: props.event, // 传递参数
		});
	}
	return baseTools;
});
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
		overflow: hidden;
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
			cursor: pointer;
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
