<template>
	<div class="card-container football-bet">
		<!-- 头部 -->
		<div class="card-header" @click="toggleDisplay">
			<!-- 联赛信息 -->
			<div class="league-info">
				<img class="league_icon" :src="teamData.leagueIconUrl" alt="League Icon" />
				<div class="league_name" :style="isExpanded ? 'max-width:284px' : ''">{{ teamData.leagueName }}</div>
			</div>
			<!-- 盘口表头 -->
			<template v-if="isExpanded">
				<div class="market-name-info">
					<div class="market-name-list">
						<!-- 遍历盘口类型 -->
						<div class="label" v-for="betType in SportsCommonFn.betTypeMap[1]" :key="betType">{{ betType }}</div>
					</div>
				</div>
			</template>

			<!-- 展开/收起图标 -->
			<div class="header-icon">
				<span class="icon" :class="{ 'icon-expanded': !isExpanded }"><svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon></span>
			</div>
		</div>
		<!-- 显示事件项 -->
		<template v-if="isExpanded">
			<EventItem v-for="(event, index) in teamData.events" :key="index" :event="event" :displayContent="isExpanded" :dataIndex="props.dataIndex" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import EventItem from "./components/eventItem/eventItem.vue";
import { useSportAttentionStore } from "/@/stores/modules/sports/sportAttention";
import SportsCommonFn from "/@/views/sports/utils/common";

// 获取运动关注状态管理
const SportAttentionStore = useSportAttentionStore();

// 定义组件属性类型
interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	teamData: any;
	isExpanded: boolean;
}

// 定义组件属性，使用默认值
const props = withDefaults(defineProps<teamDataType>(), {
	dataIndex: 0,
	teamData: () => ({}),
	isExpanded: true,
});

// 触发自定义事件
const emit = defineEmits(["toggleDisplay"]);

/**
 * @description: 切换展开/收起状态
 */
const toggleDisplay = () => {
	emit("toggleDisplay", props.dataIndex);
};

// 计算队伍所有事件的 ID
const eventIds = computed(() => {
	return props.teamData.events.map((event) => event.eventId.toString()) || []; // 生成 ID 数组
});

// 计算当前事件是否被关注
const isAttention = computed(() => {
	return eventIds.value.every((id) => SportAttentionStore.getAttentionEventIdList.includes(Number(id)));
});

// 使用 defineExpose 来暴露子组件的函数给父组件使用
defineExpose({
	toggleDisplay,
});
</script>

<style scoped lang="scss">
.card-container {
	padding-bottom: 5px;
	overflow: hidden;
	.card-header {
		display: flex;
		width: 100%;
		height: 34px;
		background: var(--Bg6);
		box-shadow: 0px 1px 2px 0px rgba(255, 255, 255, 0.25) inset;
		border-radius: 8px 8px 0px 0px;
		cursor: pointer;

		.league-info {
			min-width: 284px;
			// max-width: 284px;
			flex: 1;
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 8px;
			box-sizing: border-box;
			.league_icon {
				width: 20px;
				height: 20px;
			}
			.league_name {
				color: var(--Text_s);
				font-family: "PingFang SC";
				font-size: 16px;
				font-weight: 300;
				white-space: nowrap; /* 防止文本换行 */
				overflow: hidden; /* 超出部分隐藏 */
				text-overflow: ellipsis; /* 超出部分显示省略号 */
			}
		}
		.market-name-info {
			width: 600px;
			.market-name-list {
				height: 100%;
				display: flex;
				gap: 4px;
				padding-right: 4px;
				.label {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--Text1);
					text-align: center;
					font-family: "PingFang SC";
					font-size: 14px;
					font-weight: 400;
					/* 根据标签的顺序设置不同的宽度 */
					&:nth-child(1),
					&:nth-child(4) {
						width: 78px; /* 第一和第三个标签的宽度 */
					}
					&:nth-child(2),
					&:nth-child(5) {
						width: 92px; /* 第二和第四个标签的宽度 */
					}
					&:nth-child(3),
					&:nth-child(6) {
						width: 118px; /* 第五和第六个标签的宽度 */
					}
				}
			}
		}
		.header-icon {
			width: 46px;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			.icon {
				transform: rotate(-90deg);
				transition: transform 0.3s ease;

				&.icon-expanded {
					transform: rotate(90deg);
				}
			}
		}
	}
}
</style>
