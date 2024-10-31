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
			<Scoreboard />
			<Live />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TeamInfoCard, MarketColumn } from "/@/views/sports/tournamentViews/football/components/footballCard/index";
import useHeaderTools from "/@/views/sports/components/HeaderTools";

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

// 处理赔率变化事件
const oddsChange = (obj: any) => {
	emit("oddsChange", obj); // 触发自定义事件
};

// 工具栏按钮
const gameState = computed(() => props.event);
const { Live, Scoreboard } = useHeaderTools(gameState);
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
