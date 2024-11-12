<template>
	<div class="card-container basketball-bet">
		<!-- 头部 -->
		<div class="card-header" :class="{ toggle: !isExpanded }" @click="toggleDisplay">
			<!-- 联赛信息 -->
			<div class="league-info">
				<!-- 联赛图标 -->
				<img class="league_icon" :src="teamData.leagueIconUrl" alt="" />
				<!-- 联赛名称，最大宽度根据展开状态动态调整 -->
				<div class="league_name" :style="{ maxWidth: isExpanded ? '284px' : '' }">{{ teamData.leagueName }}</div>
			</div>
			<!-- 盘口表头，只有在展开状态下显示 -->
			<div class="market-name-info" v-if="isExpanded">
				<div class="market-name-list">
					<!-- 渲染盘口类型列表 -->
					<div class="label" :class="{ large: index === 3 }" v-for="(betType, index) in SportsCommonFn.betTypeMap[2]" :key="betType">
						{{ betType }}
					</div>
				</div>
			</div>
			<!-- 头部图标，根据展开状态旋转 -->
			<div class="header-icon">
				<span class="icon" :class="{ 'icon-expanded': !isExpanded }">
					<svg-icon name="sports-arrow" width="8px" height="12px"></svg-icon>
				</span>
			</div>
		</div>
		<!-- 展开状态下显示事件项 -->
		<template v-if="isExpanded">
			<EventItem v-for="(event, index) in teamData.events" :key="index" :event="event" :displayContent="isExpanded" :dataIndex="props.dataIndex" />
		</template>
	</div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, defineAsyncComponent } from "vue";
import SportsCommonFn from "/@/views/sports/utils/common";
const EventItem = defineAsyncComponent(() => import("/@/views/sports/tournamentViews/basketball/components/rollingCard/components/eventItem/eventItem.vue"));
interface teamDataType {
	/** 数据索引 */
	dataIndex: number;
	/** 队伍数据 */
	teamData: any;
	/** 是展开状态？ */
	isExpanded?: boolean;
}
const props = withDefaults(defineProps<teamDataType>(), {
	isExpanded: true,
	/** 数据索引 */
	dataIndex: 0,
	/** 队伍数据 */
	teamData: () => {
		return {};
	},
});

const emit = defineEmits(["toggleDisplay"]);

/**
 * @description: 展开折叠处理
 * @return {*}
 */
const toggleDisplay = () => {
	emit("toggleDisplay", props.dataIndex);
};
</script>

<style scoped lang="scss">
.card-container {
	overflow: hidden;
	.card-header {
		display: flex;
		width: 100%;
		height: 34px;
		background: var(--Bg-6);
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
				color: var(--Text-s);
				font-family: "PingFang SC";
				font-size: 14px;
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
					width: 116px;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--Text-1);
					text-align: center;
					font-family: "PingFang SC";
					font-size: 12px;
					font-weight: 400;
				}
				.large {
					width: 236px;
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
