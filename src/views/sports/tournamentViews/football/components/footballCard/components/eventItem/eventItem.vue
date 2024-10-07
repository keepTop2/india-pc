<template>
	<div class="league-content">
		<div class="league">
			<!-- 队伍信息 -->
			<TeamInfoCard :dataIndex="dataIndex" :teamData="event" />
		</div>

		<!-- 盘口信息 -->
		<div class="league-markets">
			<!-- 动态生成盘口信息 -->
			<MarketColumn
				v-for="(betType, index) in betTypes"
				:key="index"
				:class="betType.class"
				:cardType="betType.cardType"
				:sportInfo="event"
				:betType="betType.type"
				:selectionsLength="betType.selectionsLength"
				@oddsChange="oddsChange"
			/>
		</div>

		<!-- 其他信息 -->
		<div class="league-option">
			<!-- 工具图标 -->
			<div v-for="(tool, index) in tools" :key="index" class="tooltip-container" @click="handleClick(tool)">
				<span class="icon">
					<svg-icon :name="getIconName(tool, event, index)" width="23px" height="16px" />
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TeamInfoCard, MarketColumn } from "/@/views/sports/tournamentViews/football/components/footballCard/index";
import { useToolsHooks } from "/@/views/sports/hooks/scoreboardTools";
import { useSidebarStore } from "/@/stores/modules/sports/sidebarData";

// 使用 SidebarStore 管理侧边栏状态
const SidebarStore = useSidebarStore();
const { toggleEventScoreboard } = useToolsHooks();

// 定义 props 类型
const props = withDefaults(
	defineProps<{
		dataIndex: number; // 数据索引
		event: any; // 队伍数据
		displayContent: boolean; // 是否显示内容
	}>(),
	{
		dataIndex: 0,
		displayContent: true,
		event: {}, // 默认队伍数据为空对象
	}
);

// 定义 emits
const emit = defineEmits(["oddsChange"]);

// 盘口信息配置数组
const betTypes = [
	{ class: "capot", cardType: "capot", type: 5, selectionsLength: 3 }, // 全场独赢
	{ class: "handicap", cardType: "handicap", type: 1, selectionsLength: 2 }, // 全场让球
	{ class: "magnitude", cardType: "magnitude", type: 3, selectionsLength: 2 }, // 全场大小
	{ class: "capot", cardType: "capot", type: 15, selectionsLength: 3 }, // 半场独赢
	{ class: "handicap", cardType: "handicap", type: 7, selectionsLength: 2 }, // 半场让球
	{ class: "magnitude", cardType: "magnitude", type: 8, selectionsLength: 2 }, // 半场大小
];

// 获取侧边栏图标名称
const getIconName = (tool: any, events: any, index: number) => {
	const { eventId } = SidebarStore.getEventsInfo; // 获取当前事件 ID
	const isEventActive = events.eventId === eventId; // 判断事件是否活跃
	if (!isEventActive) {
		return tool.iconName; // 非活跃状态返回默认图标
	}
	const activeIndex = SidebarStore.sidebarStatus === "scoreboard" ? 0 : 1; // 根据侧边栏状态确定活跃索引
	return index === activeIndex ? tool.iconName_active : tool.iconName; // 返回相应的图标名称
};

// 处理赔率变化事件
const oddsChange = (obj: any) => {
	emit("oddsChange", obj); // 触发自定义事件
};

// 点击对应工具的处理逻辑
const handleClick = (tool: any) => {
	tool.action(tool.param); // 执行对应工具的动作
};

// 计算工具图标的显示状态
const tools = computed(() => {
	const baseTools = [
		{
			iconName: "sports-score_icon", // 默认图标名称
			iconName_active: "sports-score_icon_active", // 激活状态的图标名称
			tooltipText: "比分板", // 工具提示文本
			action: (event: any) => toggleEventScoreboard(event), // 点击时执行的动作
			param: props.event, // 传递的参数
		},
	];

	// 判断是否有视频源并添加到工具数组中
	if (props.event.streamingOption !== 0 && props.event.channelCode) {
		baseTools.push({
			iconName: "sports-live_icon",
			iconName_active: "sports-live_icon_active",
			tooltipText: "视频源",
			action: (event: any) => toggleEventScoreboard(event, true), // 点击时执行的动作
			param: props.event, // 传递的参数
		});
	}

	return baseTools; // 返回工具数组
});
</script>

<style scoped lang="scss">
.league-content {
	width: 100%;
	height: 120px;
	display: flex;
	background-color: var(--Bg1);
	border-bottom: 1px solid var(--Line_2);
	&:last-child {
		border-bottom: 0px;
	}

	.league {
		min-width: 284px;
		height: 100%;
	}

	.league-markets {
		min-width: 600px;
		display: flex;
		gap: 4px;
		padding: 8px 4px 8px 0px;
		overflow: hidden;
		.capot {
			width: 78px;
		}
		.handicap {
			width: 92px;
		}
		.magnitude {
			width: 118px;
		}
	}
	.league-option {
		width: 46px;
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
